// ─── PDF.js SETUP ─────────────────────────────────────
if (typeof pdfjsLib !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

// ─── STATE ────────────────────────────────────────────
const state = {
  level: 'standard',
  stamp: 'classified',
  fileType: null,
  fileData: null,
  fileName: '',
  textContent: '',
  rendered: false
};

// ─── COUNTER (fake but convincing) ───────────────────
function initCounter() {
  const base = 124831;
  const perDay = 2847;
  const daysSinceLaunch = 14;
  const todayBase = Math.floor((Date.now() % 86400000) / 86400000 * perDay);
  let count = base + (daysSinceLaunch * perDay) + todayBase;
  document.getElementById('docCounter').textContent = count.toLocaleString();

  setInterval(() => {
    count += Math.floor(Math.random() * 3);
    document.getElementById('docCounter').textContent = count.toLocaleString();
  }, 8000 + Math.random() * 12000);
}
initCounter();

// ─── GITHUB STARS (live) ─────────────────────────────
async function fetchStars() {
  try {
    const res = await fetch('https://api.github.com/repos/pietrorenzii/epstify');
    const data = await res.json();
    const stars = data.stargazers_count || 0;
    const el = document.getElementById('ghStars');
    if (el) el.textContent = '★ ' + stars.toLocaleString();
  } catch(e) {
    // silently fail — badge stays at ★ 0
  }
}
fetchStars();

// ─── LEVEL SELECTION ──────────────────────────────────
document.querySelectorAll('.level-option').forEach(el => {
  el.addEventListener('click', () => {
    document.querySelectorAll('.level-option').forEach(x => x.classList.remove('selected'));
    el.classList.add('selected');
    state.level = el.dataset.level;
  });
});

// ─── STAMP SELECTION ──────────────────────────────────
document.querySelectorAll('.stamp-opt').forEach(el => {
  el.addEventListener('click', () => {
    document.querySelectorAll('.stamp-opt').forEach(x => x.classList.remove('selected'));
    el.classList.add('selected');
    state.stamp = el.dataset.stamp;
  });
});

// ─── FILE DROP ZONE ───────────────────────────────────
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const textInput = document.getElementById('textInput');

dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') fileInput.click(); });

dropZone.addEventListener('dragover', e => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) handleFile(fileInput.files[0]);
});

textInput.addEventListener('input', () => {
  if (textInput.value.trim()) {
    state.fileType = 'text';
    state.textContent = textInput.value;
    state.fileName = 'document.txt';
    enableGenerate();
    checkEasterEgg('document.txt');
  } else if (!state.fileData) {
    disableGenerate();
  }
});

function handleFile(file) {
  const name = file.name.toLowerCase();
  state.fileName = file.name;

  checkEasterEgg(name);

  if (name.endsWith('.pdf')) {
    state.fileType = 'pdf';
    const reader = new FileReader();
    reader.onload = e => { state.fileData = e.target.result; enableGenerate(); };
    reader.readAsArrayBuffer(file);
  } else if (name.match(/\.(png|jpg|jpeg|gif|webp)$/)) {
    state.fileType = 'image';
    const reader = new FileReader();
    reader.onload = e => { state.fileData = e.target.result; enableGenerate(); };
    reader.readAsDataURL(file);
  } else if (name.endsWith('.txt')) {
    state.fileType = 'text';
    const reader = new FileReader();
    reader.onload = e => {
      state.textContent = e.target.result;
      textInput.value = e.target.result;
      enableGenerate();
    };
    reader.readAsText(file);
  } else {
    alert('Format not supported. Try PDF, image, or TXT.');
    return;
  }

  dropZone.querySelector('.drop-title').textContent = `LOADED: ${file.name.toUpperCase()}`;
  dropZone.querySelector('.drop-sub').textContent = `${(file.size/1024).toFixed(1)}KB ready for classification`;
}

