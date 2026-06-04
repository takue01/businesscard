# Digital Business Card — Project README

## Overview
A premium, mobile-first digital business card designed to open when a QR code
is scanned. Runs entirely in the browser with no server, no framework, no
dependencies beyond the included QR library.

---

## Project Structure

```
project/
├── index.html            ← Digital business card (share this URL)
├── qr-generator.html     ← QR code generator (internal use only)
├── css/
│   └── style.css         ← All card styles
├── js/
│   ├── card.js           ← Card logic & VCF download
│   └── qr-generator.js   ← QR generation & PNG export
├── assets/
│   ├── profile.jpg       ← Your professional headshot (portrait)
│   └── company-logo.png  ← Company logo (QR page only)
└── libs/
    └── qrcode.min.js     ← Offline QR code library
```

---

## Quick Setup (5 steps)

### Step 1 — Add your photo
Drop your professional portrait photo as:
```
assets/profile.jpg
```
Recommended: at least 600×800px, good lighting, plain background.

### Step 2 — Add your company logo
Drop your logo (transparent PNG preferred) as:
```
assets/company-logo.png
```
This logo appears ONLY on the QR generator page, never on the card itself.

### Step 3 — Edit your card data
Open `js/card.js` and update the configuration object at the top:

```javascript
const cardData = {
  fullName:     "Your Full Name",
  position:     "Your Job Title",
  company:      "Your Company Name",
  motto:        "\"Your Company Motto\"",
  phone:        "+1 (555) 000-0000",
  email:        "you@yourcompany.com",
  linkedin:     "https://www.linkedin.com/in/yourprofile",
  website:      "https://www.yourcompany.com",
  profileImage: "assets/profile.jpg"
};
```

### Step 4 — Set the QR destination URL
Open `js/qr-generator.js` and update:

```javascript
const qrConfig = {
  companyLogo:  "assets/company-logo.png",
  qrTargetUrl:  "https://yourdomain.com"   // ← URL of your hosted index.html
};
```

### Step 5 — Host the files
Upload all files to your web host or GitHub Pages. The QR code must point to
the **live URL** of `index.html` (not a local file path) so it works when
scanned by others.

---

## Generating the QR Code for Print

1. Open `qr-generator.html` in your browser
2. Verify the QR code displays correctly
3. Click **Download QR Code**
4. A PNG file (`business-card-qr.png`) is saved — ready for your designer or
   printer

---

## Customisation Tips

| What to change | Where |
|---|---|
| Name, position, company, motto | `js/card.js` → `cardData` |
| Phone, email, LinkedIn, website | `js/card.js` → `cardData` |
| Accent colour (green) | `css/style.css` → `:root` `--green` |
| Profile photo | `assets/profile.jpg` |
| Company logo (QR page) | `assets/company-logo.png` |
| QR destination URL | `js/qr-generator.js` → `qrConfig.qrTargetUrl` |

---

## Browser Support
All modern browsers: Chrome, Safari, Firefox, Edge.
Works on iOS and Android.

---

## No Backend Required
Everything runs client-side:
- VCF contact download: pure JavaScript Blob API
- QR code: generated on a `<canvas>` element
- PNG export: `canvas.toBlob()` → download link
