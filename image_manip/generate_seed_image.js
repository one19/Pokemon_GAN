const axios = require('axios');
const jimp = require('jimp');
const fs = require('fs');
const { getJSDOMAddress } = require('./3d_crawl');

const TYPES = require('./types');
const POKE_URL = 'https://assets.pokemon.com/assets/cms2/img/pokedex/full';

const duoHexStringify = (stat) => Math.round(Number.parseInt(stat, 10)).toString(16).padStart(2, 0);

const saveImage = async (url, pokeNumber, type, dimension) =>
  jimp.read(url).then(image => {
    const resizedBlackBackground = image.background(0xFFFFFFFF).rgba(false).autocrop().resize(dimension, dimension);
    resizedBlackBackground.write(`seed_data/${type}/color/${pokeNumber}.png`);
    return resizedBlackBackground.dither565().greyscale().write(`seed_data/${type}/grey/${pokeNumber}.png`);
  }).catch(e => console.log('jimp failure, maybe figure out why'));

/**
* function that writes a json file to disk describing a pokemon
* @param {String} id-number
* @return {undefined|Error}
*/
module.exports.getPokemon = async pokeNumber => {
  const {
    data: {
      height,
      weight,
      stats,
      types,
      sprites: { front_default }
    }
  } = await axios.get(`http://pokeapi.co/api/v2/pokemon/${pokeNumber}`);

  /**
  * we intend to leave the types in whatever order they're supposed to come in, just in case.
  * it seems likely that the first type is the more dominantly expressed design choice
  * There are 394 (18 * 18) possibilities, so sadly not evenly distributed in base 16
  * monotypes are expressed as a doublet
  */
  const typeName1 = types.find(type => type.slot === 1).type.name;
  const type1 = `${TYPES[typeName1]}`;
  const typeSlot2 = types.find(type => type.slot === 2);
  const type2 = typeSlot2 ? `${TYPES[typeSlot2.type.name]}` : type1;


  /**
  * returns a big string that's really a set of six numbers (0-255) representing the stats, in order
  * (speed, hp, attack, defense, special attack, special defense)
  * this is useful in determining what traits correspond to what stats
  * (think [bouba & kiki](https://www.psychologicalscience.org/news/releases/words-can-sound-round-or-sharp-without-us-realizing-it.html))
  */
 const statString = ['speed','hp','attack','defense','special-attack','special-defense'].reduce((ret, statName) => {
   const number = stats.find(({ stat, base_stat }) => stat.name === statName);
   const normalNumber = JSON.stringify(Math.max(Math.min(number.base_stat, 255), 0));
   return `${ret}${duoHexStringify(normalNumber)}`;
  }, '');
  const typeString = `${duoHexStringify(type1)}${duoHexStringify(type2)}`;
  const heightString = duoHexStringify(height);
  const weightString = weight.toString(16).padStart(4, 0);

  const metaBin = `${typeString}${statString}${heightString}${weightString}`;

  const paddedNumber = `${pokeNumber}`.padStart(3, 0);

  fs.writeFileSync(`seed_data/bins/${paddedNumber}`, metaBin);
  await saveImage(front_default, paddedNumber, 'icon', 96);
  await saveImage(`${POKE_URL}/${paddedNumber.padStart(3, 0)}.png`, paddedNumber, 'art', 475);

  try {
    const modeledImageSrc = await getJSDOMAddress(paddedNumber);
    await saveImage(modeledImageSrc, paddedNumber, '3d', 240);
  } catch (e) {
    console.log('really really unhandled 3d image scraper error', e);
  }
};
