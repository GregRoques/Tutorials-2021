const express = require("express");
const router = express.Router();
const cheerio = require("cheerio");
const axios = require("axios");

async function getImages(link) {
  const images = [];

  await axios(link).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    $("img").each(function () {
      const image = $(this).attr("data-src");
      if (image) {
        images.push(image);
      }
    });
  });
  return images;
}

router.post("/", async (req, res) => {
  const url = req.body.url;
  if (!url.includes("http://") && !url.includes("https://")) {
    return res.status(400).json({
      error: 1,
      msg: "Must Include URL Protocol",
    });
  }
  const images = await getImages(url);
  if (images.length === 0) {
    return res.status(400).json({
      error: 1,
      msg: "No Images Were Found",
    });
  }
  // console.log(images);
  return res.json(images);
});

module.exports = router;
