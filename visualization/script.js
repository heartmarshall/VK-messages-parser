// set up canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1920;
canvas.height = 1080;

// set up variables
let lines = [];
const font = 'Roboto';
const interval = 150; // in milliseconds

// load lines from file
fetch('messages.txt')
  .then(response => response.text())
  .then(text => {
    lines = text.trim().split('\n');
  })
  .catch(error => {
    console.error(error);
  });

// define pastel colors
const shadesOfRed = ['#FF5733', '#FF8D1A', '#FFC300', '#FF5733', '#C70039', '#900C3F'];
const pastelColors = ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff'];

// start visualization
let lineIndex = 0;
let linesVisible = [];

setInterval(() => {
  // add new line
  const line = lines[lineIndex];
  const color = getRandomPastelColor();
  const x = getRandomX(ctx.measureText(line).width);
  const y = getRandomY();
  const alpha = 1;

  linesVisible.push({ text: line, color, x, y, alpha });

  // move to next line
  lineIndex = getRandomInt(0, lines.length - 1);
}, interval);

// update canvas
setInterval(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < linesVisible.length; i++) {
    const { text, color, x, y, alpha } = linesVisible[i];
    const fontSize = 30;
    const fontString = `${fontSize}px ${font}`;

    ctx.font = fontString;
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.fillText(text, x, y);

    // update alpha and remove line if it's too transparent
    linesVisible[i].alpha -= 0.05;
    if (linesVisible[i].alpha < 0) {
      linesVisible.splice(i, 1);
      i--;
    }

    // add glowing effect
    const textWidth = ctx.measureText(text).width;
    const centerX = x + textWidth / 2;
    const centerY = y + fontSize / 2;
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, fontSize);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, color + 'ff');
    ctx.fillStyle = gradient;
    ctx.fillText(text, x, y);
  }
}, 200);

// utility functions
function getRandomX(textWidth) {
  return Math.floor(Math.random() * (canvas.width - textWidth - 150));
}

function getRandomY() {
  const fontSize = 36;
  return Math.floor(Math.random() * (canvas.height - fontSize - 150)) + fontSize;
}

function getRandomPastelColor() {
  return shadesOfRed[Math.floor(Math.random() * pastelColors.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
