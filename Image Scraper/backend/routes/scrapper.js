const express = require("express");
const router = express.Router();
const cheerio = require("cheerio");
const axios = require("axios");

function imgFilter(img, images) {
  return (
    img &&
    (img.includes(".jpg") || img.includes(".jpeg") || img.includes(".png")) &&
    !images.includes(img)
  );
}

async function getImages(link) {
  const images = [];
  await axios(link).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    $("div").each(function () {
      const image1 = $(this).find("img").attr("src");
      const image2 = $(this).find("img").attr("data-src");
      if (imgFilter(image1, images)) images.push(image1);
      if (imgFilter(image2, images)) images.push(image2);
    });
  });
  return images;
}

router.post("/", async (req, res) => {
  const url = req.body.url;
  try {
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
  } catch (err) {
    return res.status(400).json({
      error: 1,
      msg: err,
    });
  }
});

module.exports = router;
