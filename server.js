import express from "express";
import puppeteer from "puppeteer";

const app = express();
app.use(express.json({ limit: "10mb" }));

app.get("/", (_, res) => {
  res.send("PDF Worker Running");
});

app.post("/generate-pdf", async (req, res) => {
  let browser;

  try {
    const { letter, imageUrl, senderName } = req.body;

    if (!letter) {
      return res.status(400).json({ error: "No letter content" });
    }

    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: "new",
    });

    const page = await browser.newPage();

    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const paragraphs = letter
      .split(/\r?\n/)
      .filter((l) => l.trim() !== "")
      .map((l) => `<p style="margin-bottom:14px;">${l}</p>`)
      .join("");

    // 🔥 SAME STYLED HTML YOU HAD IN VERCEL
   const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital@0;1&display=swap');

@page { margin: 0; size: A4; }

body {
  margin: 0;
  padding: 0;
  width: 210mm;
  height: 297mm;
  background: ${imageUrl ? "#000" : "#fff0f5"};
  font-family: 'Playfair Display', serif;
  -webkit-print-color-adjust: exact;
}

.page {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* background */
.bg {
  position: absolute;
  inset: 0;
  object-fit: cover;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.overlay {
  position: absolute;
  inset: 0;
  background: ${imageUrl ? "rgba(0,0,0,0.45)" : "transparent"};
  z-index: 2;
}

/* frame */
.frame {
  position: absolute;
  inset: 30px;
  border: 3px double #d4af37;
  z-index: 5;
}

.frame::after {
  content: "";
  position: absolute;
  inset: 6px;
  border: 1px solid #d4af37;
}

/* corner ornaments */
.corner {
  position: absolute;
  width: 80px;
  height: 80px;
  border-color: #d4af37;
  z-index: 6;
}

.corner.tl { top: 20px; left: 20px; border-left: 2px solid; border-top: 2px solid; }
.corner.br { bottom: 20px; right: 20px; border-right: 2px solid; border-bottom: 2px solid; }

/* content */
.content {
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 80px;
  color: ${imageUrl ? "#fff" : "#881337"};
  text-shadow: ${imageUrl ? "0 2px 6px rgba(0,0,0,0.8)" : "none"};
}

.title {
  font-family: 'Great Vibes', cursive;
  font-size: 60px;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 10px;
  letter-spacing: 4px;
  margin-bottom: 30px;
  color: #d4af37;
}

.body {
  max-width: 520px;
  font-size: 17px;
  line-height: 1.7;
}

.signature {
  font-family: 'Great Vibes', cursive;
  font-size: 44px;
  margin-top: 40px;
  color: #d4af37;
}

.footer {
  margin-top: 20px;
  font-size: 9px;
  opacity: 0.7;
}
</style>
</head>

<body>
<div class="page">

  ${imageUrl ? `<img src="${imageUrl}" class="bg"/>` : ""}
  <div class="overlay"></div>

  <div class="frame"></div>
  <div class="corner tl"></div>
  <div class="corner br"></div>

  <div class="content">
    <div class="title">My Love</div>
    <div class="subtitle">A LETTER FROM THE HEART</div>

    <div class="body">${paragraphs}</div>

    <div class="signature">${senderName || "Your Love"}</div>
    <div class="footer">${today} • Forever Yours</div>
  </div>

</div>
</body>
</html>
`;


    await page.setContent(html, { waitUntil: "load" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0px", bottom: "0px", left: "0px", right: "0px" },
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=LoveLetter.pdf",
    });

    res.send(pdf);
  } catch (err) {
    console.error("PDF ERROR:", err);
    res.status(500).json({ error: "PDF generation failed" });
  } finally {
    if (browser) await browser.close();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("PDF Worker running on port", PORT));
