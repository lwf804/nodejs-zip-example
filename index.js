const express = require('express');
const fs = require('fs');

const { jszipFn } = require('./jszip');
const { zip_files } = require('./config');

const app = express();
const port = 3000;

app.set('views', process.cwd() + '/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/jszip', async function (req, res) {
  // In case zip file so large, increase timeout
  // req.setTimeout(500000);
  let filePaths = zip_files;
  let zipFile = await jszipFn(filePaths);
  if(fs.existsSync(zipFile)) {
      let fileZipName = '例題.zip';
      res.download(zipFile, fileZipName, function(err){
        fs.unlinkSync(zipFile);
        res.end();
      });
  } else {
      res.redirect('/');
  }
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))