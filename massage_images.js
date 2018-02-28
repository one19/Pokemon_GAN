const jimp = require('jimp');
const fs = require('fs');

const images = fs.readdirSync('./data');

images.forEach(image => {
  jimp.read(`./data/${image}`).then(imgData => {
    const imageName = image.split('.')[0];
    return imgData.resize(256, 256)
      .rgba(false)
      .write(`./resized_black/${imageName}.jpg`)
  }).catch(err => {
    console.log(err)
  });
});
