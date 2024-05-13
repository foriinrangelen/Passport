const express = require("express");
const { default: mongoose } = require("mongoose");
const path = require("path");
const User = require("./models/users.model");
const app = express();
// passport 모듈 사용하기
const passport = require("passport");
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
app.use("expreess-session", passport.session());

app.use(express.json());
// form태그에서 전달받은 값을 받기위한 미들웨어
app.use(express.urlencoded({ extended: false }));
app.use("/static", express.static(path.join(__dirname, "..", "public")));

// view engine 설정
app.set("views", path.join(__dirname, "views"));
// console.log(path.join(__dirname, "views"));
app.set("view engine", "ejs");

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
// console.log(path.join(__dirname, "..", "public"));

// /login 요청시 로그인페이지로 이동
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", (req, res, next) => {
  // 로컬 로그인전략을 사용하기때문에 passport모듈의 authenticate 메서드를 사용해서 "local"
  // authenticate() : 전략 불러오는 메서드
  // done 호출시 authenticate메서드 두번째 매개변수 콜백실행
  passport.authenticate("local", (err, user, info) => {
    // done에 null이 담겨왔다면(에러발생) 담겨 왔다면 express 에러처리기로 이동(next)
    if (err) return next(err);
    // done에 user가 없고 info가 담겨왔다면(아이디가 틀렸거나 비밀번호가 틀렸거나)
    if (!user) return res.json({ message: info });
    // 정상적으로 일치했을시 passport에서 제공해주는 req.login()메서드 실행
    // req.login(): 사용자세션을 수립하기위해 사용, 아래 과정을 통해 user 객체 정보가req.user에 할당된다
    // 1. passport.serializer() 함수로 이동
    req.logIn(user, (err) => {
      // 에러 발생시 에러처리기로 이동
      if (err) return next(err);
      // 로그인 성공시 루트페이지로 이동
      res.redirect("/");
    });
  });
});

// /signup 요청시 회원가입 페이지로 이동
app.get("/signup", (req, res) => {
  res.render("signup");
});

// /signup 페이지에서 아이디,비밀번호 입력 후 요청시(post)
app.post("/signup", async (req, res) => {
  // 1.유저 객체 생성하기
  const user = new User(req.body);
  //   console.log(req.body);
  //   console.log(user);
  // 2. user collection에 저장하기(RDB에서는 Table)
  try {
    // 2-1. 정상적으로 저장 시
    await user.save();
    res.status(200).json({
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