// ─── EASTER EGGS ──────────────────────────────────────
const easterEggs = {
  'resume': '⚠️ ALERT: This resume has been flagged by the Bureau. Candidate knows too much. Forwarded to [████████] for review. Hiring probability: [REDACTED].',
  'cv': '⚠️ ALERT: CV intercepted by counterintelligence. Subject has suspiciously impressive qualifications. Cross-reference with [████] database initiated.',
  'dating': '⚠️ SENSITIVE: Dating profile flagged for excessive optimism and unverified claims. Forwarded to the Department of ████████ Affairs.',
  'bank': '⚠️ FINANCIAL INTEL: Document contains classified numerical sequences. Wire transfer origins: [████]. Destination: [████]. Amount: ████████.',
  'therapy': '⚠️ PSYCH EVAL INTERCEPTED: Subject is aware of [████████]. Monitoring level upgraded to OMEGA.',
  'password': '⚠️ CRITICAL BREACH: Password document acquired. Forwarding to ████████. Have a nice day.',
  'secret': '⚠️ SECRET WITHIN A SECRET DETECTED. We\'re going to need a bigger stamp.',
  'epstein': '⚠️ CLIENT LIST DETECTED. Document being forwarded to [████████], [████████], and [████████]. Discretion advised.',
};

function checkEasterEgg(name) {
  const lower = name.toLowerCase();
  const egg = document.getElementById('easterEgg');
  egg.style.display = 'none';
  for (const [key, msg] of Object.entries(easterEggs)) {
    if (lower.includes(key)) {
      egg.textContent = msg;
      egg.style.display = 'block';
      break;
    }
  }
}

// ─── GENERATE ─────────────────────────────────────────
function enableGenerate() {
  document.getElementById('generateBtn').disabled = false;
}
function disableGenerate() {
  document.getElementById('generateBtn').disabled = true;
}

document.getElementById('generateBtn').addEventListener('click', generateDocument);

async function generateDocument() {
  showLoading(true);
  await sleep(600 + Math.random() * 800); // dramatic pause

  try {
    if (state.fileType === 'text') {
      renderTextDocument(state.textContent || textInput.value);
    } else if (state.fileType === 'image') {
      await renderImageDocument(state.fileData);
    } else if (state.fileType === 'pdf') {
      await renderPDFDocument(state.fileData);
    }
  } catch(e) {
    console.error(e);
    alert('Error processing document. Try a different file.');
  }

  showLoading(false);
  document.getElementById('resultSection').style.display = 'block';
  document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  state.rendered = true;
}

// ─── TEXT DOCUMENT ────────────────────────────────────
function renderTextDocument(text) {
  const before = document.getElementById('beforePanel');
  const after = document.getElementById('afterPanel');

  const lines = text.split('\n').filter(l => l.trim());

  // Before panel
  before.innerHTML = `<div class="text-preview">${lines.map(l => `<div>${escapeHtml(l)}</div>`).join('')}</div>`;

  // After panel
  const redactedLines = lines.map(line => redactLine(line, state.level));
  const afterHtml = `<div class="redacted-preview">
    ${redactedLines.join('<br>')}
    <div class="stamp-overlay">${getStampHTML(state.stamp, 0.18)}</div>
  </div>`;
  after.innerHTML = afterHtml;

  // Populate export doc
  buildExportDoc(lines, redactedLines);
}

function redactLine(line, level) {
  const probs = { mild: 0.25, standard: 0.55, maximum: 0.85 };
  const p = probs[level];
  const words = line.split(' ');
  const result = words.map(word => {
    if (!word.trim()) return word;
    if (Math.random() < p) {
      const w = Math.max(40, Math.min(word.length * 9, 120));
      return `<span class="redact-bar" style="width:${w}px;"></span>`;
    }
    return `<span style="color:#1a1a1a;">${escapeHtml(word)}</span>`;
  });
  return result.join(' ');
}

