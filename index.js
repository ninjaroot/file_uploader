var http = require('http'),
    path = require('path'),
    os = require('os'),
    fs = require('fs');
 
var Busboy = require('busboy');
 
http.createServer(function(req, res) {
  if (req.method === 'POST') {
    var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      var saveTo = "uploads/" + filename + ".png"
      file.pipe(fs.createWriteStream(saveTo));
    });
  busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    console.log('Field [' + fieldname + ']: value: ' + val);
  });
    busboy.on('finish', function() {
      res.writeHead(200, { 'Connection': 'close' });
      res.end("That's all folks!");
    });
    return req.pipe(busboy);
  res.writeHead(404);
  res.end();

  }
 else if (req.method === 'GET') {
    res.writeHead(200, { Connection: 'close' });
    res.end('<html><body> \
<form action="fileupload" method="POST" enctype="multipart/form-data" > \
<input type="text" id="sssss" name="ssssss"> \
<input type="file" id="files" name="files" multiple><br><br> \
<input type="submit"></form></body></html>')
  }
}).listen(8000, function() {
  console.log('Listening for requests');
});

