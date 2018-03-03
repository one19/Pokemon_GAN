# pokeGAN

## Overview
This is the code for [this](https://youtu.be/yz6dNf7X7SA) video on Youtube by Siraj Raval. We'll use a WGAN to create new kinds of Pokemon. 

## NEW Dependencies (pip install) 
```
node ( >=8.0)
tensorflow( >=1.0)
(CUDA drivers, because running this on a CPU is far far far too slow to be practical or economical)
scipy
numpy
```

### NOTES
This project used to take a **whole boatload** of setup, and I got kinda fed up with the python dev environment's lack of *give a shit* for the end-users time and versioning requirements.

It's very very likely that I'll be doing some more rewrites as I move forward with some testing here, but the very first thing was stripping the image manips from python. The node ones are a *little* slower, but they also **actually work**. Fresh installs on a windows pc produced images with tons of artifacts and issues.

### CUDA INSTALLATION (windows):
1. Download **64 bit** [python 3.5.x](https://www.python.org/downloads/windows/)
1. Download [**NODE 9**](https://nodejs.org/en/download/) (because seriously, node is sick these days)
2. Download **CUDA 9.0** [drivers](https://developer.nvidia.com/cuda-toolkit)
3. install `pip install tf-nightly-gpu` from the command line
4. Download the [CuDNN libs](https://developer.nvidia.com/cudnn) and put the unzipped files into your `C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v9.0` files in the same folder nesting they come in

##### Then:
1. `npm i -g yarn` (not strictly-speaking necessary, but i haven't dropped the habit yet)
2. `yarn` (or `npm install` if you didn't want to add yarn)
3. `node massage_images.js`
4. `python pokeGAN.py`
5. you're now testing tensorflow with this repo (:

## example pokemon
My first run after 4950 epochs!
![image1](https://github.com/one19/Pokemon_GAN/raw/master/epoch4950.jpeg)

#### Issues:
1. Iteration doesn't include the final run iteration, meaning models aren't exported on 5000 as expected
2. There's *no* documentation on how to use an exported model to generate a file
3. There's *no* dodumentation on how to continue a training session from an existing model

#### WOULD LIKE TODO:
1. add another stream of meta information to the convolutions ({ pokemonType, fastOrSlow, height })
2. grab images/metaInfo from https://pokeapi.co/ pre-transformation instead of a data folder
3. Include all pokemon in the training set

## Credits

The credits for this code go to [moxiegushi](https://github.com/moxiegushi/pokeGAN) and [||source||](https://github.com/llSourcell/Pokemon_GAN).
They did the hard work, and I'm just translating some of bits into something that makes it easier for a muppet like me to understand (or people more familiar with standard javascript stuff).
