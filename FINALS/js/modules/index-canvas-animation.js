/*
  Canvas Background Animation 
  Renders subtle moving circles in the background
*/

export function initCanvasAnimation() {
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');

    /*
      Resizes canvas to fill the entire window
     */
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    // Initialize size and listen for window resize events
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    /*
      Main Animation Loop
     */
    function draw() {
        // Clear the screen
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set style
        ctx.fillStyle = "rgba(0, 169, 192, 0.03)";

        // Calculate time factor for movement
        const t = Date.now() * 0.001;

        // Draw 3 orbiting circles
        for (let i = 0; i < 3; i++) {
            const x = Math.sin(t + i) * 150 + (canvas.width * (i / 2));
            const y = Math.cos(t + i) * 50 + (canvas.height / 2);

            ctx.beginPath();
            ctx.arc(x, y, 400, 0, Math.PI * 2);
            ctx.fill();
        }
        requestAnimationFrame(draw);
    }
    draw();
}