const fs = require('fs');
const axios = require('axios');
const { getPokemon } = require('./generate_seed_image');

/*
* Function that starts grabbing and processing all pokemon on a single page response
* since pokeapi/pokemon returns paginated numbers of pokemon to grab, 20 at a time
* @param {String} url
* return {String|null} next-page url
*/
const batch = async (url) => {
  const  { data: { count, results, next } } = await axios.get(url);
  console.log('next', next)

  await Promise.all(results.map(singlePoke => {
    const pokeNum = singlePoke.url.replace(/\/$/, '').match(/\d+$/ig)[0];
    return getPokemon(Number.parseInt(pokeNum, 10));
  }));
  console.log(`${100 * Number.parseInt(url.match(/\d+$/) ? url.match(/\d+$/)[0] : 0, 10) / count}% done!`);
  return next;
};


const startBatching = async (url) => {
  try {
    fs.mkdirSync('seed_data');
  } catch (e) {
    console.log("Error creating seed_data folder. Continuing, assuming it's there already")
  }

  let nextToDo = await batch(url);
  while (nextToDo) {
    nextToDo = await batch(nextToDo);
  }
}

startBatching('http://pokeapi.co/api/v2/pokemon');
