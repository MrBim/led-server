const http = require ("http").createServer(handler);
let ws281x = require('rpi-ws281x-native');
let fs = require('fs');
let io = require ('socket.io')(http)

http.listen(8080);

function handler(req, res){
    fs.readFile(__dirname + '/public/index.html', function (err, data) {
        if (err){
            res.writeHead(200, {'content-type': 'text/html'});
            return res.end('404 Not Found');
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    })
}
io.sockets.on('connection', function(socket){
    socket.on("light", function(data){
        console.log("data: ", data)

        const colorObject = translateHexToRgb(data);
        // console.log("colorObject: ", colrObject)
        const newColor = color(colorObject);
        let lightValue = newColor;
        // console.log('lightValue: ', lightValue)
        if (lightValue){
            const newSequence = initialSequence.map(el => {
                if (el === "#000000"){
                    const obj = translateHexToRgb("#000000");
                    // console.log("if :", el, obj)
                    return color(obj)
                } else {
                    // console.log("else: ", el, lightValue)
                    return lightValue
                }
            })
            // setLeds(lightValue)
            // setLeds(newSequence)
            console.log("newSeq: ")
            runChase(newSequence)
        }
    })
} )

function translateHexToRgb(hexStr){
    let hex = hexStr;
    // console.log( hexStr, typeof hexStr )
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5), 16);    
   
    // console.log("RGB: ", r, g, b);
    
    return {r, g, b}
}

// genorate integer from RGB value 
function color(colorObject){
    let brightness = 128;
    g = colorObject.r * brightness / 255;
    r = colorObject.g * brightness / 255;
    b = colorObject.b * brightness / 255;

    return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

var NUM_LEDS = parseInt(process.argv[2], 10) || 300,
    pixelData = new Uint32Array(NUM_LEDS);

ws281x.init(NUM_LEDS);

function setLeds(lights){
     for (var i = 0 ; i < NUM_LEDS; i++){
        // pixelData[i] = lights;
        pixelData[i] = lights[i];
    }
    ws281x.render(pixelData);
    // ws281x.render(lights);
}
function runChase (sequence){
    let mutableSequence = [...sequence]
    let i = 0;
    const chase = setInterval(() => {
        let newSequence = [];
        for (let j = 0; j < sequence.length; j++){
            if (j <1){
                newSequence.push(mutableSequence[sequence.length - 1])
            }else {
                newSequence.push (mutableSequence[j - 1])
            }
        }
        console.log("i: ", i)
        // console.log("tick", newSequence)
        mutableSequence = [...newSequence];
        setLeds(newSequence)
        if (i >= sequence.length -1){
            clearInterval(chase)
        }
        i++
    }, 1000 / 30);
}
let initialSequence = [ 
    '#660000',
    '#990000',
    '#cc0000',
    '#ff0000',
    '#ff0000',
    '#ff0000',
    '#ff0000',
    '#cc0000',
    '#990000',
    '#660000',            

    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',

    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    
    '#660000',
    '#990000',
    '#cc0000',
    '#ff0000',
    '#ff0000',
    '#ff0000',
    '#ff0000',
    '#cc0000',
    '#990000',
    '#660000',            

    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',

    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    
    '#660000',
    '#990000',
    '#cc0000',
    '#ff0000',
    '#ff0000',
    '#ff0000',
    '#ff0000',
    '#cc0000',
    '#990000',
    '#660000',            

    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',

    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000'
]