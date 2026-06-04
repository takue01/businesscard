/* ============================================================
   DIGITAL BUSINESS CARD — card.js
   All card logic: configuration, rendering, VCF download, ripple
   ============================================================ */

/* ============================================================
   CONFIGURATION — edit only this object to customise the card
   ============================================================ */
const cardData = {
  fullName:     "Takudzwa Munene",
  position:     "Head IT",
  company:      "TIMB",
  motto:        "\"Building the Future Through Innovation\"",
  phone:        "+263 78 826 5550",
  email:        "tmunene@timb.co.zw",
  linkedin:     "https://www.linkedin.com/in/takudzwa-munene",
  website:      "https://www.timb.co.zw",
  profileImage: "assets/profile.jpg"   // path to portrait photo
};

/* ============================================================
   RENDER — populate the DOM once the page is ready
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  renderCard();
  attachRippleEffects();
});

function renderCard() {
  /* ── Profile photo or placeholder ──────────────────────── */
  const photoSection = document.getElementById("photo-section");
  if (cardData.profileImage) {
    const img = document.createElement("img");
    img.src       = cardData.profileImage;
    img.alt       = cardData.fullName + " profile photo";
    img.className = "profile-photo";

    /* Graceful fallback: if image fails, show placeholder */
    img.onerror = () => {
      img.remove();
      photoSection.appendChild(buildPlaceholder());
    };

    photoSection.appendChild(img);
  } else {
    photoSection.appendChild(buildPlaceholder());
  }

  /* ── Identity ───────────────────────────────────────────── */
  document.getElementById("full-name").textContent       = cardData.fullName;
  document.getElementById("position-company").textContent =
    cardData.position + " · " + cardData.company;
  document.getElementById("motto").textContent           = cardData.motto;

  /* ── LinkedIn button ────────────────────────────────────── */
  const linkedinBtn = document.getElementById("btn-linkedin");
  linkedinBtn.href = cardData.linkedin || "#";
  if (!cardData.linkedin) linkedinBtn.style.display = "none";

  /* ── Website button ─────────────────────────────────────── */
  const websiteBtn = document.getElementById("btn-website");
  websiteBtn.href = cardData.website || "#";
  if (!cardData.website) websiteBtn.style.display = "none";
}

/* ============================================================
   PLACEHOLDER — shown when no profile photo is configured
   ============================================================ */
function buildPlaceholder() {
  const div = document.createElement("div");
  div.className = "photo-placeholder";
  div.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
    </svg>
    <span>Add profile photo</span>`;
  return div;
}

/* ============================================================
   SAVE CONTACT — generate & download a .vcf file
   ============================================================ */
function saveContact() {
  const {
    fullName, position, company,
    phone, email, website, linkedin
  } = cardData;

  /* Split name into first / last for vCard N field */
  const parts     = (fullName || "").trim().split(/\s+/);
  const lastName  = parts.length > 1 ? parts.slice(1).join(" ") : "";
  const firstName = parts[0] || "";

  /* Build vCard 3.0 string */
  const vcf = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${fullName}`,
    `N:${lastName};${firstName};;;`,
    position  ? `TITLE:${position}`           : "",
    company   ? `ORG:${company}`              : "",
    phone     ? `TEL;TYPE=WORK,VOICE:${phone}`: "",
    email     ? `EMAIL;TYPE=WORK:${email}`    : "",
    website   ? `URL:${website}`              : "",
    linkedin  ? `X-SOCIALPROFILE;TYPE=linkedin:${linkedin}` : "",
    "END:VCARD"
  ]
    .filter(Boolean)   // remove empty lines
    .join("\r\n");

  /* Trigger download */
  const blob = new Blob([vcf], { type: "text/vcard;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `${fullName.replace(/\s+/g, "_")}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ============================================================
   RIPPLE EFFECT — adds tactile feedback to buttons
   ============================================================ */
function attachRippleEffects() {
  document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("pointerdown", (e) => {
      const rect   = btn.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height) * 1.5;
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.cssText =
        `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
      btn.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });
}
