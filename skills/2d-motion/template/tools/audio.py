"""Builds public/audio/soundtrack.wav = Gemini voiceover + earshot-bank SFX + BGM composed from earshot-bank notes.

Inputs (all data, no code to edit):
  src/timing.json         scene lengths, transition length, VO start frame
  public/vo/s<N>.wav      one voiceover file per scene (tools/tts.mjs)
  audio/sfx-cues.json     every sound effect: scene, frame, bank id, gain, align
  audio/music.json        BGM tempo, chord progressions, minor scenes, levels

Run from the project root with a Python that has earshot (see references/audio.md):
    <earshot-python> -I tools/audio.py
Deterministic: same inputs -> byte-identical soundtrack.
"""
import json
import os
import sys

import numpy as np
import pyloudnorm as pyln
import soundfile as sf
import soxr
from scipy.ndimage import minimum_filter1d

try:
    from earshot.forge import bank
except ImportError:
    sys.exit("earshot is not importable from this Python. Install it first (references/audio.md).")

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SR = 48000


def load(rel):
    with open(os.path.join(ROOT, rel), encoding="utf-8") as f:
        return json.load(f)


T = load("src/timing.json")
FPS, TR, VO_START = T["fps"], T["transition"], T["voStart"]
DUR = T["scenes"]
STARTS = [sum(DUR[:i]) - TR * i for i in range(len(DUR))]
TOTAL_F = sum(DUR) - TR * (len(DUR) - 1)
N = int(round(TOTAL_F / FPS * SR)) + 2 * SR  # tail room, trimmed at the end


def at(scene, frame):
    """absolute seconds of a frame inside scene n (1-based)"""
    return (STARTS[scene - 1] + frame) / FPS


_cache = {}


def take(sid, **kw):
    key = (sid, tuple(sorted(kw.items())))
    if key not in _cache:
        y, meta = bank.render(sid, **kw)
        y = y if y.ndim == 2 else np.stack([y, y], 1)
        _cache[key] = (y.astype(np.float64), meta)
    return _cache[key]


def place(bus, y, t0, gain_db):
    i0 = int(round(t0 * SR))
    if i0 < 0:
        y, i0 = y[-i0:], 0
    n = min(len(y), len(bus) - i0)
    if n > 0:
        bus[i0 : i0 + n] += y[:n] * 10 ** (gain_db / 20)


def build_sfx(cfg):
    bus = np.zeros((N, 2))
    for c in cfg["cues"]:
        if c["scene"] > len(DUR):
            sys.exit(f"sfx cue for scene {c['scene']} but timing.json has {len(DUR)} scenes")
        y, m = take(c["sound"], **c.get("knobs", {}))
        anchor = m["peak_s"] if c.get("align", "onset") == "peak" else m["onset_s"]
        place(bus, y, at(c["scene"], c["frame"]) - anchor, c["gain_db"])
    tr = cfg.get("transitions", {})
    for i, kind in enumerate(tr.get("kinds", [])[: len(DUR) - 1]):
        if kind not in tr:
            continue
        y, m = take(tr[kind])
        place(bus, y, (STARTS[i + 1] + TR / 2) / FPS - m["peak_s"], tr.get("gain_db", -21))
    return bus


def build_bgm(cfg):
    bus = np.zeros((N, 2))
    beat = 60 / cfg["bpm"]
    bar = 4 * beat
    minor_spans = [(at(s, 0), at(s + 1, 0) if s < len(DUR) else TOTAL_F / FPS) for s in cfg.get("minor_scenes", [])]
    end_t = TOTAL_F / FPS
    bar_i, t = 0, 0.0
    while t < end_t - bar:  # the last bar is the final chord
        minor = any(a - bar * 0.5 <= t < b - bar * 0.5 for a, b in minor_spans)
        bass, arp = (cfg["minor"] if minor else cfg["happy"])[bar_i % len(cfg["happy"])]
        place(bus, take("mallet/marimba", pitch=bass)[0], t, -15)
        if not minor:
            place(bus, take("mallet/marimba", pitch=bass)[0], t + 2 * beat, -19)
            for b in (1, 3):
                place(bus, take("knock/wood")[0], t + b * beat, -27)
        for k, note in enumerate(arp):
            if note is None:
                continue
            place(bus, take("pluck/kalimba_soft", pitch=note, dur=1.6 if minor else 0.9)[0], t + k * beat / 2, -15 if k % 2 == 0 else -18)
        bar_i, t = bar_i + 1, t + bar
    for k, note in enumerate(cfg["final_chord"]):
        place(bus, take("pluck/kalimba_ring", pitch=note)[0], t + k * 0.06, -14)
    place(bus, take("mallet/marimba", pitch=cfg["final_bass"])[0], t, -14)
    fin = np.clip(np.arange(N) / SR / max(cfg.get("fade_in_s", 1.0), 1e-3), 0, 1)[:, None]
    return bus * fin


