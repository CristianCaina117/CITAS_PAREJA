export function startRain() {
    const canvas = document.getElementById("rainCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const drops = [];

    for (let i = 0; i < 200; i++) {
        drops.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            length: Math.random() * 20,
            speed: Math.random() * 5 + 2
        });
    }

    function drawRain() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 1;

        drops.forEach(drop => {
            ctx.beginPath();
            ctx.moveTo(drop.x, drop.y);
            ctx.lineTo(drop.x, drop.y + drop.length);
            ctx.stroke();

            drop.y += drop.speed;

            if (drop.y > canvas.height) {
                drop.y = -20;
            }
        });

        requestAnimationFrame(drawRain);
    }

    drawRain();
}
