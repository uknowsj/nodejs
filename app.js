const express = require('express'); //express 모듈요청
const path = require('path');
const app = express(); //app을 express 프레임워크로 킴
const ejs = require("ejs"); //ejs 모듈 요청
const port = 8000;
const bodyParser = require('body-parser');

//application/x-www-form-urlencoded를 분석해서 가져옴
app.use(bodyParser.urlencoded({extended: true}));
//application/json분석해서 가져옴
app.use(bodyParser.json());
//app.use(express.json());

// const dotent = require("dotenv");
// import dotenv from "dotenv"
// dotenv.config() //env파일 안에 있는 정보 로드


const mongoose = require('mongoose') 

const { User } = require('./models/User');
const { Target } = require('./models/Target');

/*-- mongoDB 연결 --*/
//const config = require('./config/key');

//외부 DB 접속
mongoose.connect(process.env.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(()=>console.log("mongoDB connected.."))
.catch(err=>console.log(err))


// 내부 DB 접속
// mongoose.connect('mongodb://localhost:27017/test', function(err) {
//   if (err) {
//     console.error('mongodb connection error', err);
//   }
//   console.log('mongodb connected');
// });




/*-- ejs 설정 --*/
app.set("view engine","ejs"); //app에 view engine을 설치. ejs를 템플릿으로
// app.set('views',(path.join(__dirname,'views'))); //view 폴더 경로는 프로젝트 폴더.(__dirname이 폴더위치)
app.use(express.static(__dirname+'/')); //view 폴더 경로는 프로젝트 폴더.(__dirname이 폴더위치)


/*-- main page --*/
app.get('/contact',function(req,res){
    //const sess = req.session; // 세션 객체에 접근
    res.render('index');
});

/*-- Join page --*/
// /reiger ->이게 엔드포인트
app.post('/register',(req,res)=>{
    //회원 가입할 떄 필요한 정보들을 clien에서 가져와 데이터베이스에 넣어줌
    //User 이용해서 인스턴스 생성
    const user = new User(req.body)//bodyparser이용해서 클라이언트정보받음
    console.log("req.body : ",req.body);
    console.log("user : ",user);
    user.save((err,userInfo)=>{//정보들이 user 모델에 저장됨
        if(err) {
            return res.json({success:false,err})}//err있으면 success:false라는 값과 함께 err메세지도 전송
        return res.status(200).json({
            success:true
        })
    }) 
});

var mainRouter = require('./routes/main');
app.use('/',mainRouter);


//search : find data from db with keyword
app.get('/search',(req,res)=>{
    var req_name = req.query.searchKey;
    Target.findOne({name:{$regex: new RegExp('^' + req_name, 'i')}},function(err, targets){
        if(err) {
          return res.status(500).send({error: err.message});
        }
        res.status(200).json(targets);
       });
});



// app.use('/mid_result',(req,res,next)=>{
//     console.log("mid:",req.query);
//     res.locals.info = req.query;
//     res.send("hello");
// });
app.get('/mid_result',(req,res)=>{
    key = req.query.info;
    console.log("mid:",req.query.info);
    Target.findOne({name:{$regex: new RegExp('^' + key, 'i')}},function(err,targets){
        if(err) {
            return res.status(500).send({error: err.message});
          }
            res.json(targets);
         });
});
app.get('/result',(req,res)=>{
    var key = req.query.searchKey;
    // console.log(req.qeury);
    Target.findOne({name:{$regex: new RegExp('^' + key, 'i')}},function(err,targets){
        if(err) {
            return res.status(500).send({error: err.message});
          }
            console.log("dataInfo:",targets);
            res.render('result',{targetInfo:targets});
         });
    res.locals.key = req.query.searchKey;
});

app.get('/test',(req,res)=>{
    var key = req.query.name;
    res.render('testPage',{name:key});
});



app.get('/pt',(req,res)=>{
    //res.render('anything')
    var d = req.query;
    console.log("get",req.query);
    console.log("post",req.body);
    res.send(req.body); 
})



var fs = require('fs');
const { nextTick } = require('process');


app.get('/test',(req,res)=>{
    res.render('test');
});
app.post('/test2',(req,res)=>{
    console.log("query!! :",req.body);
   // console.log(res);
    res.send(req.body);
});
app.post('/getFile',(req,res)=>{
    fs.readFile('sample.txt', 'utf8', function(err, data){
        console.log(data);
      });
    console.log(req);
    res.send("ee");
})
app.get('/tt',(req,res)=>{
    res.render('tt');
})
app.post('/testApi',(req,res)=>{
    console.log(req);
    res.send("ee");
})
app.listen(port,()=>console.log(`Example app listening on port ${port}`));

