export function createLoveLetterHTML({ letter, imageUrl, senderName }) {
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

body{
  margin:0;
  background:${imageUrl ? "#000" : "#fff0f5"};
  -webkit-print-color-adjust:exact;
  font-family:'Playfair Display', serif;
}

/* ===== PAGE ===== */
.page{
  position:relative;
  width:794px;
  height:1123px;
  overflow:hidden;
}

/* ===== BACKGROUND ===== */
.bg{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  object-fit:cover;
  opacity:${imageUrl ? 1 : 0};
  z-index:1;
}

.vignette{
  position:absolute;
  inset:0;
  background:
    radial-gradient(circle at center,
      rgba(0,0,0,0.15) 0%,
      rgba(0,0,0,0.55) 55%,
      rgba(0,0,0,0.95) 100%);
  z-index:2;
}

/* ===== GOLD FRAME ===== */
.frame{
  position:absolute;
  inset:40px;
  border:2px solid #d4af37;
  box-shadow:
    inset 0 0 25px rgba(0,0,0,0.4),
    0 0 25px rgba(212,175,55,0.25);
  z-index:5;
}
.frame::before{
  content:"";
  position:absolute;
  inset:8px;
  border:1px solid rgba(212,175,55,0.8);
}

/* ===== HEART DECOR ===== */
.heart{
  position:absolute;
  color:#ffb6c1;
  opacity:0.25;
  font-size:22px;
  z-index:6;
}
.h1{ top:90px; left:90px; }
.h2{ top:120px; right:110px; }
.h3{ bottom:110px; left:120px; }
.h4{ bottom:140px; right:100px; }

/* ===== CONTENT ===== */
.content{
  position:absolute;
  inset:0;
  padding:130px 110px 120px 110px;
  text-align:center;
  color:#ffffff;
  text-shadow:0 3px 12px rgba(0,0,0,0.85);
  z-index:10;
  display:flex;
  flex-direction:column;
  justify-content:flex-start;
}

/* ===== TITLE ===== */
.title{
  font-family:'Great Vibes', cursive;
  font-size:100px;
  margin-bottom:18px;
  text-shadow:
    0 0 10px rgba(255,255,255,0.9),
    0 0 25px rgba(212,175,55,0.8),
    0 0 60px rgba(212,175,55,0.45);
}

/* ===== SUBTITLE ===== */
.subtitle{
  font-family:'Cinzel', serif;
  font-size:12px;
  letter-spacing:6px;
  color:#d4af37;
  margin-bottom:50px;
}

/* ===== BODY ===== */
.body{
  max-width:460px;
  margin:0 auto;
  font-size:18px;
  line-height:1.9;
}
.body p{ margin-bottom:18px; }

/* ===== SIGNATURE AREA (LOCKED TO BOTTOM) ===== */
.signature-area{
  margin-top:auto;
  padding-top:40px;
}

/* divider */
.signature-area::before{
  content:"";
  display:block;
  width:160px;
  height:1px;
  margin:0 auto 24px;
  background:linear-gradient(to right, transparent, #d4af37, transparent);
}

.forever{
  font-size:16px;
  margin-bottom:10px;
  opacity:0.9;
}

.signature{
  font-family:'Great Vibes', cursive;
  font-size:58px;
  color:#d4af37;
  text-shadow:
    0 0 10px rgba(212,175,55,0.9),
    0 0 30px rgba(212,175,55,0.5);
}

.date{
  margin-top:12px;
  font-family:'Cinzel', serif;
  font-size:10px;
  letter-spacing:2px;
  opacity:0.65;
}
</style>
</head>

<body>
<div class="page">

  ${imageUrl ? `<img src="${imageUrl}" class="bg"/>` : ""}
  <div class="vignette"></div>

  <div class="frame"></div>

  <!-- romantic hearts -->
  <div class="heart h1">♥</div>
  <div class="heart h2">♥</div>
  <div class="heart h3">♥</div>
  <div class="heart h4">♥</div>

  <div class="content">
    <div class="title">My Love</div>
    <div class="subtitle">A Letter From The Heart</div>

    <div class="body">${paragraphs}</div>

    <div class="signature-area">
      <div class="forever">Forever yours,</div>
      <div class="signature">${senderName || "Your Secret Admirer"}</div>
      <div class="date">${today}</div>
    </div>
  </div>

</div>
</body>
</html>
`;
}
