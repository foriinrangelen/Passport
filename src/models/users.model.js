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
    // sparse: true,: sparse index라고하고
    // 기본적으로 email, password를 이용한 로그인 하나(로컬 로그인)와 googleId를 이용한 로그인 두가지를 구현하는데
    // 로컬로그인시 구글로그인 필드는 null, 다시 구글로그인을 하고 다시 로컬로그인을 실행하면 구글아이디는 다시 null값이 들어오게되서
    // googleId 의 unique에 제약이 걸리기때문에(에러발생) 방지하기 위해 사용
    sparse: true,
  },
});

// comparePassword
userSchema.methods.comparePassword = async function (plainPassword, callback) {
  // 원래라면 bcrypt 모듈을 활용하여 compare 비교해야함 임시대기
  // plainPassword => 클라이언트에서 온 password, this.password는 DB에 있는 비밀번호가 담김
  // comparePassword의 두번째 매개변수인 콜백은 전략에서 사용되고있는 comparePassword의 두번째 매개변수 콜백으로 이동한다
  // 같은함수임, 정의를 모델에서 한거
  if (plainPassword === this.password) {
    // 비밀번호가 일치한다면 callback함수의 두번째 인자로 true 담기
    callback(null, true);
  } else {
    // 틀리면 false담기
    callback(null, false);
  }
  // 에러면 콜백첫번재인자로 에러담긴 객체 리턴
  return cb({ error: "error" });
};

// 모델은 스키마를 사용하여 실제 데이터베이스 작업을 수행하는 메서드를 제공하는 객체
const User = mongoose.model("User", userSchema);

module.exports = User;

// 스키마와 모델의 차이?
//스키마는 데이터베이스에서 사용될 문서의 구조를 정의합니다.
//모델은 스키마를 기반으로 생성되며, 실제 데이터베이스 작업을 수행하는 메서드를 제공합니다.
//스키마가 데이터의 "청사진"이라면, 모델은 그 청사진을 바탕으로 실제 건물을 짓고 관리하는 역할을 하는 것으로 볼 수 있습니다.
