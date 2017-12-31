/*var http = require('http');
var app = require('./app');

http.createServer(app.handleRequest).listen(8000);*/
var express = require('express');
var app = express();

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'CLOUD'
});

app.get('/', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
 });

app.get('/login', function (req, res) {
  var name = req.query.userName;
  var pass = req.query.pass;
   connection.connect();
   connection.query('SELECT password from login WHERE username = ?',[name], function(err, rows, fields) {
     if (!err){
         if(rows[0].password == pass){
           res.sendFile( __dirname + "/" + "login.html" );
           console.log(rows[0].password);
         }else{
           res.end("username/password not valid");
          }
     }else{
       console.log('Error while performing Query.');
     }
   });
   connection.end();
});

var server = app.listen(8000, function () {
  var port = server.address().port

  console.log("Example app listening at port %s",port)
})
