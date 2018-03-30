const JSDOM = require('jsdom').JSDOM;

module.exports.getJSDOMAddress = async (pokeNumber) => {
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
