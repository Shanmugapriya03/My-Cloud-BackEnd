/*var http = require('http');
var app = require('./app');

http.createServer(app.handleRequest).listen(8000);*/
var express = require('express');
var app = express();

var dockerCLI = require('docker-cli-js');
var DockerOptions = dockerCLI.Options;
var Docker = dockerCLI.Docker;

var docker = new Docker();

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'CLOUD'
});

connection.connect(function(err){
  if(err)
    throw err;
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
 });

app.get('/login', function (req, res) {
  var name = req.query.userName;
  var pass = req.query.pass;
      connection.query('SELECT password from login WHERE username = ?',[name], function(err, rows, fields){
        if(err) throw err;
        if(rows.length>0){
            if(rows[0].password == pass){
                res.json({
                  status: true,
                  message: "Successfully Logged In"
                });
            }else{
                res.json({
                  status:false,
                  message:"username and password does not match"
                });
            }
        }else{
          res.json({
            status:false,
            message:"Invalid username"
          });
        }
     });//query ends
});

app.get('/signup', function (req, res) {
  var values ={
  username:req.query.userName,
  password:req.query.pass
  }
      connection.query('INSERT INTO login SET ?',[values], function(err, rows, fields){
        if(err){
          if(err.code=='ER_DUP_ENTRY'){
            res.json({
              status:false,
              message:"User Already exists"
            });
          }else{
            throw err;
          }
        }else{
          res.json({
            status:true,
            message:"User Created Successfully"
          });
        }
     });//query ends
});

app.get('/dashboard/containers',function(req,res){
    docker.command('ps -a',function (err, data) {
      res.json(data.containerList);
    });
});
var server = app.listen(8000, function () {
  var port = server.address().port

  console.log("Example app listening at port %s",port)
})