// ─── IMAGE DOCUMENT ───────────────────────────────────
async function renderImageDocument(dataURL) {
  const before = document.getElementById('beforePanel');
  const after = document.getElementById('afterPanel');

  // Before
  before.innerHTML = `<img src="${dataURL}" style="max-width:100%;max-height:460px;object-fit:contain;">`;

  // Redact on canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  await new Promise(res => {
    img.onload = res;
    img.src = dataURL;
  });

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  redactCanvas(ctx, canvas.width, canvas.height, state.level);
  addStampToCanvas(ctx, canvas.width, canvas.height, state.stamp);

  after.innerHTML = '';
  after.appendChild(canvas);
  canvas.style.maxWidth = '100%';
  canvas.style.maxHeight = '460px';
  canvas.style.objectFit = 'contain';

  state.exportCanvas = canvas;
}

// ─── PDF DOCUMENT ─────────────────────────────────────
async function renderPDFDocument(arrayBuffer) {
  const before = document.getElementById('beforePanel');
  const after = document.getElementById('afterPanel');

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 1.2 });

  // Render original
  const canvasBefore = document.createElement('canvas');
  canvasBefore.width = viewport.width;
  canvasBefore.height = viewport.height;
  await page.render({ canvasContext: canvasBefore.getContext('2d'), viewport }).promise;
  canvasBefore.style.maxWidth = '100%';
  before.innerHTML = '';
  before.appendChild(canvasBefore);

  // Render redacted
  const canvasAfter = document.createElement('canvas');
  canvasAfter.width = viewport.width;
  canvasAfter.height = viewport.height;
  const ctxAfter = canvasAfter.getContext('2d');
  await page.render({ canvasContext: ctxAfter, viewport }).promise;

  redactCanvas(ctxAfter, canvasAfter.width, canvasAfter.height, state.level);
  addStampToCanvas(ctxAfter, canvasAfter.width, canvasAfter.height, state.stamp);

  canvasAfter.style.maxWidth = '100%';
  after.innerHTML = '';
  after.appendChild(canvasAfter);

  state.exportCanvas = canvasAfter;
}

// ─── CANVAS REDACTION ENGINE ──────────────────────────
function redactCanvas(ctx, w, h, level) {
  const probs = { mild: 0.28, standard: 0.60, maximum: 0.88 };
  const p = probs[level];
  const lineH = Math.max(14, Math.floor(h / 40));

  ctx.fillStyle = '#0a0a0a';

  for (let y = 10; y < h - 10; y += lineH + 3) {
    if (Math.random() < p) {
      const barW = w * (0.35 + Math.random() * 0.6);
      const barX = Math.random() * (w - barW);
      ctx.fillRect(barX, y + 1, barW, lineH - 2);
    }
  }

  // [REDACTED] labels
  ctx.fillStyle = '#0a0a0a';
  ctx.font = `bold ${Math.floor(lineH * 0.7)}px monospace`;
  ctx.fillStyle = '#f0ead6';
  for (let y = 10; y < h - 10; y += lineH + 3) {
    if (Math.random() < 0.08) {
      ctx.fillText('[REDACTED]', w * 0.1 + Math.random() * w * 0.3, y + lineH * 0.8);
    }
  }
}

function addStampToCanvas(ctx, w, h, stamp) {
  const stamps = {
    classified: { text: 'CLASSIFIED', color: '#c0140a' },
    topsecret:  { text: 'TOP SECRET', color: '#c0140a' },
    eyesonly:   { text: 'EYES ONLY', color: '#1a4a1a' },
    fbi:        { text: 'F.B.I.', color: '#000080' }
  };

  const s = stamps[stamp] || stamps.classified;
  const fontSize = Math.floor(w / 7);

  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(-0.4);

  ctx.font = `bold ${fontSize}px 'Bebas Neue', Impact, sans-serif`;
  ctx.strokeStyle = s.color;
  ctx.lineWidth = Math.max(3, fontSize / 12);
  ctx.globalAlpha = 0.22;
  ctx.strokeText(s.text, -ctx.measureText(s.text).width / 2, fontSize / 3);

  ctx.restore();
}

