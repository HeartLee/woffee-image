const cheerio = require('cheerio');

function findImg(dom, url, callback) {
  let $ = cheerio.load(dom);
  const title = $('.rich_media_title').text();
  $('.rich_media_content img').each((index,dom)=>{
      const imgSrc = $(dom).attr('data-src');
      callback(imgSrc,{index, title, url});
  })
}

module.exports = {
  findImg
}