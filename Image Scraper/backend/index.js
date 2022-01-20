var express = require("express");
var app = express();
const cors = require("cors");
const helmet = require("helmet");

const scrapper = require("./routes/scrapper");

app.use(cors());
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/scrapper", scrapper);

const PORT = 2000;
app.listen(PORT, () => {
  console.log("Listening on ", PORT);
});
