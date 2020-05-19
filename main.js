const electron = require("electron");
const robot = require("robotjs");
const fs = require("fs");
const yargs = require("yargs");
var firstload = true;

// arguments only work if running electron directly
program = yargs
    .option("latitude", {
        alias: "a",
        type: "float",
        default: 53.8008
        //description: ''
    })
    .option("longitude", {
        alias: "o",
        type: "float",
        default: -1.5491
    })
    .option("bearing", {
        alias: "b",
        type: "float",
        default: 0
    })
    .option("name", {
        alias: "n",
        type: "string",
        default: "untitled"
    })
    .option("width", {
        alias: "2",
        type: "float",
        default: 1200
    })
    .option("height", {
        alias: "h",
        type: "float",
        default: 1200
    })
    .option("street", {
        alias: "s",
        type: "boolean",
        default: false
    })
    .option("percent", {
        alias: "p",
        type: "float",
        default: .5
    })
    .option("dev", {
        alias: "d",
        type: "boolean",
        default: false
    }).argv;


console.log(program.latitude, program.longitude, program.name);
// program.dev=true

console.log("args:", program);

if (program.dev) firstload = false;

const app = electron.app; // Module to control application life.

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function street() {
    if (firstload) {
        firstload = false;
        console.log("load");

        await sleep(4000);
        console.log("menu");
        // click on menu
        mainWindow.webContents.executeJavaScript(
            `document.querySelector('button[jsaction="settings.open;mouseover:omnibox.showTooltip;mouseout:omnibox.hideTooltip;focus:omnibox.showTooltip;blur:omnibox.hideTooltip"]').click();`
        );

        await sleep(2000);
        console.log("street");
        // click on streetview
        mainWindow.webContents.executeJavaScript(
            `document.evaluate("//label[contains(., 'Street View')]", document, null, XPathResult.ANY_TYPE, null ).iterateNext().parentNode.click()
    `
        );

        await sleep(3000);
        console.log("MouseClick");
        robot.moveMouse(
            parseInt(program.width / 2),
            parseInt(program.height / 2)
        );
        await sleep(200);
        robot.mouseClick();

        // t is up and down
        // h is bearing
        await sleep(4000);
        console.log("bearing");
        // click on bearing url
        mainWindow.webContents.executeJavaScript(
            `window.location.href = window.location.href.replace(/[\d\.]+h/, '${program.bearing}h')
    `
        );
        
        
                await sleep(1000);
            console.log("data");
            mainWindow.webContents.executeJavaScript(  `var fs = require('fs');fs.readFile('./measure.svg','utf-8', function read(err, data) {document.body.innerHTML += data;document.querySelector('svg').style.width='100%';document.querySelector('svg').style.height='100%';document.querySelector('svg').style['position']='absolute';
                document.querySelector('svg').innerHTML += '<rect width="${program.percent*100}vw" height="100%" style="fill:#222;opacity:0.2" />'
            })`)
            
            
    } else {
        if (!program.dev) {
        await sleep(2000);
        console.log("clean");
        // click on streetview
        mainWindow.webContents.executeJavaScript(
            `[...document.querySelector('div#content-container').children].map(d=>{(d.id==='scene')?null:d.remove()})
`
        );

        await sleep(5000);
        console.log("smile");

        
            image = await mainWindow.webContents.capturePage();
            console.log(image);
            fs.writeFile(`./images/${program.name}.png`, image.toPNG(), err => {
                if (err) throw err;
                console.log("It's saved!");
                    app.quit();
            });
        }
        console.log("end");
    }
}

async function satellite() {
    if (firstload) {
        firstload = false;
        console.log("load");

        await sleep(4000);
        console.log("menu");
        // click on menu
        mainWindow.webContents.executeJavaScript(
            `document.querySelector('button[jsaction="settings.open;mouseover:omnibox.showTooltip;mouseout:omnibox.hideTooltip;focus:omnibox.showTooltip;blur:omnibox.hideTooltip"]').click();`
        );

        await sleep(3000);
        console.log("satellite");
        // click on streetview
        mainWindow.webContents.executeJavaScript(
            `[...document.querySelectorAll('label.widget-settings-button-label')].filter(d=>d.innerText==='Satellite')[0].parentNode.click();`
        );


        await sleep(2000);
        console.log("circle");
        // click on bearing url
        mainWindow.webContents.executeJavaScript(`
            document.querySelector('canvas').style['clip-path']='circle(50% at center)';
    `
        );
            


        // t is up and down
        // h is bearing
        await sleep(4000);
        console.log("bearing");
        // click on bearing url
        mainWindow.webContents.executeJavaScript(`
            document.querySelector('canvas').style.transform='rotate(${program.bearing}deg)'
    `
        );
        
        
        await sleep(1000);
    console.log("data");
    mainWindow.webContents.executeJavaScript(  `var fs = require('fs');fs.readFile('./measure.svg','utf-8', function read(err, data) {document.body.innerHTML += data;document.querySelector('svg').style.width='100%';document.querySelector('svg').style.height='100%';document.querySelector('svg').style['position']='absolute';
        document.querySelector('svg').innerHTML += '<rect width="${program.percent*100}vw" height="100%" style="fill:#222;opacity:0.2" />'
    })`)
            //     `
            //     var fs = require('fs');
            //     fs.readFile('./measure.svg','utf-8', function read(err, data) {
            //     if (err) {throw err;}
            //     const content = data;
            //     //console.log(data)
            //     //d3 = require('d3')
            // 
            //     document.body.innerHTML += data
            // 
            //     document.querySelector('svg').style.width='100%'
            //     document.querySelector('svg').style.height='100%'
            //     document.querySelector('svg').style['position']='absolute'
            //     <rect width="${program.percent*window.innerWidth}" height="100%" style="fill:#222;" />
            // })
            // `
            // 
            
              
          
    

    

    
        if (!program.dev) {
        await sleep(2000);
        console.log("clean");
        // click on streetview
        mainWindow.webContents.executeJavaScript(
            `[...document.querySelector('div#content-container').children].map(d=>{(d.id==='scene')?null:d.remove()})
`
        );





        await sleep(5000);
        console.log("smile");

        
            image = await mainWindow.webContents.capturePage();
            console.log(image);
            fs.writeFile(`./images/satellite_${program.name}.png`, image.toPNG(), err => {
                if (err) throw err;
                console.log("It's saved!");
                    app.quit();
            });
        }
        console.log("end");
    }
}







const BrowserWindow = electron.BrowserWindow; // Module to create native browser window.
var mainWindow = null;

app.on("window-all-closed", function() {
    if (process.platform != "darwin") {
        app.quit();
    }
});

app.on("ready", function() {
    const myLocation = "file://" + __dirname;
    mainWindow = new BrowserWindow({
        width: program.width,
        height: program.height,
        resizable: true,
        title: "Dan Ellis 2019",
        webPreferences: {
            nodeIntegration: true
        },
        x: 0,
        y: 0,
        show: true
    });
    //mainWindow.openDevTools(); // and load the index.html of the app.
    mainWindow.loadURL(
        //'https://www.yahoo.co.uk'
        `https://www.google.co.uk/maps/@${program.latitude},${program.longitude},${program.street?22:19}z`
    );

    mainWindow.webContents.on("did-finish-load", program.street?street:satellite);

    mainWindow.on("closed", function() {
        mainWindow = null;
        app.quit();
    });
});

// capture
