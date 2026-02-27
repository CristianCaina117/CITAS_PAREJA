const canvas = document.getElementById("colorRain");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];
let isPlaying = false; // Control de reproducción
let autoFireworkInterval = null;

class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.createExplosion();
    }

    createExplosion() {
        const particleCount = Math.random() * 50 + 60; // 60-110 partículas
        const baseHue = Math.random() * 360;
        
        for (let i = 0; i < particleCount; i++) {
            const hueVariation = (Math.random() - 0.5) * 60;
            this.particles.push({
                x: this.x,
                y: this.y,
                angle: Math.random() * Math.PI * 2,
                speed: Math.random() * 6 + 2,
                radius: Math.random() * 3.5 + 1,
                alpha: 1,
                color: `hsl(${baseHue + hueVariation}, 100%, ${Math.random() * 20 + 50}%)`,
                gravity: 0.05
            });
        }
    }

    update() {
        this.particles.forEach(p => {
            p.x += Math.cos(p.angle) * p.speed;
            p.y += Math.sin(p.angle) * p.speed + p.gravity;
            p.speed *= 0.97;
            p.gravity += 0.02;
            p.alpha -= 0.012;
        });

        this.particles = this.particles.filter(p => p.alpha > 0);
    }

    draw() {
        this.particles.forEach(p => {
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = p.color;
            ctx.fill();
        });
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }
}

function animate() {
    ctx.fillStyle = "rgba(10, 10, 30, 0.15)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach(fw => {
        fw.update();
        fw.draw();
    });

    fireworks = fireworks.filter(fw => fw.particles.length > 0);

    requestAnimationFrame(animate);
}

animate();

// Función para iniciar fuegos artificiales
function startFireworks() {
    if (isPlaying) return;
    
    isPlaying = true;
    autoFireworkInterval = setInterval(() => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * (canvas.height / 2.5);
        fireworks.push(new Firework(x, y));
    }, 600);
}

// Función para detener fuegos artificiales
function stopFireworks() {
    isPlaying = false;
    if (autoFireworkInterval) {
        clearInterval(autoFireworkInterval);
        autoFireworkInterval = null;
    }
}

// Explosión al hacer clic (siempre disponible)
canvas.addEventListener("click", (e) => {
    fireworks.push(new Firework(e.clientX, e.clientY));
});

// Redimensionar canvas
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Exportar funciones para uso en Config.js
window.startFireworks = startFireworks;
window.stopFireworks = stopFireworks;