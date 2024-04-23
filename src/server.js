const express= require('express');
const { default: mongoose }= require('mongoose');
const app= express();

app.use(express.json());
// form태그에서 전달받은 값을 받기위한 미들웨어
app.use(express.urlencoded({ extended: false }));

mongoose.connect(``)








const PORT= 4000;
app.listen(PORT, ()=> console.log(`listening on port ${PORT}`); );
