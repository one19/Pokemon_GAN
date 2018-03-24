const fs = require('fs');
const axios = require('axios');
const { spawn } = require('child-process-promise');

const MAX_INDEX = 720;

/**
* So, what's going on here then? First up, we lazily prep the seed_data folder, and bin folder within
* `jimp` recursively creates folders, but `fs` doesn't
* 
* Then we go ahead and start  
*/
const startMultiBatching = async (size) => {
  try {
    fs.mkdirSync('seed_data');
    fs.mkdirSync('seed_data/bins');
  } catch (e) {
    console.log("Error creating ./seed_data/ & /bins folders. Continuing, assuming they're there already")
  }

  let startIndex = 0;
  while (startIndex <= MAX_INDEX) {
    console.log(`Starting next batch of 80 at #${startIndex}.`)
    const nextTodo = [...Array(size).keys()];
    try {
      await Promise.all(
        nextTodo.map((i) =>
          spawn('bin/batch_worker', [`https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${startIndex + (20 * i)}`], { stdio: 'inherit' })
        )
      );
      startIndex += 80;
    } catch (e) {
      console.log('RREEEeeeeeeeeee', e);
    }
  }
};

startMultiBatching(4);
