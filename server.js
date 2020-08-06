const http = require("http").createServer(handler);
// let ws281x = require("rpi-ws281x-native");
let ws281x = require("./rpi-ws281x-native");
let fs = require("fs");
let io = require("socket.io")(http);
const chroma = require('chroma-js');
http.listen(8080);
let runningChase;

function handler(req, res) {
    fs.readFile(__dirname + "/public/index.html", function (err, data) {
        if (err) {
            res.writeHead(200, { "content-type": "text/html" });
            return res.end("404 Not Found");
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        return res.end();
    });
}

io.sockets.on("connection", function (socket) {
    socket.on("light", function (data) {
        console.log("data: ", data);
        const startState = [
            0, 1, 2, 3, 4, 25, 26, 27, 28, 29,  50, 51, 52, 53, 54,  75, 76, 77, 78, 79, 
            100,101,102,103,104, 125,126,127,128,129, 150,151,152,153,154, 175,176,177,178,179, 
            200,201,202,203,204, 225,226,227,228,229, 250,251,252,253,254, 275,276,277,278,279];
        const fullChase = createChase(startState, createSteps, data, NUM_LEDS);
        if (runningChase)(
            clearInterval(runningChase)
        )
        runChase(fullChase, 1000 / 30);
    });
});

// generate integer from RGB value

var NUM_LEDS = parseInt(process.argv[2], 10) || 300,
    pixelData = new Uint32Array(NUM_LEDS);

ws281x.init(NUM_LEDS);

function setLeds(lights) {
    for (var i = 0; i < NUM_LEDS; i++) {
        pixelData[i] = lights[i];
    }
    ws281x.render(pixelData);
}

function translateHexToRgb(hexStr) {
    let hex = hexStr;

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5), 16);
    return { r, g, b };
}

function formatColor(colorObject) {
    let brightness = 255;
    g = (colorObject.r * brightness) / 255;
    r = (colorObject.g * brightness) / 255;
    b = (colorObject.b * brightness) / 255;

    return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

const createChase = (initState, pattern, color, stripLength) => {
    // use initState to create the first step in the pattern
    const firstStep = createFirstStep(initState, color, stripLength);

    // use the pattern to expand the initial step in to a loop
    const fullPattern = pattern(firstStep, stripLength);

    // return the array of arrays
    return fullPattern;
};

const runChase = (chase, stepLength) => {
    let i = 0;
    
    runningChase = setInterval(() => {
	// console.log("i: ", i);
        setLeds(chase[i]);
        if (i < chase.length - 1) {
            i++;
        } else {
            i = 0;
        }
    }, stepLength);
};

const createFirstStep = (initialState, color, stripLength) => {
    // use initState to create the first step in the pattern
    let initArray = new Array(stripLength);

    for (let i = 0; i < initArray.length; i++) {
        // the current number is in the array of lit leds
        if (initialState.includes(i)) {
            if (i > 0 ){
                if (initArray[i - 1] === 0  || !initialState.includes(i + 1)){
                    const mixedColor = chroma.mix(color, "#000000", 0.9).hex();
                    console.log("included,, i > 0, prev step is 0: ", i, color ,mixedColor)

                    initArray[i] = formatColor(translateHexToRgb(mixedColor));
                } else{
                    initArray[i] = formatColor(translateHexToRgb(color));
                }
                // else it is the first one in th e strip
            } else {
                // accounting for the last LED in the strip being on in the pattern 
                if (initialState.includes(initArray.length - 1)){

                    initArray[i] = formatColor(translateHexToRgb( color));
                } else{
                    const mixedColor = chroma.mix(color, "#000000", 0.9).hex();
                    console.log("included, i !> 0 : ", i, mixedColor)

                    initArray[i] = formatColor(translateHexToRgb(mixedColor));
                }
            }
        } else {
            initArray[i] = formatColor(translateHexToRgb("#000000"));
        }
    }

    console.log("init step: ", initArray);
    return initArray;
};

const createSteps = (firstStep, stripLength) => {
    let initArray = new Array(stripLength);
    initArray[0] = firstStep;
    // create a new step
    for (let j = 1; j < stripLength; j++) {
        const step = [];
        for (let i = 0; i < firstStep.length; i++) {
            // do a thing where we shift the last led to the start and increment by one.
            let newLed = i - j;
            if (newLed < 0) {
                newLed += stripLength;
            }
            step.push(firstStep[newLed]);
        }
        // console.log(`step ${j}: ${step}`);
        initArray[j] = step;
    }
    return initArray;
};
