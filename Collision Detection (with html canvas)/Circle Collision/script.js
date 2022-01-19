// Mouse Position
let mouse = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
};

// My Circle
const myCircle = document.createElement("div");
myCircle.id = "myCircle";
myCircle.style = `position: absolute;width: 100px; height:100px; border-radius: 50%; background: red; top: ${mouse.y}px; left: ${mouse.x}px`;
document.body.appendChild(myCircle);

// Static Circle
const static = document.createElement("div");
static.id = "static";
static.style = `position: absolute;width: 150px; height:150px; border-radius: 50%; background: blue; top: ${
  mouse.y - 150
}px; left: ${mouse.x - 150}px`;
document.body.appendChild(static);

// Circle Coordinates & Circumferences

const staticCircleRect = static.getBoundingClientRect();

const staticCircumference = staticCircleRect.width * 3.14;

// Event Listeners
addEventListener("mousemove", (e) => {
  e.preventDefault();
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  const myCircleRect = myCircle.getBoundingClientRect();
  const sumOfCircleRadii = myCircleRect.width / 2 + staticCircleRect.width / 2;
  const distanceY =
    staticCircleRect.top +
    staticCircleRect.height / 2 -
    (mouse.y + myCircleRect.height / 2);
  const distanceX =
    staticCircleRect.left +
    staticCircleRect.width / 2 -
    (mouse.x + myCircleRect.width / 2);
  const distanceApart = Math.sqrt(
    Math.pow(distanceX, 2) + Math.pow(distanceY, 2)
  );
  console.log(distanceApart);
  console.log(sumOfCircleRadii);

  if (distanceApart >= sumOfCircleRadii) {
    myCircle.style.top = `${mouse.y}px`;
    myCircle.style.left = `${mouse.x}px`;
    static.classList.remove("blink");
  } else {
    static.classList.add("blink");
  }
}

animate();
