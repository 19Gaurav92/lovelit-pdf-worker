import express from "express";
import puppeteer from "puppeteer";

const app = express();
app.use(express.json({ limit: "10mb" }));

function createLoveLetterHTML({ letter, imageUrl, senderName }) {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const paragraphs = letter.split("\n").filter(l => l.trim() !== "");
  const formattedBody = paragraphs.map(l => `<p>${l}</p>`).join("");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Great+Vibes&family=Cinzel:wght@400;700&display=swap" rel="stylesheet">
<style>
@page { margin:0; size:A4; }

body{
  margin:0;
  background:${imageUrl ? "#000" : "#fff0f5"};
  -webkit-print-color-adjust:exact;
}

.page{
  position:relative;
  width:794px;
  height:1123px;
  overflow:hidden;
  font-family:'Playfair Display', serif;
}

.bg{position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:${imageUrl ? 1 : 0}; z-index:1;}
.overlay{position:absolute; inset:0; background:${imageUrl ? "rgba(0,0,0,0.45)" : "transparent"}; z-index:2;}

.frame{
  position:absolute;
  inset:40px;
  border:3px solid #d4af37;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.2),0 2px 10px rgba(0,0,0,0.3);
  display:flex;
  align-items:center;
  justify-content:center;
  padding:60px 50px;
  text-align:center;
  z-index:10;
}

.frame::before{
  content:"";
  position:absolute;
  inset:6px;
  border:1px solid #d4af37;
}

.content{
  color:${imageUrl ? "#fff" : "#881337"};
  text-shadow:${imageUrl ? "0 2px 4px rgba(0,0,0,0.9)" : "none"};
}

.title{
  font-family:'Great Vibes', cursive;
  font-size:80px;
  margin-bottom:10px;
}

.subtitle{
  font-family:'Cinzel', serif;
  font-size:12px;
  letter-spacing:5px;
  margin-bottom:40px;
}

.body{
  font-size:18px;
  line-height:1.8;
  max-width:520px;
  margin:auto;
}

.body p{margin-bottom:15px;}

.signature{
  font-family:'Great Vibes', cursive;
  font-size:55px;
  margin-top:30px;
  color:${imageUrl ? "#d4af37" : "#be123c"};
}

.footer{
  margin-top:40px;
  font-family:'Cinzel', serif;
  font-size:10px;
  opacity:0.6;
}
</style>
</head>

<body>
<div class="page">
  ${imageUrl ? `<img src="${imageUrl}" class="bg"/>` : ""}
  <div class="overlay"></div>

  <div class="frame">
    <div class="content">
      <div class="title">My Love</div>
      <div class="subtitle">A Letter From The Heart</div>
      <div class="body">${formattedBody}</div>
      <div class="signature">${senderName || "Your Secret Admirer"}</div>
      <div class="footer">${today} • Forever Yours</div>
    </div>
  </div>
</div>
</body>
</html>`;
}

app.post("/generate-pdf", async (req, res) => {
  let browser;

  try {
    const { letter, imageUrl, senderName } = req.body;
    if (!letter) return res.status(400).json({ error: "No letter content" });

    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: "new",
    });

    const page = await browser.newPage();

    const html = createLoveLetterHTML({ letter, imageUrl, senderName });

    await page.setContent(html, { waitUntil: "load" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", bottom: "0", left: "0", right: "0" },
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=LoveLetter.pdf",
    });

    res.send(pdf);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "PDF generation failed" });
  } finally {
    if (browser) await browser.close();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("PDF Worker running on port", PORT));
