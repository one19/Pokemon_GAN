const jsonfile = require('jsonfile');
const axios = require('axios');
const jimp = require('jimp');
const fs = require('fs');

const TYPES = require('./types');


const saveImage = async (url, pokeNumber) =>
  jimp.read(url).then(image => {
    const resizedBlackBackground = image.autocrop().resize(96, 96).opaque();
    resizedBlackBackground.write(`seed_data/color_${pokeNumber}.png`);
    return resizedBlackBackground.dither565().greyscale().write(`seed_data/grey_${pokeNumber}.png`);
  });

/*
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

  /*
  * we intend to leave the types in whatever order they're supposed to come in, just in case.
  * it seems likely that the first type is the more dominantly expressed design choice
  * There are 394 (18 * 18) possibilities, so sadly not evenly distributed in base 16
  * monotypes are expressed as a doublet
  */
  const typeName1 = types.find(type => type.slot === 1).type.name
  const type1 = `${TYPES[typeName1]}`;
  const typeSlot2 = types.find(type => type.slot === 2);
  const type2 = typeSlot2 ? `${TYPES[typeSlot2.type.name]}` : type1;

  /*
  * returns a big string that's really a set of six numbers (0-255) representing the stats, in order
  * (speed, hp, attack, defense, special attack, special defense)
  * this is useful in determining what traits correspond to what stats
  * (think [bouba & kiki](https://www.psychologicalscience.org/news/releases/words-can-sound-round-or-sharp-without-us-realizing-it.html))
  */
  const statString = ['speed','hp','attack','defense','special-attack','special-defense'].reduce((ret, statName) => {
    const number = stats.find(({ stat, base_stat }) => stat.name === statName);
    const normalNumber = JSON.stringify(Math.max(Math.min(number.base_stat, 255), 0));
    return `${ret}${normalNumber.padStart(3, 0)}`;
  }, '');

  const json = {
    height: JSON.stringify(height),
    weight: JSON.stringify(weight),
    type: `${type1.padStart(3, 0)}${type2.padStart(3, 0)}`,
    stats: statString
  };

  jsonfile.writeFileSync(`seed_data/${pokeNumber}.json`, json, { spaces: 2 });
  await saveImage(front_default, pokeNumber);
};
