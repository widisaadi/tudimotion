import { loadFont as loadFredoka } from "@remotion/google-fonts/Fredoka";
import { loadFont as loadNunito } from "@remotion/google-fonts/Nunito";
import { loadFont as loadPatrick } from "@remotion/google-fonts/PatrickHand";

export const display = loadFredoka("normal", { weights: ["500", "600", "700"], subsets: ["latin"] }).fontFamily;
export const body = loadNunito("normal", { weights: ["700", "800", "900"], subsets: ["latin"] }).fontFamily;
export const chalk = loadPatrick("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
