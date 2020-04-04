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

app.use("/images", express.static("uploads"))

app.use("/api", require("./routes/api"));

const port = process.env.PORT || config.port;
app.listen(port, () => {
  console.log(`App is running on port ${port}`)
})