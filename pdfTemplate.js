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

  // --- SMART SIZING LOGIC (UPDATED) ---
  const charCount = letter.length;
  
  // FIX: Trigger "Long Mode" much earlier (600 chars instead of 1000)
  // This ensures the 299 Plan (Medium) fits perfectly.
  const isLong = charCount > 600; 
  const isVeryLong = charCount > 1500;

  // Dynamic Styles
  const bodyFontSize = isVeryLong ? "14px" : isLong ? "16px" : "18px";
  const bodyLineHeight = isVeryLong ? "1.5" : isLong ? "1.7" : "1.9";
  
  // FIX: Reduced vertical padding to prevent cut-off at the bottom
  const contentPadding = isLong ? "60px 80px" : "85px 100px"; 
  const titleMargin = isLong ? "10px" : "25px";
  const paragraphMargin = isLong ? "12px" : "18px";

  // --- THEME LOGIC ---
  const textColor = imageUrl ? "#ffffff" : "#5e0a18"; 
  const textShadow = imageUrl ? "0 2px 10px rgba(0,0,0,0.9)" : "none";
  const titleColor = imageUrl ? "#ffffff" : "#881337"; 
  const subtitleColor = imageUrl ? "#d4af37" : "#b48a20";

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Great+Vibes&family=Cinzel:wght@400;700&display=swap" rel="stylesheet">

<style>
  @page { margin: 0; size: A4; }
  
  body { 
    margin: 0; 
    background: ${imageUrl ? "#000" : "#fff0f5"}; 
    -webkit-print-color-adjust: exact; 
    font-family: 'Playfair Display', serif; 
  }

  .page { 
    position: relative; 
    width: 794px; 
    height: 1123px; 
    overflow: hidden; 
  }

  /* BACKGROUND IMAGE */
  .bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; }
  
  /* VIGNETTE */
  .vignette { 
    position: absolute; 
    inset: 0; 
    background: radial-gradient(circle at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.95) 100%); 
    z-index: 2; 
    display: ${imageUrl ? "block" : "none"};
  }

  /* GOLD FRAME */
  .frame { 
    position: absolute; 
    inset: 30px; 
    border: 2px solid #d4af37; 
    box-shadow: inset 0 0 25px rgba(0,0,0,0.4); 
    z-index: 5; 
  }
  .frame::before { content: ""; position: absolute; inset: 6px; border: 1px solid rgba(212,175,55,0.7); }

  /* HEARTS */
  .heart { position: absolute; color: #ffb6c1; opacity: 0.4; font-size: 24px; z-index: 6; }
  .h1 { top: 80px; left: 80px; } .h2 { top: 110px; right: 100px; }
  .h3 { bottom: 100px; left: 110px; } .h4 { bottom: 130px; right: 90px; }

  /* CONTENT CONTAINER */
  .content {
    position: absolute;
    inset: 0;
    padding: ${contentPadding};
    text-align: center;
    color: ${textColor};
    text-shadow: ${textShadow};
    z-index: 10;
    display: flex;
    flex-direction: column;
    /* FIX: Changed from space-between to avoid pushing signature off-screen */
    justify-content: flex-start; 
    gap: 20px;
  }

  .header-group { flex-shrink: 0; }

  .title { 
    font-family: 'Great Vibes', cursive; 
    font-size: ${isLong ? "80px" : "100px"}; 
    margin-bottom: ${titleMargin}; 
    line-height: 1;
    color: ${titleColor};
    text-shadow: ${imageUrl ? "0 0 15px rgba(255,255,255,0.4)" : "none"};
  }

  .subtitle { 
    font-family: 'Cinzel', serif; 
    font-size: 11px; 
    letter-spacing: 5px; 
    color: ${subtitleColor}; 
    text-transform: uppercase;
  }

  /* BODY TEXT */
  .body {
    max-width: 540px;
    margin: 0 auto;
    font-size: ${bodyFontSize}; 
    line-height: ${bodyLineHeight};
    opacity: 0.95;
    /* FIX: Allow body to grow but not force overflow */
    flex-grow: 1;
    display: flex; 
    flex-direction: column; 
    justify-content: center;
  }
  .body p { margin-bottom: ${paragraphMargin}; }

  /* SIGNATURE AREA */
  .signature-area { 
    flex-shrink: 0; 
    /* FIX: Auto margin top pushes it to the bottom safely */
    margin-top: auto; 
    padding-top: 15px;
    position: relative;
    width: 100%;
  }
  
  .signature-area::before {
    content: ""; display: block; width: 140px; height: 1px; margin: 0 auto 15px;
    background: linear-gradient(to right, transparent, #d4af37, transparent);
    opacity: 0.6;
  }

  .forever { font-size: 14px; opacity: 0.8; margin-bottom: 5px; font-style: italic; }
  .signature { 
    font-family: 'Great Vibes', cursive; 
    font-size: ${isLong ? "45px" : "58px"}; 
    color: #d4af37; 
    line-height: 1;
  }
  .date { margin-top: 8px; font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 2px; opacity: 0.6; }

</style>
</head>

<body>
<div class="page">
  ${imageUrl ? `<img src="${imageUrl}" class="bg"/>` : ""}
  
  <div class="vignette"></div>
  <div class="frame"></div>

  <div class="heart h1">♥</div> <div class="heart h2">♥</div>
  <div class="heart h3">♥</div> <div class="heart h4">♥</div>

  <div class="content">
    
    <div class="header-group">
      <div class="title">My Love</div>
      <div class="subtitle">A Letter From The Heart</div>
    </div>

    <div class="body">${paragraphs}</div>

    <div class="signature-area">
      <div class="forever">Forever yours,</div>
      <div class="signature">${senderName || "Your Love"}</div>
      <div class="date">${today}</div>
    </div>

  </div>
</div>
</body>
</html>
`;
}
