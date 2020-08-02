let ws281x = require('rpi-ws281x-native');

var NUM_LEDS = parseInt(process.argv[2], 10) || 300,
    pixelData = new Uint32Array(NUM_LEDS);

var brightness = 1;

ws281x.init(NUM_LEDS);


var lightsOff  = function (){
    for (var i = 0;  i < NUM_LEDS; i++){
        pixelData[i] = color(0,0,0);
    }
    ws281x.render(pixelData);
    ws281x.reset();
}

var signals = {
    'SIGINT': 2,
    'SIGTERM' : 15
};

function shutdown(signal, value){
    console.log("stopped by ", signal);
    lightsOff();
    process.nextTick(function () {process.exit(0);})
}

Object.keys(signals).forEach(function(signal){
    process.on(signal, function(){
        shutdown(signal, signals[signal]);
    })
})

// animation loop
var offset = 0;
  setInterval(function () {
    for (var i = 0 ; i < NUM_LEDS; i++){
        pixelData[i] = wheel(((i*256/NUM_LEDS) + offset) % 256);
        // pixelData[i] = color(66, 135, 245);
        console.log(pixelData[i])
    }

    offset = (offset+ 1) % 256;
    ws281x.render(pixelData);
  }, 1000 / 30)

console.log("rainbow started ctrl + C to stop")

// generate rainbow colors across 255 locations
function wheel(pos){
    pos = 255 - pos;
    if(pos<85 ){return color(255 - pos * 3, 0, pos - 3);}
    else if (pos < 170){ pos -=85; return color(0, pos* 3, 255 - pos * 3); }
    else {pos -= 170; return color(pos* 3, 255 - pos * 3, 0 );}
}


// genorate integer from RGB value
function color(rx,gx,bx){
    let r = rx * brightness / 255;
    let g = gx * brightness / 255;
    let b = bx * brightness / 255;
    return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}
