const mongoose = require("mongoose");

// 스키마 생성
const userSchema = new mongoose.Schema({
  email: {
    // 타입지정
    type: String,
    // 똑같은 이메일 사용하지못하게 (유효성 체크)
    unique: true,
  },
  password: {
    type: String,
    // 비밀번호는 최소 5자리 이상으로 설정 (유효성 체크)
    minLength: 5,
  },
  googleId: {
    type: String,
    unique: true,
  },
});
const User = mongoose.model("User", userSchema);

module.exports = User;

// 스키마와 모델의 차이?