// ─── EXPORT DOC ───────────────────────────────────────
function buildExportDoc(originalLines, redactedLines) {
  const stampLabels = {
    classified: 'CLASSIFIED',
    topsecret: 'TOP SECRET',
    eyesonly: 'EYES ONLY',
    fbi: 'FBI SENSITIVE'
  };

  const label = stampLabels[state.stamp] || 'CLASSIFIED';
  document.getElementById('docStampLabel').textContent = label;
  document.getElementById('watermarkText').textContent = label;
  document.getElementById('docDate').textContent = `DATE: ${new Date().toLocaleDateString('en-US', {month:'long',day:'numeric',year:'numeric'}).toUpperCase()}`;

  const bodyHtml = redactedLines.map((line, i) => {
    return `<div style="margin-bottom:4px;">${line}</div>`;
  }).join('');

  document.getElementById('docBody').innerHTML = bodyHtml;
  document.getElementById('centerStamp').innerHTML = getStampHTML(state.stamp, 0.22);
}

function getStampHTML(stamp, opacity) {
  const stamps = {
    classified: `<div class="stamp-classified" style="opacity:${opacity}">CLASSIFIED</div>`,
    topsecret:  `<div class="stamp-top-secret" style="opacity:${opacity}">TOP SECRET</div>`,
    eyesonly:   `<div class="stamp-eyes-only" style="opacity:${opacity}">EYES ONLY</div>`,
    fbi:        `<div class="stamp-fbi" style="opacity:${opacity}">F.B.I.</div>`
  };
  return stamps[stamp] || stamps.classified;
}

// ─── DOWNLOAD ─────────────────────────────────────────
document.getElementById('downloadBtn').addEventListener('click', async () => {
  showLoading(true);

  if (state.exportCanvas) {
    // Download canvas as PNG
    state.exportCanvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CLASSIFIED-${state.fileName.replace(/\.[^.]+$/, '')}-epstify.png`;
      a.click();
      URL.revokeObjectURL(url);
      showLoading(false);
    }, 'image/png');
  } else {
    // For text: capture the export doc div
    const docEl = document.getElementById('docWrapper');
    docEl.style.display = 'block';
    await sleep(100);

    html2canvas(docEl, {
      scale: 2,
      backgroundColor: '#f0ead6',
      useCORS: true
    }).then(canvas => {
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CLASSIFIED-${state.fileName.replace(/\.[^.]+$/, '')}-epstify.png`;
        a.click();
        URL.revokeObjectURL(url);
        docEl.style.display = 'none';
        showLoading(false);
      }, 'image/png');
    });
  }
});

// ─── SHARE ON X ───────────────────────────────────────
document.getElementById('shareBtn').addEventListener('click', () => {
  const msgs = [
    `just epstified my "${state.fileName}" 🔲\n\nturns out i know too much\n\nepstify.com`,
    `my "${state.fileName}" has been officially classified by the Epstein Bureau 🔲\n\nsome things are better left ████████\n\nepstify.com`,
    `the Bureau has epstified my ${state.fileName} 🔲\n\ndeclassified: never\n\nepstify.com`,
    `🔲 CLASSIFIED\n\njust redactified "${state.fileName}"\n\nepstify.com — Turn any doc into an Epstein File`,
  ];
  const msg = msgs[Math.floor(Math.random() * msgs.length)];
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
});

// ─── NEW DOCUMENT ─────────────────────────────────────
document.getElementById('newDocBtn').addEventListener('click', () => {
  state.fileType = null;
  state.fileData = null;
  state.fileName = '';
  state.textContent = '';
  state.exportCanvas = null;
  textInput.value = '';
  fileInput.value = '';
  dropZone.querySelector('.drop-title').textContent = 'DROP FILE TO CLASSIFY';
  dropZone.querySelector('.drop-sub').textContent = 'click to browse or drag & drop';
  document.getElementById('generateBtn').disabled = true;
  document.getElementById('resultSection').style.display = 'none';
  document.getElementById('easterEgg').style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── UTILS ───────────────────────────────────────────
function showLoading(show) {
  document.getElementById('loadingOverlay').classList.toggle('active', show);
}

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
