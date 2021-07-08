var http = require('http'),
    path = require('path'),
    os = require('os'),
    fs = require('fs');
var Busboy = require('busboy');
const { exec } = require('child_process');
var formData = {}


exec('mkdir /home/pi/temp_uploads', (error, re, stderr) => {
})    

function save_data(data) {
var dir = "/home/pi/face/Data_set/"+data.name
if (!fs.existsSync(dir)){
    fs.mkdir(dir,function() {
  console.log("dir made")
  fs.readdir("/home/pi/temp_uploads/", (err, files) => {
    files.forEach(file => {
	fs.rename("/home/pi/temp_uploads/"+file,dir+"/"+file,function() {
      console.log(file);
      })
    });
  });

 })
 }
}

http.createServer(function(req, res) {
  if (req.method === 'POST') {
    var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      var saveTo = "/home/pi/temp_uploads/" + filename
      file.pipe(fs.createWriteStream(saveTo));
    });
  busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    formData[fieldname] = val
  });
    busboy.on('finish', function() {
      res.writeHead(200, { 'Connection': 'close' });
      res.end("upload done");
      save_data(formData)
    });
    return req.pipe(busboy);
  res.writeHead(404);
  res.end();

  }
 else if (req.method === 'GET') {
    res.writeHead(200, { Connection: 'close' });
    res.end('<html><body> \
<form action="fileupload" method="POST" enctype="multipart/form-data" > \
<input type="text" id="name" name="name"> \
<input type="file" id="files" name="files" multiple><br><br> \
<input type="submit"></form></body></html>')
  }
}).listen(8000, function() {
  console.log('Listening for requests');
});

