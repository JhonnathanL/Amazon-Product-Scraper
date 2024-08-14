// Import necessary packages
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/scrape", async (req, res) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: "Missing keyword parameter" });
  }

  try {
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Referer: "https://www.amazon.com/",
      },
    });

    const $ = cheerio.load(response.data);
    const results = [];

    $("div.s-result-item").each(async (index, element) => {
      const title = $(element).find("span.a-text-normal").text().trim();
      const imageURL = $(element).find("img.s-image").attr("src");
      const reviews = $(element)
        .find("span.a-size-base.s-underline-text")
        .text()
        .trim();
      const rating = $(element).find("span.a-icon-alt").text().trim();

      const productDetails = {
        title,
        rating,
        reviews,
        imageURL,
      };

      results.push(productDetails);

      await delay(1000);
    });

    res.json({ keyword, results });
  } catch (error) {
    console.error("Error fetching Amazon search results:", error.message);
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
