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
### 비밀번호 암호화 하기
1. `npm install bcryptjs --save`
2. `import * as bcrypt from 'bcryptjs'`
### 암호화 방법
#### 양방향 (암호화키를 알게된다면 복호화가 가능하므로 위험)
비밀번호 입력받음 > 알고리즘+ 암호화키로 암호화된 비밀번호 생성 > 복호화

#### 단방향 (레인보우 테이블에 털릴가능성있음)
SHA25 등으로 hash화 해서 저장
비밀번호 입력받음 > 해시화 > 해시화된 비밀번호 저장 > 복호화 불가능
#### 그럼 어떻게?
솔트(salt)+ 비밀번호를 해시로 암호화해서 저장(암호화할때 원래 비밀번호에 salt를 붙여 해시로 암호화)
ex 1234=> salt_1234

bcryptjs 모듈은 salt+해시화를 지원

### social login 구현해보기
#### Google Oauth key 생성
1. `https://console.cloud.google.com/apis/dashboard`
2. 프로젝트 생성> Oauth 동의화면 이동 > create > 정보입력 > 저장후 계속 끝까지
3. 사용자 인증정보 이동 > 사용자 인증정보만들기+Oauth 클라이언트ID 이동
4. 유형,이름 redirect URIs `http://localhost:4000/auth/google/callback` 입력 후 create
5. 클라이언트 ID, 클라이언트 보안비밀번호 체크

