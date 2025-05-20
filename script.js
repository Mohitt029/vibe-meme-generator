const canvas = document.getElementById('meme-canvas');
const ctx = canvas.getContext('2d');
const imageSelect = document.getElementById('image-select');
const topTextInput = document.getElementById('top-text');
const bottomTextInput = document.getElementById('bottom-text');
const textColorInput = document.getElementById('text-color');
const outlineColorInput = document.getElementById('outline-color');
const fontSizeInput = document.getElementById('font-size');
const fontStyleSelect = document.getElementById('font-style');
const bgColorInput = document.getElementById('bg-color');
const downloadBtn = document.getElementById('download-btn');
const textSelectRadios = document.getElementsByName('text-select');

let img = new Image();
canvas.width = 500;
canvas.height = 500;

// Text position variables
let topTextPos = { x: canvas.width / 2, y: 50 };
let bottomTextPos = { x: canvas.width / 2, y: canvas.height - 20 };
let isDragging = false;
let selectedText = 'top'; // Default to top text

// Ensure canvas context is available
if (!ctx) {
  console.error('Canvas context not available');
  alert('Error: Canvas context not available. Please check browser compatibility.');
}

// Function to draw the meme
function drawMeme() {
  // Set background color
  ctx.fillStyle = bgColorInput.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw image if loaded
  if (img.complete && img.src) {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Loading image...', canvas.width / 2, canvas.height / 2);
  }

  const topText = topTextInput.value.toUpperCase();
  const bottomText = bottomTextInput.value.toUpperCase();
  const textColor = textColorInput.value;
  const outlineColor = outlineColorInput.value;
  const fontSize = Math.max(20, parseInt(fontSizeInput.value)); // Minimum font size
  const fontStyle = fontStyleSelect.value;

  ctx.font = `${fontSize}px ${fontStyle}`;
  ctx.fillStyle = textColor;
  ctx.strokeStyle = outlineColor;
  ctx.lineWidth = 2;
  ctx.textAlign = 'center';

  // Highlight selected text with a subtle background
  if (selectedText === 'top' && topText) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(topTextPos.x - ctx.measureText(topText).width / 2 - 5, topTextPos.y - fontSize, ctx.measureText(topText).width + 10, fontSize + 10);
    ctx.fillStyle = textColor;
  } else if (selectedText === 'bottom' && bottomText) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(bottomTextPos.x - ctx.measureText(bottomText).width / 2 - 5, bottomTextPos.y - fontSize, ctx.measureText(bottomText).width + 10, fontSize + 10);
    ctx.fillStyle = textColor;
  }

  // Draw top text with wrapping
  if (topText) wrapText(ctx, topText, topTextPos.x, topTextPos.y, canvas.width - 40, fontSize);

  // Draw bottom text with wrapping
  if (bottomText) wrapText(ctx, bottomText, bottomTextPos.x, bottomTextPos.y, canvas.width - 40, fontSize);

  // Update URL with meme config
  const params = new URLSearchParams({
    image: imageSelect.value,
    top: topText,
    bottom: bottomText,
    textColor: textColor,
    outlineColor: outlineColor,
    fontSize: fontSize,
    font: fontStyle,
    bgColor: bgColorInput.value,
    topX: topTextPos.x,
    topY: topTextPos.y,
    bottomX: bottomTextPos.x,
    bottomY: bottomTextPos.y
  });
  history.replaceState(null, '', `?${params.toString()}`);
}

// Function to wrap text if it exceeds canvas width
function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let lines = [];

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  for (let i = 0; i < lines.length; i++) {
    context.fillText(lines[i], x, y - (lines.length - 1 - i) * lineHeight);
    context.strokeText(lines[i], x, y - (lines.length - 1 - i) * lineHeight);
  }
}

// Function to load image with error handling
function loadImage(src) {
  console.log('Attempting to load image:', src);
  img.src = '';
  img.src = src;
  img.onload = () => {
    console.log('Image loaded successfully:', src);
    drawMeme();
  };
  img.onerror = () => {
    console.error('Failed to load image:', src);
    ctx.fillStyle = bgColorInput.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Error loading image', canvas.width / 2, canvas.height / 2);
  };
}

