/* ============================================================
   QR GENERATOR — qr-generator.js
   Generates a QR code in-browser using qrcode.min.js (local lib)
   and allows downloading a branded PNG (logo + QR).
   ============================================================ */

/* ============================================================
   CONFIGURATION — edit only this object
   ============================================================ */
const qrConfig = {
  companyLogo: "assets/company-logo.png",   // path to logo file
  qrTargetUrl: "https://takue01.github.io/businesscard/"    // URL the QR code points to
};

/* ============================================================
   INITIALISE
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  renderLogo();
  generateQR();
});

/* ── Logo ─────────────────────────────────────────────────── */
function renderLogo() {
  const logoEl = document.getElementById("company-logo");
  if (qrConfig.companyLogo) {
    logoEl.src = qrConfig.companyLogo;
    logoEl.alt = "Company Logo";
    logoEl.onerror = () => {
      logoEl.style.display = "none";
      document.getElementById("logo-placeholder").style.display = "flex";
    };
  } else {
    logoEl.style.display = "none";
    document.getElementById("logo-placeholder").style.display = "flex";
  }
}

/* ── QR Code ──────────────────────────────────────────────── */
function generateQR() {
  const container = document.getElementById("qr-container");
  container.innerHTML = ""; // clear any previous

  /* QRCode.js (loaded via libs/qrcode.min.js) */
  new QRCode(container, {
    text:          qrConfig.qrTargetUrl,
    width:         240,
    height:        240,
    colorDark:     "#111827",
    colorLight:    "#ffffff",
    correctLevel:  QRCode.CorrectLevel.H   // High — tolerates logo overlay
  });

  /* The library appends a canvas; give it a moment to render */
  setTimeout(() => {
    const canvas = container.querySelector("canvas");
    if (canvas) {
      canvas.style.borderRadius = "8px";
      canvas.style.display      = "block";
    }
  }, 100);
}

/* ============================================================
   DOWNLOAD — compose logo + QR onto a canvas, export as PNG
   ============================================================ */
function downloadQR() {
  const qrCanvas = document.querySelector("#qr-container canvas");
  if (!qrCanvas) {
    alert("QR code not ready yet. Please wait a moment and try again.");
    return;
  }

  const qrSize    = qrCanvas.width;   // typically 240
  const padding   = 40;               // padding around content
  const logoH     = 80;               // logo height in the export
  const gap       = 24;               // gap between logo and QR
  const totalW    = qrSize + padding * 2;
  const totalH    = padding + logoH + gap + qrSize + padding;

  /* Create off-screen canvas */
  const canvas = document.createElement("canvas");
  canvas.width  = totalW  * 2;   // ×2 for retina / print quality
  canvas.height = totalH  * 2;
  const ctx = canvas.getContext("2d");
  ctx.scale(2, 2);               // work in logical pixels

  /* Background */
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, totalW, totalH);

  /* --- Draw QR first so we can overlay logo on top --- */
  const drawQR = () => {
    ctx.drawImage(qrCanvas, padding, padding + logoH + gap, qrSize, qrSize);
    triggerDownload(canvas);
  };

  /* --- Draw logo --- */
  if (qrConfig.companyLogo) {
    const logoImg = new Image();
    logoImg.onload = () => {
      /* Scale logo proportionally to fit logoH */
      const scale   = logoH / logoImg.naturalHeight;
      const logoW   = Math.min(logoImg.naturalWidth * scale, qrSize); // max = QR width
      const logoX   = (totalW - logoW) / 2;
      ctx.drawImage(logoImg, logoX, padding, logoW, logoH);
      drawQR();
    };
    logoImg.onerror = () => {
      /* If logo fails, still export the QR */
      drawQR();
    };
    logoImg.src = qrConfig.companyLogo;
  } else {
    /* No logo — just QR */
    drawQR();
  }
}

function triggerDownload(canvas) {
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a   = document.createElement("a");
    a.href     = url;
    a.download = "business-card-qr.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, "image/png");
}
