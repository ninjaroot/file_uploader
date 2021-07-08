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
// check if the folder is exist
if (!fs.existsSync(dir)){
  // create the person folder by his name
    fs.mkdir(dir,function() {
    // start read all files from temp_uploads folder
     fs.readdir("/home/pi/temp_uploads/", (err, files) => {
      files.forEach(file => {
        // move files from temp_uploads folder to face/Dataset/{person} folder
	fs.rename("/home/pi/temp_uploads/"+file,dir+"/"+file,function() {
      })
    });
  });
 })
 }
}





//http server creation
http.createServer(function(req, res) {
// check if http request method is POST type
  if (req.method === 'POST') {
    // busboy start catch data 
    var busboy = new Busboy({ headers: req.headers });
    //busboy catch file data
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      //busboy save file to temp_uploads folder
      var saveTo = "/home/pi/temp_uploads/" + filename
      file.pipe(fs.createWriteStream(saveTo));
    });
   // busboy catch data field "person name"
  busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    // save person name to formdata object
    formData[fieldname] = val
  });
  // steps after busboy finish catching data
    busboy.on('finish', function() {
      res.writeHead(200, { 'Connection': 'close' });
      res.end("upload done");
      // start save_data function
      save_data(formData)
    });
  return req.pipe(busboy);
  res.writeHead(404);
  res.end();
  }
}).listen(8000, function() {
  console.log('Listening for requests');
});

