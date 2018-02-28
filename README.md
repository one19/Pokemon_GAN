# pokeGAN

## Overview
This is the code for [this](https://youtu.be/yz6dNf7X7SA) video on Youtube by Siraj Raval. We'll use a WGAN to create new kinds of Pokemon. 

## NEW Dependencies (pip install) 
```
(the project initally required `pillow` and `opencv-python`, neither of which were listed)
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
1. npm i -g yarn (not strictly-speaking necessary, but i haven't dropped the habit yet)
2. yarn install (or npm install if you didn't want to add yarn)
3. node massage_images.js
4. python pokeGAN.py
5. you're now testing tensorflow with this repo (:

## example pokemon
![image1](https://github.com/moxiegushi/pokeGAN/raw/master/images/Notes_1500532347861.jpeg)

![image2](https://github.com/moxiegushi/pokeGAN/raw/master/images/Notes_1500532371830.jpeg)

## Credits

The credits for this code go to [moxiegushi](https://github.com/moxiegushi/pokeGAN). I've merely created a wrapper to get people started. 
