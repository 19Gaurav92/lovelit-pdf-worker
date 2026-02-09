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

  // --- SMART SIZING LOGIC ---
  const charCount = letter.length;
  // Trigger compact mode earlier to save the 299 Plan
  const isLong = charCount > 700; 
  const isVeryLong = charCount > 1500;

  // Dynamic CSS Variables
  const bodyFontSize = isVeryLong ? "15px" : isLong ? "16px" : "19px";
  const bodyLineHeight = isVeryLong ? "1.5" : isLong ? "1.6" : "1.8";
  const contentPadding = isLong ? "60px 80px" : "90px 100px"; 
  
  // Logic: "No Photo" mode gets a Deep Red text, "Photo" mode gets White text with Glow
  const textColor = imageUrl ? "#ffffff" : "#5e0a18"; 
  const titleColor = imageUrl ? "#ffffff" : "#881337"; 
  
  // The "Glow" effect for the title
  const titleGlow = imageUrl 
    ? "0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(212,175,55,0.5)" 
    : "none";

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

  /* --- LAYERS --- */
  
  /* 1. Background Image */
  .bg { 
    position: absolute; inset: 0; width: 100%; height: 100%; 
    object-fit: cover; z-index: 1; 
  }
  
  /* 2. Rich Vignette (Darker edges for readability) */
  .vignette { 
    position: absolute; inset: 0; 
    background: radial-gradient(circle at center, rgba(0,0,0,0.1) 10%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.85) 90%); 
    z-index: 2; 
    display: ${imageUrl ? "block" : "none"};
  }

  /* 3. Gold Frame (Outer & Inner) */
  .frame-outer { 
    position: absolute; inset: 25px; 
    border: 2px solid #d4af37; 
    box-shadow: 0 0 15px rgba(212,175,55,0.3), inset 0 0 30px rgba(0,0,0,0.5);
    z-index: 5; 
  }
  .frame-inner { 
    position: absolute; inset: 32px; 
    border: 1px solid rgba(212,175,55,0.6); 
    z-index: 5; 
  }

  /* 4. Decorative Hearts (Scattered) */
  .deco-heart { position: absolute; font-size: 20px; opacity: 0.6; z-index: 6; }
  .gold { color: #d4af37; text-shadow: 0 0 5px rgba(212,175,55,0.8); }
  .pink { color: #ffb6c1; text-shadow: 0 0 5px rgba(255,182,193,0.8); }

  /* Positions */
  .h1 { top: 60px; left: 60px; font-size: 24px; } /* Top Left Gold */
  .h2 { top: 90px; right: 80px; font-size: 18px; } /* Top Right Pink */
  .h3 { bottom: 80px; left: 90px; font-size: 18px; } /* Bottom Left Pink */
  .h4 { bottom: 60px; right: 60px; font-size: 24px; } /* Bottom Right Gold */
  .h5 { top: 50%; left: 45px; font-size: 14px; opacity: 0.4; } /* Mid Left */
  .h6 { top: 55%; right: 45px; font-size: 14px; opacity: 0.4; } /* Mid Right */


  /* 5. Main Content */
  .content {
    position: absolute;
    inset: 0;
    padding: ${contentPadding};
    text-align: center;
    color: ${textColor};
    z-index: 10;
    display: flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
  }

  /* Header Section */
  .header-group { flex-shrink: 0; margin-bottom: 20px; }

  .title { 
    font-family: 'Great Vibes', cursive; 
    font-size: ${isLong ? "85px" : "105px"}; 
    line-height: 1;
    color: ${titleColor};
    /* THE GLOW MAGIC */
    text-shadow: ${titleGlow};
    margin-bottom: 10px;
  }

  .subtitle { 
    font-family: 'Cinzel', serif; 
    font-size: 11px; 
    letter-spacing: 6px; 
    color: #d4af37; 
    text-transform: uppercase;
    text-shadow: 0 2px 4px rgba(0,0,0,0.8);
  }

  /* Body Text (Centered Vertically) */
  .body {
    max-width: 560px; /* Slightly wider to fit more text per line */
    margin: auto; /* CRITICAL: Centers vertically */
    font-size: ${bodyFontSize}; 
    line-height: ${bodyLineHeight};
    opacity: 0.95;
    text-shadow: ${imageUrl ? "0 2px 4px rgba(0,0,0,0.9)" : "none"};
  }
  .body p { margin-bottom: 15px; }

  /* Signature Section (Pushed to bottom) */
  .signature-area { 
    flex-shrink: 0; 
    margin-top: 20px;
    padding-top: 20px;
    position: relative;
    width: 100%;
  }
  
  /* The elegant divider line */
  .signature-area::before {
    content: ""; display: block; width: 120px; height: 1px; margin: 0 auto 15px;
    background: linear-gradient(to right, transparent, #d4af37, transparent);
    opacity: 0.8;
  }

  .forever { font-size: 14px; opacity: 0.9; margin-bottom: 5px; font-style: italic; }
  .signature { 
    font-family: 'Great Vibes', cursive; 
    font-size: ${isLong ? "50px" : "60px"}; 
    color: #d4af37; 
    line-height: 1;
    text-shadow: 0 0 10px rgba(212,175,55,0.6);
  }
  .date { margin-top: 8px; font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 2px; opacity: 0.7; color: #fff; }

</style>
</head>

<body>
<div class="page">
  ${imageUrl ? `<img src="${imageUrl}" class="bg"/>` : ""}
  
  <div class="vignette"></div>
  
  <div class="frame-outer"></div>
  <div class="frame-inner"></div>

  <div class="deco-heart pink h1">♥</div>
  <div class="deco-heart gold h2">♥</div>
  <div class="deco-heart gold h3">♥</div>
  <div class="deco-heart pink h4">♥</div>
  <div class="deco-heart gold h5">✦</div> <div class="deco-heart gold h6">✦</div>

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
