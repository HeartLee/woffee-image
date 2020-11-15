const fs = require('fs');
const https = require('http');
const request = require('request');
const path = require('path');
const finder = require('./finder');
const config = require('./config');

const savePath = path.join(__dirname,'image-gallery');

// 保存文件
function saveImgFile(src, {index, title, url}) {
  const mid = url.split('&')[1];
  let ext = src.split('=').pop();
  let imgName = src.split('/')[4];
  src= src.replace('https', 'http');
  if(ext!=='.gif'){
    https.get(src, (res) => {
        let imgData = "";
        res.setEncoding("binary");
        res.on("data", function (chunk) {
            imgData += chunk;
        });
        res.on("end", function () {
            if (imgData) {
                let filePath = savePath +'/' + mid +'/'+ imgName +'.'+ext;
                fs.writeFile(filePath, imgData, "binary", function (err) {
                    if (err) {
                        console.log("down fail", err);
                    }
                }); 
            } else {
                console.log('下载失败！,图片路径不存在！');
            }
        });
    })
    return imgName
  }
}

function start(url) {
  request(url, (err, res, body) => {
      console.log('start spider');
      if (!err && res) {
          console.log('beginning');
          const mid = url.split('&')[1];
          const dirPath = savePath+'/'+ mid
          fs.mkdir(dirPath, ()=>{})
          finder.findImg(body, url, saveImgFile);
          fs.writeFile(dirPath+'/'+'source.txt', url, ()=>{})
      }
  })
}

const array2= [
  "https://mp.weixin.qq.com/s?__biz=MzA4NDE4OTAxMQ==&mid=2650083817&idx=1&sn=a8da5a3974249983adec1a2eb12e0ec6&chks7eabbd5b09d32c37584c6c0bf4034e0c33e3f80b0b5330cb097bb0db0a50be47497ae21501c&scene=21#we_redirect",
  "https://mp.weixin.qq.com/s?__biz=MzA4NDE4OTAxMQ==&mid=2650092030&idx=1&sn=14ad66b7692380ced04db1d70ba7b271&chks bc2b09d12d4503804d95c7f94bbe20739c0cb6463872e6c72d809a2499a1e690265763f&scene=21#wechat",
  "https://mp.weixin.qq.com/s?__biz=MzA4NDE4OTAxMQ==&mid=2650095235&idx=1&sn=726d99c476b39493f1a24e3d1df23ed0&chks bfb09d1da9afe854a2253a438e9ecfeadb1c9603d194f95727a01c87af068935e23eeb&scene=21#wechat_re",
]

function test(){
  config.weChatLinkArray.forEach(start)
}

test()