def build_vo():
    bus = np.zeros((N, 2))
    for i in range(len(DUR)):
        path = os.path.join(ROOT, "public", "vo", f"s{i + 1}.wav")
        if not os.path.exists(path):
            sys.exit(f"missing {path}: run `npm run tts` first")
        y, sr = sf.read(path, always_2d=True)
        y = y.mean(1)
        if sr != SR:
            y = soxr.resample(y, sr, SR)
        y = y / max(1e-9, np.abs(y).max()) * 10 ** (-3 / 20)
        place(bus, np.stack([y, y], 1), at(i + 1, VO_START), 0)
    return bus


def duck(bgm, vo, depth_db):
    """music down while the narrator speaks: 40 ms attack, 350 ms release"""
    m = np.abs(vo).mean(1)
    hop = 480
    env = np.array([m[i : i + hop].max() for i in range(0, len(m), hop)])
    active = (env > 10 ** (-40 / 20)).astype(float)
    g = np.zeros_like(active)
    a, r = np.exp(-hop / SR / 0.04), np.exp(-hop / SR / 0.35)
    for i, x in enumerate(active):
        prev = g[i - 1] if i else 0
        g[i] = x + (prev - x) * (a if x > prev else r)
    gain = 10 ** (-depth_db * g / 20)
    return bgm * np.interp(np.arange(len(m)), np.arange(len(gain)) * hop, gain)[:, None]


def limit(x, ceiling_db=-1.5):
    """lookahead peak limiter (5 ms lookahead, 120 ms release)"""
    c = 10 ** (ceiling_db / 20)
    need = np.minimum(1.0, c / np.maximum(np.abs(x).max(1), 1e-9))
    need = minimum_filter1d(need, size=2 * int(0.005 * SR) + 1)
    g = np.empty_like(need)
    rel = np.exp(-1 / (SR * 0.12))
    cur = 1.0
    for i, v in enumerate(need):
        cur = v if v < cur else v + (cur - v) * rel
        g[i] = cur
    return x * g[:, None]


def main():
    out_dir = os.path.join(ROOT, "public", "audio")
    os.makedirs(out_dir, exist_ok=True)
    music = load("audio/music.json")
    vo, sfx, bgm = build_vo(), build_sfx(load("audio/sfx-cues.json")), build_bgm(music)
    bgm = duck(bgm, vo, music.get("duck_db", 9))
    mix = vo + sfx + bgm * 10 ** (music.get("gain_db", -2) / 20)
    end = int(round((TOTAL_F / FPS) * SR))
    mix = mix[:end]
    fade = int(0.6 * SR)
    mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
    meter = pyln.Meter(SR)
    lufs = meter.integrated_loudness(mix)
    mix = limit(mix * 10 ** ((-14 - lufs) / 20))
    sf.write(os.path.join(out_dir, "soundtrack.wav"), mix.astype(np.float32), SR, subtype="PCM_24")
    for name, stem in (("vo", vo), ("sfx", sfx), ("bgm", bgm)):
        sf.write(os.path.join(out_dir, f"stem_{name}.wav"), stem[:end].astype(np.float32), SR, subtype="PCM_24")
    print(json.dumps({
        "seconds": round(end / SR, 2),
        "lufs": round(meter.integrated_loudness(mix), 2),
        "peak_dbfs": round(20 * np.log10(np.abs(mix).max()), 2),
        "vo_lufs": round(meter.integrated_loudness(vo[:end]), 1),
        "bgm_lufs": round(meter.integrated_loudness(bgm[:end] * 10 ** (music.get("gain_db", -2) / 20)), 1),
        "sfx_cues": len(load("audio/sfx-cues.json")["cues"]),
    }))


if __name__ == "__main__":
    main()
