const express = require("express");
const { default: mongoose } = require("mongoose");
const path = require("path");
const User = require("./models/users.model");
const app = express();

// .env환경변수 설정파일을 사용하기위해
require("dotenv").config();
// passport 모듈 사용하기
const passport = require("passport");
const cookieSession = require("cookie-session");
// const { isAuth, isNotAuth } = require("./middlewares/auth");
const mainRouter = require("./routes/main.router");
const usersRouter = require("./routes/user.router");
// 임시 key
const cookieEncryptionKey = "secret-key-123456789012345";
app.use(
  cookieSession({
    name: "cookie-session-namee", // 쿠키이름설정
    // keys 옵션은 cookieSession 미들웨어에서 사용하는 쿠키를 암호화하는 데 사용되는 키들의 배열
    keys: [cookieEncryptionKey], // key는 배열로 들어감
  })
);
// passport 6.0버전이상과  cookie-session 을 같이 사용하면나오는
// req.session.regenerate is not a function 에러 해결하기위한 미들웨어
app.use(function (request, response, next) {
  if (request.session && !request.session.regenerate) {
    request.session.regenerate = (cb) => {
      cb();
    };
  }
  if (request.session && !request.session.save) {
    request.session.save = (cb) => {
      cb();
    };
  }
  next();
});
// passport 전략 수행 순서
// 1. app.post("/login", 으로 요청이 들어옴
// 2. passport.authenticate("local", (err, user, info) => { 전략에 맞게 authenticate메서드 실행
// 3. src/config/passport.js에서 요청에 맞는 전략실행(passport.use(new localStrategy()
// 4. 전략 내에서 done() 실행 시 app.post("/login" 로 돌아와서 authenticate()메서드의 (err, user, info) => { 콜백 실행

// passport 모듈을 사용하기위한 미들웨어 등록
require("./config/passport");
// passport.initialize(): 요청(req) 객체에 passport 관련 기능을 추가
app.use(passport.initialize());
// passport.session(): 세션을 활용하여 사용자 인증 상태를 유지하기위한미들웨어,
// 세션을 활용하여 사용자 인증 상태를 유지 이 미들웨어는 express-session 미들웨어와 함께 사용되어야 하며, express-session이 먼저 설정되어야한다
// passport.session()은 serializeUser와 deserializeUser 호출을 통해 사용자 세션을 자동으로 관리
// serializeUser: 사용자 인증 성공 시, 사용자 정보를 세션에 저장하는 방법을 정의
// deserializeUser: 각 요청 시, 세션에서 사용자 정보를 불러오는 방법을 정의
app.use(passport.session());

app.use(express.json());
// form태그에서 전달받은 값을 받기위한 미들웨어
app.use(express.urlencoded({ extended: false }));
app.use("/static", express.static(path.join(__dirname, "..", "public")));

// view engine 설정
app.set("views", path.join(__dirname, "views"));
// console.log(path.join(__dirname, "views"));
app.set("view engine", "ejs");

// prettier-ignore
mongoose.connect(process.env.MONGO_URI)
  .then(() => {console.log("connected to mongodb");})
  .catch((err) => {console.log(err);});
// console.log(path.join(__dirname, "..", "public"));

// 라우터등록
app.use("/", mainRouter);
app.use("/auth", usersRouter);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
