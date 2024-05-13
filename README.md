# Passport Tutorial
Node.js를 위한 인증(authentication)과 인가(authorization)를 구현하기 쉽게 만들어 주는 middleware

### EXPRESS-PASSPORT-APP 생성하기
1. `npm init -y`
2. `src 폴더` 생성
3. `npm install dotenv express nodemon body-parser cookie-parser cors mongoose passport passport-local passport-google-oauth20`

### 로그인 화면 구현
1. `npm i ejs`
```javascript
// server.js
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
```
