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
      headless: "new"
    });

    const page = await browser.newPage();

    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    const paragraphs = letter
      .split(/\r?\n/)
      .filter((l) => l.trim() !== "")
      .map((l) => `<p style="margin-bottom:14px;">${l}</p>`)
      .join("");

    const html = `
      <html>
        <body style="font-family:Georgia;padding:40px;text-align:center;">
          <h1>My Love</h1>
          <div style="font-size:18px;line-height:1.6;">${paragraphs}</div>
          <div style="margin-top:40px;font-size:28px;">
            ${senderName || "Your Love"}
          </div>
          <div style="margin-top:20px;font-size:12px;opacity:0.7;">
            ${today} • Forever Yours
          </div>
        </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: "load" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=LoveLetter.pdf"
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
