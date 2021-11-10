 express = require('express'),
path = require('path'),
bodyParser = require('body-parser'),
cors = require('cors'),
sqlite3 = require('sqlite3').verbose();
router = express.Router();
multer = require("multer");

  http = require("http"),
  app = require("express")(),
  server = http.createServer(app);

var db = new sqlite3.Database(':memory:');

db.serialize(function () {
    db.run("CREATE TABLE lorem (info TEXT)");

    var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    for (var i = 0; i < 10; i++) {
        stmt.run("Ipsum " + i);
    }

    stmt.finalize();

    db.each("SELECT rowid AS id, info FROM lorem", function (err, row) {
        console.log(row.id + ": " + row.info);
    });
});

db.close();







 PORT = process.env.PORT || 8001;

console.log("Server started");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.all("/*", function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-type,Accept,X-Access-Token,X-Key"
  );
  if (req.method == "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
});

app.get("/", function(req, res) {
  res.send("POS Server Online.");
});



server.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));













 storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
 upload = multer({
    storage: storage
})

router.post('/image',  upload.single('file'), (req, res) => {
  // the file is uploaded when this route is called with formdata.
  // now you can store the file name in the db if you want for further reference.
   filename = req.file.filename;
   path = req.file. path;
  // Call your database method here with filename and path
  res.json({'message': 'File uploaded'});
});

module.exports = router;
