const JSZip = require('jszip');
const fs = require('fs');
const es = require('event-stream');

const { ZIP_FOLDER } = require('../config');
let _self = this;

const readFile = async function (filePath) {
  let buffers = [];
  return new Promise((resolve, reject) => {
    let s = fs.createReadStream(filePath)
      .pipe(es.split())
      .pipe(es.mapSync(function (line) {
        // s.pause();
        buffers.push(Buffer.from(line + '\n'));
        // s.resume();
      }).on('error', function (err) {
        console.log('Error while reading file.', err);
      }).on('end', function () {
        console.log('Read entire file. ');
        resolve(Buffer.concat(buffers));
        // Promise.resolve(Buffer.concat(buffers));
      })
      );
  });
}

const jszipFn = async function () {
  let zip = new JSZip();
  let cranes = {
    'クレーン5002x1': [
      'Atn52001.pos',
      // 'atn52002.pos'
    ],
    // 'クレーン5002x2': [
    //   'atn52003.pos',
    //   'atn52004.pos'
    // ]
  };

  for (let crane in cranes) {
    let craneZipDir = zip.folder(crane);
    let atns = cranes[crane];
    for (let i = 0; i < atns.length; i++) {
      let atn = atns[i];
      let buffer = await readFile(`${ZIP_FOLDER}/${crane}/${atn}`);
      console.log('buffer', buffer);
      craneZipDir.file(`${crane}-${atn}`, buffer);
      console.log('i: ', i);
    }
    console.log('zip');
    return await zip.generateAsync({ 
      type: "nodebuffer",
      // encodeFileName: fileName => iconv.encode(fileName, "CP932")
    });
  }
  // let crane = zip.folder("クレーン");
  // crane.file("タ出力.pos", Buffer.from("%  GPST                  latitude(deg) longitude(deg)  height(m)   Q  ns   sdn(m)   sde(m)   sdu(m)  sdne(m)  sdeu(m)  sdun(m) age(s)  ratio     gps_id\n2018/06/12 05:19:59.000   37.423580257  141.033074761    94.4644   2   7   3.3428   2.7199  10.6848  -1.3939   2.9158  -2.1670  -0.01    2.1 ant50020_2"));
  // return await zip.generateAsync({ type: "nodebuffer" })
}

module.exports.jszipFn = jszipFn;