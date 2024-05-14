const express = require("express");
const { default: mongoose } = require("mongoose");
const path = require("path");
const User = require("./models/users.model");
const app = express();

// passport 모듈 사용하기
// .env설정
require("dotenv").config();
const passport = require("passport");
const cookieSession = require("cookie-session");
const { isAuth, isNotAuth } = require("./middlewares/auth");
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
// isAuth: 로그인이 되있는지 확인하는 함수 로그인이 되어있다면 next(), 안되있다면 로그인페이지로 리다이렉트
app.get("/", isAuth, (req, res) => {
  res.render("index");
});

// view engine 설정
app.set("views", path.join(__dirname, "views"));
// console.log(path.join(__dirname, "views"));
app.set("view engine", "ejs");

mongoose
  .connect(`mongodb+srv://kyyyy8629:1234@express-cluster.fzshmg3.mongodb.net/?retryWrites=true&w=majority&appName=express-Cluster`)
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });
// console.log(path.join(__dirname, "..", "public"));

// /login 요청시 로그인페이지로 이동
//isNotAuth: 로그인이 되어있다면 루트페이지로 리다이렉트 안되있다면 진행
app.get("/login", isNotAuth, (req, res) => {
  res.render("login");
});
app.post("/login", (req, res, next) => {
  // 로컬 로그인전략을 사용하기때문에 passport모듈의 authenticate 메서드를 사용해서 "local"
  // authenticate() : 전략 불러오는 메서드
  // done 호출시 authenticate메서드 두번째 매개변수 콜백실행
  // console.log("222222222222222222");
  passport.authenticate("local", (err, user, info) => {
    // done에 null이 담겨왔다면(에러발생) 담겨 왔다면 express 에러처리기로 이동(next)
    if (err) return next(err);
    // done에 user가 없고 info가 담겨왔다면(아이디가 틀렸거나 비밀번호가 틀렸거나)
    if (!user) return res.json({ message: info });
    // 정상적으로 일치했을시 passport에서 제공해주는 req.login()메서드 실행
    // req.login(): 사용자세션을 수립하기위해 사용, 아래 과정을 통해 user 객체 정보가req.user에 할당된다
    // 1. passport.serializer() 함수로 이동
    console.log("req.login 들어가기전 user:", user);
    req.logIn(user, (err) => {
      // 에러 발생시 에러처리기로 이동
      if (err) return next(err);
      // 로그인 성공시 루트페이지로 이동
      res.redirect("/");
    });
  })(req, res, next); // 미들웨어 안의 미들웨어를 호출하려면 ()을붙여 호출을 추가로 해줘야하고 안에 req,res,next 매개변수도 넣어줘야한다
});
// 로그아웃버튼 클릭시
app.post("/logout", (req, res, next) => {
  // req.logout(): passport에서 제공하는 메서드로,사용자 세션을 종료시키는 함수
  req.logOut((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});
// /signup 요청시 회원가입 페이지로 이동
app.get("/signup", isNotAuth, (req, res) => {
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
// login.ejs에서 구글로그인을 눌렀을시 실행될 api, 구글 passport 전략이 실행된다
app.get("/auth/google", passport.authenticate("google"));
// 구글에서 콜백시켜서 오는 api엔드포인트
// prettier-ignore
app.get("/auth/google/callback", passport.authenticate("google", {
    // 성공했을 시 이동할 주소
    successReturnToOrRedirect: "/",
    // 실패 시 이동할 주소
    failureRedirect: "/login",
  })
);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
