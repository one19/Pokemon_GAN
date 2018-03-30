const Nightmare = require('nightmare');

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
