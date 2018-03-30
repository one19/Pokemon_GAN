const Nightmare = require('nightmare');
const JSDOM = require('jsdom').JSDOM;

module.exports.getAddress = async (pokeNumber) => {
  const nightmare = new Nightmare({ waitTimeout: 8000 });
  let returnImageSrc = '';
  
  try {
    returnImageSrc = await nightmare
      .goto(`https://bulbapedia.bulbagarden.net/wiki/File:Spr_7s_${pokeNumber}.png`)
      .wait('#filelinks')
      .evaluate(() => ([...document.querySelectorAll('.fullImageLink img')][0].currentSrc))
      .end()
      .then(imageUrl => imageUrl)
      .catch(async () => {
        const secondEvent = new Nightmare({ waitTimeout: 8000 });
        const gender = ['m', 'f'][Math.round(Math.random())];

        returnImageSrc = await secondEvent
          .goto(`https://bulbapedia.bulbagarden.net/wiki/File:Spr_7s_${pokeNumber}_${gender}.png`)
          .wait('#filelinks')
          .evaluate(() => ([...document.querySelectorAll('.fullImageLink img')][0].currentSrc))
          .end();
        return returnImageSrc;
    });
  } catch (e) {
    console.error(`Nightmare error at pokemon ${pokeNumber}`, e);
  }

  return returnImageSrc;
}

module.exports.getJSDOMAddress = async (pokeNumber) => {
  const nightmare = new Nightmare({ waitTimeout: 8000 });
  let returnImageSrc = '';
  const url = `https://bulbapedia.bulbagarden.net/wiki/File:Spr_7s_${pokeNumber}.png`;

  try {
    returnImageSrc = await JSDOM.fromURL(url, {})
      .then(dom => [...dom.window.document.querySelectorAll('.fullImageLink img')][0].getAttribute('src'))
      .catch(async (e) => {
        const gender = ['m', 'f'][Math.round(Math.random())];
        const secondary = `https://bulbapedia.bulbagarden.net/wiki/File:Spr_7s_${pokeNumber}_${gender}.png`;
    
        return JSDOM.fromURL(secondary, {})
          .then(dom => [...dom.window.document.querySelectorAll('.fullImageLink img')][0].getAttribute('src'));
      });
  } catch (e) {
    console.error(`Unhandled jsdom error at pokemon ${pokeNumber}`, e);
  }

  return `https:${returnImageSrc}`;
}

const test = async () => {
  let i = 0;
  while (i < 10) {
    console.time('jsdom')
    const url = await exports.getJSDOMAddress('002');
    console.timeEnd('jsdom')
    console.time('nightmare');
    const nightUrl = await exports.getAddress('002');
    console.timeEnd('nightmare');
    console.log(url);
    console.log(nightUrl);
    i++;
  }
}
test();
