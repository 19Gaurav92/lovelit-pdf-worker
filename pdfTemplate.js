export function createLoveLetterHTML({
  letter,
  imageUrl,
  senderName,
}: {
  letter: string;
  imageUrl?: string;
  senderName?: string;
}) {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const paragraphs = letter
    .split("\n")
    .filter((l) => l.trim() !== "")
    .map((l) => `<p>${l}</p>`)
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Great+Vibes&family=Cinzel:wght@400;700&display=swap" rel="stylesheet">

<style>
@page { margin: 0; size: A4; }

body {
  margin: 0;
  padding: 0;
  background: ${imageUrl ? "#000" : "#fff0f5"};
  -webkit-print-color-adjust: exact;
  font-family: 'Playfair Display', serif;
}

/* ===== PAGE BASE ===== */
.page {
  position: relative;
  width: 794px;
  height: 1123px;
  overflow: hidden;
}

/* ===== BACKGROUND ===== */
.bg-color {
  position: absolute;
  inset: 0;
  background: ${imageUrl ? "#12090c" : "#fff0f5"};
  z-index: 0;
}

.bg-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${imageUrl ? "1" : "0"};
  z-index: 1;
}

/* cinematic dark gradient for luxury feel */
.bg-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.75) 100%);
  z-index: 2;
}

/* ===== GOLD FRAME ===== */
.frame {
  position: absolute;
  inset: 40px;
  border: 2px solid #d4af37;
  box-shadow:
    inset 0 0 25px rgba(0,0,0,0.35),
    0 0 25px rgba(212,175,55,0.25);
  z-index: 5;
}

.frame::before {
  content: "";
  position: absolute;
  inset: 8px;
  border: 1px solid rgba(212,175,55,0.8);
}

/* ===== CONTENT ===== */
.content {
  position: absolute;
  inset: 0;
  padding: 120px 90px 90px 90px;
  text-align: center;
  z-index: 10;
  color: ${imageUrl ? "#ffffff" : "#7a0f2a"};
  text-shadow: ${imageUrl ? "0 3px 12px rgba(0,0,0,0.85)" : "none"};
}

/* ===== TITLE ===== */
.title {
  font-family: 'Great Vibes', cursive;
  font-size: 92px;
  margin-bottom: 10px;
  color: #ffffff;

  /* gold glow */
  text-shadow:
    0 0 8px rgba(255,255,255,0.6),
    0 0 18px rgba(212,175,55,0.6),
    0 0 40px rgba(212,175,55,0.35);
}

/* ===== SUBTITLE ===== */
.subtitle {
  font-family: 'Cinzel', serif;
  font-size: 12px;
  letter-spacing: 6px;
  text-transform: uppercase;
  color: #d4af37;
  margin-bottom: 60px;
}

/* ===== BODY ===== */
.body {
  max-width: 520px;
  margin: 0 auto;
  font-size: 18px;
  line-height: 1.9;
  font-weight: 500;
}

.body p {
  margin-bottom: 18px;
}

/* ===== SIGNATURE BLOCK ===== */
.signature-block {
  margin-top: 70px;
}

.forever {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 12px;
}

/* luxury signature */
.signature {
  font-family: 'Great Vibes', cursive;
  font-size: 56px;
  color: #d4af37;

  text-shadow:
    0 0 10px rgba(212,175,55,0.8),
    0 0 25px rgba(212,175,55,0.5);
}

/* elegant underline flourish */
.flourish {
  width: 120px;
  height: 1px;
  background: linear-gradient(to right, transparent, #d4af37, transparent);
  margin: 14px auto 18px auto;
}

/* ===== FOOTER ===== */
.footer {
  font-family: 'Cinzel', serif;
  font-size: 10px;
  letter-spacing: 2px;
  opacity: 0.6;
}
</style>
</head>

<body>
<div class="page">

  <div class="bg-color"></div>
  ${imageUrl ? `<img src="${imageUrl}" class="bg-image"/>` : ""}
  <div class="bg-vignette"></div>

  <div class="frame"></div>

  <div class="content">
    <div class="title">My Love</div>
    <div class="subtitle">A Letter From The Heart</div>

    <div class="body">${paragraphs}</div>

    <div class="signature-block">
      <div class="forever">Forever yours,</div>
      <div class="signature">${senderName || "Your Secret Admirer"}</div>
      <div class="flourish"></div>
      <div class="footer">${today}</div>
    </div>
  </div>

</div>
</body>
</html>
`;
}
