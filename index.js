var http = require('http'),
    path = require('path'),
    os = require('os'),
    fs = require('fs');
var Busboy = require('busboy');
var mysql = require('mysql2');
const { exec } = require('child_process');


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "raspi#@!",
  database: "users"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

exec('mkdir uploads', (error, re, stderr) => {
})    



function insert(data){

  var sql = "INSERT INTO `data` (`firstname`, `lastname` ,`email`,`phone`,`age`) VALUES ('" + data + "','" + data + "','" + data + "','"+ data + "','" +data + "')";
  //console.log(data+"+data")
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(err)
  })


}

http.createServer(function(req, res) {
  if (req.method === 'POST') {
    var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      var saveTo = "uploads/" + filename + ".png"
      file.pipe(fs.createWriteStream(saveTo));
    });
  busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
data=[]
data.push(val);
console.log(data);
  });
    busboy.on('finish', function() {
      res.writeHead(200, { 'Connection': 'close' });
      res.end("upload done");
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

