const fs = require('fs');
const axios = require('axios');
const { spawn } = require('child-process-promise');

const MAX_INDEX = 720;

const startMultiBatching = async (size) => {
  try {
    fs.mkdirSync('seed_data');
    fs.mkdirSync('seed_data/bins');
  } catch (e) {
    console.log("Error creating seed_data folder. Continuing, assuming it's there already")
  }

  let startIndex = 0;
  while (startIndex <= MAX_INDEX) {
    console.log('startIndex', startIndex)
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
