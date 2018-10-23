const JSZip = require('jszip');
const fs = require('fs');
const es = require('event-stream');

const { zip_folder } = require('./config');

const readFile = async function (filePath) {
  let buffers = [];
  return new Promise((resolve, reject) => {
    let s = fs.createReadStream(filePath)
      .pipe(es.split())
      .pipe(es.mapSync(function (line) {
        buffers.push(Buffer.from(line + '\n'));
      }).on('error', function (err) {
        console.log('Error while reading file.', err);
      }).on('end', function () {
        console.log('Read entire file. ');
        resolve(Buffer.concat(buffers));
      })
      );
  });
}

const jszipFn = async function (filePaths) {
  let zip = new JSZip();
  for(let i = 0; i < filePaths.length; i++) {
    let zupSubDirName = `クレーン${i}`;
    let zipSubDir = zip.folder(zupSubDirName);
    let buffer = await readFile(filePaths[i]);
    zipSubDir.file(`${zupSubDirName}.log`, buffer);
  }
 
  let zipBuffer await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE", // compression zip file
    encodeFileName: fileName => iconv.encode(fileName, "CP932")
  });
  let zipFilePath = zip_folder + '/zipFile.zip'
  fs.writeFileSync(zipFilePath, zipBuffer);
  return zipFilePath;
}
module.exports.jszipFn = jszipFn;