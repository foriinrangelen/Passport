# Passport Tutorial
Node.js를 위한 인증(authentication)과 인가(authorization)를 구현하기 쉽게 만들어 주는 middleware

### EXPRESS-PASSPORT-APP 생성하기
1. `npm init -y`
2. `src 폴더` 생성
3. `npm install dotenv express nodemon body-parser cookie-parser cors mongoose passport passport-local passport-google-oauth20 cookie-session`

### 로그인 화면 구현
1. `npm i ejs`
```javascript
// server.js
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
```
### cookie-session 과 express-session 의 차이
![image](https://github.com/foriinrangelen/Passport/assets/123726292/7d79084d-5f1c-4d78-92a8-df648e2f0a43)

### cookie-session 이용하여 구현
![image](https://github.com/foriinrangelen/Passport/assets/123726292/4409adde-5278-4df7-bdb9-dbb058eb3bb1)


