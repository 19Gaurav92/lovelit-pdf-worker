import express from "express";
import puppeteer from "puppeteer";
import { createLoveLetterHTML } from "./pdfTemplate.js";

const app = express();

// 1. INCREASE LIMIT FOR PHOTOS
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.get("/", (_, res) => {
  res.send("Lovelit PDF Worker is Active 🚀");
});

app.post("/generate-pdf", async (req, res) => {
  let browser;

  try {
    const { letter, imageUrl, senderName } = req.body;

    if (!letter) {
      return res.status(400).json({ error: "No letter content" });
    }

    // 2. LAUNCH BROWSER (Optimized for Railway)
    browser = await puppeteer.launch({
      args: [
        "--no-sandbox", 
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage", // Helps with memory on small servers
        "--font-render-hinting=none" // Better font rendering
      ],
      headless: "new",
    });

    const page = await browser.newPage();

    // 3. GENERATE HTML
    const html = createLoveLetterHTML({ letter, imageUrl, senderName });

    // 4. WAIT FOR FONTS & IMAGES (CRITICAL FIX)
    // "networkidle0" ensures Google Fonts are fully loaded before printing
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 60000 });

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
    console.error("PDF ERROR:", err);
    res.status(500).json({ error: "PDF generation failed", details: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("PDF Worker running on port", PORT));
