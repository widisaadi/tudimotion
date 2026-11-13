// Runs a Python script with the interpreter that has earshot: EARSHOT_PY from .env / env, else `python`.
import { spawnSync } from "node:child_process";
import { env } from "./env.mjs";
const py = env.EARSHOT_PY || (process.platform === "win32" ? "py" : "python3");
const r = spawnSync(py, ["-I", ...process.argv.slice(2)], { stdio: "inherit" });
process.exit(r.status ?? 1);
