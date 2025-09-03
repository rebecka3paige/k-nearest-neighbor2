// KNN Web App
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const kSelect = document.getElementById('k');
const resetBtn = document.getElementById('reset');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const POINT_RADIUS = 14;
const INIT_POINTS = () => Math.floor(Math.random() * 8) + 7; // 7-14 points
const RANDOM_NUM = () => Math.floor(Math.random() * 100) + 1; // 1-100

let points = [];
let K = parseInt(kSelect.value);
let lastKNeighbors = [];
let lastNewPoint = null;

function randomPoint() {
  return {
    x: Math.random() * (WIDTH - 2 * POINT_RADIUS) + POINT_RADIUS,
    y: Math.random() * (HEIGHT - 2 * POINT_RADIUS) + POINT_RADIUS,
    value: RANDOM_NUM(),
    isNew: false
  };
}

function drawPoints() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  // Draw lines to k neighbors if present
  if (lastNewPoint && lastKNeighbors.length > 0) {
    ctx.save();
    ctx.strokeStyle = '#e91e63';
    ctx.lineWidth = 2;
    for (const p of lastKNeighbors) {
      ctx.beginPath();
      ctx.moveTo(lastNewPoint.x, lastNewPoint.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
    ctx.restore();
  }
  for (const p of points) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, POINT_RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle = p.isNew ? '#4caf50' : '#2196f3';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.value, p.x, p.y);
  }
}

function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function knnNeighbors(newPoint, k) {
  return points
    .map(p => ({...p, dist: distance(p, newPoint)}))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, k);
}

function knnValue(newPoint, k) {
  const neighbors = knnNeighbors(newPoint, k);
  const avg = Math.round(neighbors.reduce((sum, p) => sum + p.value, 0) / k);
  lastKNeighbors = neighbors;
  lastNewPoint = newPoint;
  return avg;
}

function addRandomPoints() {
  points = [];
  for (let i = 0; i < INIT_POINTS(); i++) {
    points.push(randomPoint());
  }
}

function reset() {
  addRandomPoints();
  lastKNeighbors = [];
  lastNewPoint = null;
  drawPoints();
}

canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const newPoint = { x, y, value: 0, isNew: true };
  newPoint.value = knnValue(newPoint, K);
  points.push(newPoint);
  drawPoints();
});

kSelect.addEventListener('change', e => {
  K = parseInt(kSelect.value);
});

resetBtn.addEventListener('click', reset);

// Initial draw
reset();
