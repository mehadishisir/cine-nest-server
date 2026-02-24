const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const port = 3000;

require("dotenv").config();

// middleware

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Cine Nest server is ready");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
