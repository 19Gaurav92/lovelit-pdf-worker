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
              background-color: ${imageUrl ? "#000000" : "#fff0f5"};
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              font-family: 'Playfair Display', serif;
              overflow: hidden;
            }

            .page-wrapper {
              position: relative;
              width: 100%;
              height: 100%;
              overflow: hidden;
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

            .bg-overlay {
              position: absolute;
              inset: 0;
              background: ${imageUrl ? "rgba(0,0,0,0.5)" : "transparent"};
              z-index: 2;
            }

            .container {
              position: relative;
              z-index: 10;
              height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
            }

            .frame {
              position: relative;
              width: 85%;
              min-height: 88%;
              border: 3px double #d4af37;
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 40px;
            }

            .frame::before {
              content: "";
              position: absolute;
              inset: 5px;
              border: 1px solid #d4af37;
            }

            .content-box {
              max-width: 540px;
              width: 100%;
              text-align: center;
              color: ${imageUrl ? "#ffffff" : "#881337"};
              text-shadow: ${imageUrl ? "0 2px 4px rgba(0,0,0,0.8)" : "none"};
            }

            .main-heading {
              font-family: 'Great Vibes', cursive;
              font-size: 55px;
              margin-bottom: 15px;
              color: ${imageUrl ? "#ffffff" : "#be123c"};
            }

            .sub-heading {
              font-size: 10px;
              letter-spacing: 3px;
              text-transform: uppercase;
              margin-bottom: 30px;
              color: ${imageUrl ? "#d4af37" : "#be123c"};
            }

            .letter-body {
              font-size: 17px;
              line-height: 1.6;
              margin-bottom: 20px;
              color: ${imageUrl ? "#f5f5f5" : "#4a0418"};
            }

            .signature {
              font-family: 'Great Vibes', cursive;
              font-size: 45px;
              margin-top: 30px;
              color: #d4af37;
            }

            .footer {
              margin-top: 30px;
              font-size: 9px;
              opacity: 0.7;
              letter-spacing: 1px;
              border-top: 1px solid rgba(190,18,60,0.3);
              padding-top: 12px;
              display: inline-block;
              color: ${imageUrl ? "#ddd" : "#881337"};
            }
          </style>
        </head>

        <body>
          <div class="page-wrapper">
            ${imageUrl ? `<img src="${imageUrl}" class="bg-image" />` : ""}
            <div class="bg-overlay"></div>

            <div class="container">
              <div class="frame">
                <div class="content-box">
                  <div class="main-heading">My Love</div>
                  <div class="sub-heading">A Letter From The Heart</div>
                  <div class="letter-body">${paragraphs}</div>
                  <div class="signature">${senderName || "Your Love"}</div>
                  <div class="footer">${today} • Forever Yours</div>
                </div>
              </div>
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
