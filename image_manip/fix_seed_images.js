const fs = require('fs');
const { getPokemon } = require('../image_manip/generate_seed_image');

const MAX_INDEX = 800;

const stripFileType = (fileString) => fileString.replace('.png', '');

/**
* generate seed images is pinging the absolute crap out of a couple sites. Sometimes they reject us. /:
*
* so, instead of writing a retryer() and wrapping our grabs, I decided to just try and patch the holes
* this function does that.
* it is called at the end of `yarn seed`, but can also be called manually with `yarn seedfix`
*/
const fixupSeeds = async () => {
  const shouldExistPokemon = Array.apply(null, { length: MAX_INDEX }).map((_, i) => `${i + 1}`.padStart(3, 0))
  const bins = fs.readdirSync('./seed_data/bins');
  const color3d = fs.readdirSync('./seed_data/3d/color').map(stripFileType);
  const grey3d = fs.readdirSync('./seed_data/3d/grey').map(stripFileType);
  const colorArt = fs.readdirSync('./seed_data/art/color').map(stripFileType);
  const greyArt = fs.readdirSync('./seed_data/art/grey').map(stripFileType);
  const colorIcon = fs.readdirSync('./seed_data/icon/color').map(stripFileType);
  const greyIcon = fs.readdirSync('./seed_data/icon/grey').map(stripFileType);

  const allSeed = [].concat(bins, color3d, grey3d, colorArt, greyArt, colorIcon, greyIcon);

  let i = 0;
  while (i < MAX_INDEX) {
    // if we have any less than the full 7 images
    if (allSeed.filter(e => shouldExistPokemon[i] === e).length !== 7) {
      console.log(`failure on pokemon ${shouldExistPokemon[i]}, fixing...`)
      await getPokemon(i + 1);
      console.log('done');
    }
    i++;
  }
};

fixupSeeds();
