const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");

mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
  .then(() => console.log("Connect to DB successfully"))
  .catch(err => console.log(err))

const app = express();

app.use(express.json())

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  next();
});

app.use("/images", express.static("uploads"))

app.use("/api", require("./routes/api"));

const port = process.env.PORT || config.port;
app.listen(port, () => {
  console.log(`App is running on port ${port}`)
})