import { initExperience } from "./Experience.js";
import { startRain } from "./Rain.js";
import { startAnimations } from "./Animations.js";

window.addEventListener("DOMContentLoaded", () => {
    initExperience();
    startRain();
    startAnimations();
});
