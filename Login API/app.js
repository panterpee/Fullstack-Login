var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()  //ใช้กับ parser ที่ front end ส่งเป็น raw 
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const saltRounds = 10;
const secret ="Fullstack-login" // รหัสลับ ที่จะใส่ไปในการ gen token 

app.use(cors())

const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "5663518Zz.",
    database: 'mydb'
  });

app.post('/register',jsonParser, function (req, res, next) {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {   //ทำการ hash password หลังจากสมัคร
        // Store hash in your password DB.
    connection.execute(
        'INSERT INTO users (email, password, fname, lname) VALUES (?,?,?,?)',
        [req.body.email, hash, req.body.fname, req.body.lname],
        function(err, results, fields) {
            if(err) {
                return res.json({status: "error" , msg: err })
            }
            res.json({status : "ok"})
        }
        );
    });

})

app.post('/login',jsonParser, function (req, res, next) {  
    connection.execute(
        'SELECT * FROM users WHERE email =?', [req.body.email],
        function(err, users, result, fields) {
            if(err) {
                return res.json({status: "error" , msg: err });
            }
            if(users.length==0) {
                return res.json({status : "error", msg: "No user Found"});
            } 
            bcrypt.compare(req.body.password, users[0].password, function(err, islogin) {   //เทียบ password กับในระบบที่ผ่านการ hash
                if (islogin) {
                    var token = jwt.sign({ email: users[0].email }, secret ,{ expiresIn: '1h' });   //gen token
                    return res.json({status: 'ok', msg: "Login success" , token})
                } else {
                    return res.json({status:"error", msg: "Login failed"})
                }
            });
        }
        );
})

app.post('/authen',jsonParser, function (req, res, next) {  // check token ส่งมารึเปล่า
    try {
        const token = req.headers.authorization.split(' ')[1]   // เอาคำว่า Bearer ออก เอาแต่ token
        //res.json({token})
        var decoded = jwt.verify(token, secret);    //ทำการ decode token 
        res.json({status :"ok" , decoded})
        // res.json({decoded})
    } catch (error) {
        res.json({status :"error" , message : error.message})
    }
})

app.listen(3333, function () {
  console.log('CORS-enabled web server listening on port 3333')
})