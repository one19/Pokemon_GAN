const Nightmare = require('nightmare');

module.exports.getAddress = async (pokeNumber) => {
  const nightmare = new Nightmare();
  let returnImageSrc = '';

  try {
    returnImageSrc = await nightmare
      .goto(`https://bulbapedia.bulbagarden.net/wiki/File:Spr_7s_${pokeNumber}.png`)
      .wait('.fullImageLink')
      .evaluate(() => ([...document.querySelectorAll('.fullImageLink img')][0].currentSrc))
      .end();
  } catch (e) {
    console.error(`Nightmare error at pokemon ${pokeNumber}`);
  }

  return returnImageSrc;
}
