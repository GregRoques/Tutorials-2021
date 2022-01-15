const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

// Event Listeners
addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// animation loop
function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "#1A1A23";
  c.fillRect(0, 0, canvas.width, canvas.height);

  const blueRectX_left = canvas.width / 2;
  const blueRectY_top = canvas.height / 2 - 50;
  if (
    mouse.x + 100 >= blueRectX_left - 50 && // right collision
    mouse.x <= blueRectX_left - 50 + 100 && // left collision
    mouse.y + 100 >= blueRectY_top && // bottom collision
    mouse.y <= blueRectY_top + 100 // top collision
  ) {
    console.log("coliding");
  }

  // red rectangle
  c.fillStyle = "#E86262";
  c.fillRect(mouse.x, mouse.y, 100, 100); // left x position, top y position, right (left + 100), bottom (top + 100)

  // blue rectangle
  c.fillStyle = "#92ABEA";
  c.fillRect(canvas.width / 2 - 50, canvas.height / 2 - 50, 100, 100);
}

animate();
