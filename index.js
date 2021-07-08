var http = require('http'),
    path = require('path'),
    os = require('os'),
    fs = require('fs');
var Busboy = require('busboy');
//var mysql = require('mysql2');
const { exec } = require('child_process');


var mysql      = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "raspi#@!",
  database: "users"
});

var formData = {}

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

exec('mkdir uploads', (error, re, stderr) => {
})    



function insert(data){
  con.query("INSERT INTO `data`  SET ?",data, function (err, result) {
    if (err) throw err;
    console.log(err)
  })
}

http.createServer(function(req, res) {
  if (req.method === 'POST') {
    var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      var saveTo = "uploads/" + filename
      file.pipe(fs.createWriteStream(saveTo));
    });
  busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    formData[fieldname] = val
  });
    busboy.on('finish', function() {
      res.writeHead(200, { 'Connection': 'close' });
      res.end("upload done");
      insert(formData)
    });
    return req.pipe(busboy);
  res.writeHead(404);
  res.end();

  }
 else if (req.method === 'GET') {
    res.writeHead(200, { Connection: 'close' });
    res.end('<html><body> \
<form action="fileupload" method="POST" enctype="multipart/form-data" > \
<input type="text" id="firstname" name="firstname"> \
<input type="text" id="lastname" name="lastname"> \
<input type="text" id="email" name="email"> \
<input type="text" id="phone" name="phone"> \
<input type="text" id="age" name="age"> \
<input type="file" id="files" name="files" multiple><br><br> \
<input type="submit"></form></body></html>')
  }
}).listen(8000, function() {
  console.log('Listening for requests');
});

