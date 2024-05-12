const express = require("express");
const { default: mongoose } = require("mongoose");
const path = require("path");
const app = express();

app.use(express.json());
// form태그에서 전달받은 값을 받기위한 미들웨어
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(
    `mongodb+srv://kyyyy8629:1234@express-cluster.fzshmg3.mongodb.net/?retryWrites=true&w=majority&appName=express-Cluster`
  )
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });
app.use("/static", express.static(path.join(__dirname, "..", "public")));
console.log(path.join(__dirname, "..", "public"));
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