// Load meme from URL parameters
function loadFromURL() {
  const params = new URLSearchParams(window.location.search);
  imageSelect.value = params.get('image') || 'images/distracted_boyfriend.jpg';
  topTextInput.value = params.get('top') || 'HELLO MAH GIRL!';
  bottomTextInput.value = params.get('bottom') || 'WOOOH WHAT AN ASS!';
  textColorInput.value = params.get('textColor') || '#ffffff';
  outlineColorInput.value = params.get('outlineColor') || '#000000';
  fontSizeInput.value = params.get('fontSize') || '30';
  fontStyleSelect.value = params.get('font') || 'Impact';
  bgColorInput.value = params.get('bgColor') || '#000000';
  topTextPos.x = parseFloat(params.get('topX')) || canvas.width / 2;
  topTextPos.y = parseFloat(params.get('topY')) || 50;
  bottomTextPos.x = parseFloat(params.get('bottomX')) || canvas.width / 2;
  bottomTextPos.y = parseFloat(params.get('bottomY')) || canvas.height - 20;
  selectedText = document.querySelector('input[name="text-select"]:checked').value;
  loadImage(imageSelect.value);
}

// Drag-and-drop functionality
canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const fontSize = Math.max(20, parseInt(fontSizeInput.value));
  const topText = topTextInput.value.toUpperCase();
  const bottomText = bottomTextInput.value.toUpperCase();

  // Check if click is within text bounds
  ctx.font = `${fontSize}px ${fontStyleSelect.value}`;
  const topTextWidth = ctx.measureText(topText).width;
  const bottomTextWidth = ctx.measureText(bottomText).width;

  if (selectedText === 'top' && topText && x >= topTextPos.x - topTextWidth / 2 && x <= topTextPos.x + topTextWidth / 2 && y >= topTextPos.y - fontSize && y <= topTextPos.y) {
    isDragging = true;
  } else if (selectedText === 'bottom' && bottomText && x >= bottomTextPos.x - bottomTextWidth / 2 && x <= bottomTextPos.x + bottomTextWidth / 2 && y >= bottomTextPos.y - fontSize && y <= bottomTextPos.y) {
    isDragging = true;
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Constrain text within canvas
  const fontSize = Math.max(20, parseInt(fontSizeInput.value));
  const text = selectedText === 'top' ? topTextInput.value.toUpperCase() : bottomTextInput.value.toUpperCase();
  const textWidth = ctx.measureText(text).width;
  const constrainedX = Math.max(textWidth / 2 + 10, Math.min(canvas.width - textWidth / 2 - 10, x));
  const constrainedY = Math.max(fontSize, Math.min(canvas.height - 10, y));

  if (selectedText === 'top') {
    topTextPos = { x: constrainedX, y: constrainedY };
  } else {
    bottomTextPos = { x: constrainedX, y: constrainedY };
  }
  drawMeme();
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
  drawMeme();
});

// Initial load
loadFromURL();

// Event listeners
imageSelect.addEventListener('change', () => {
  console.log('Image selected:', imageSelect.value);
  loadImage(imageSelect.value);
});
topTextInput.addEventListener('input', drawMeme);
bottomTextInput.addEventListener('input', drawMeme);
textColorInput.addEventListener('input', drawMeme);
outlineColorInput.addEventListener('input', drawMeme);
fontSizeInput.addEventListener('input', drawMeme);
fontStyleSelect.addEventListener('change', drawMeme);
bgColorInput.addEventListener('input', drawMeme);
downloadBtn.addEventListener('click', () => {
  console.log('Downloading meme');
  html2canvas(document.getElementById('meme-canvas')).then(canvas => {
    const link = document.createElement('a');
    link.download = 'vibe-meme.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
});
textSelectRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    selectedText = radio.value;
    drawMeme();
  });
});