const electron = require("electron");
const robot = require("robotjs");
const fs = require("fs");
const program = require("commander").program;

var firstload = true;

program
    .option("-a, --latitude <lat>", "latitude", 53.8008)
    .option("-o, --longitude <lon>", "longitude", -1.5491)
    .option("-b, --bearing <bearing>", "bearing", 0)
    .option("-n, --name <name>", "filename", "untitled")
    .option("-w, --width <w>", "width", 1200)
    .option("-h, --height <h>", "height", 800)
    .option("-d, --dev", "development switch", false);

program.parse(process.argv);
// 
// var args = process.argv.slice(2);

console.log("args:", program.args);

if (program.dev) firstload = false;

const app = electron.app; // Module to control application life.

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function start() {
    if (firstload) {
        firstload = false;
        console.log("load");

        await sleep(2000);
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

        await sleep(2000);
        console.log("MouseClick");
        robot.moveMouse(parseInt(program.width / 2), parseInt(program.height / 2));
        await sleep(200);
        robot.mouseClick();

        // t is up and down
        // h is bearing
        await sleep(2000);
        console.log("bearing");
        // click on bearing url
        mainWindow.webContents.executeJavaScript(
            `window.location.href = window.location.href.replace(/[\d\.]+h/, '${program.bearing}h')
    `
        );
    } else {
        await sleep(2000);
        console.log("clean");
        // click on streetview
        mainWindow.webContents.executeJavaScript(
            `[...document.querySelector('div#content-container').children].map(d=>{(d.id==='scene')?null:d.remove()})
`
        );

        await sleep(2000);
        console.log("smile");

        if (!program.dev) {
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
    mainWindow.openDevTools(); // and load the index.html of the app.
    mainWindow.loadURL(
        //'https://www.yahoo.co.uk'
        `https://www.google.co.uk/maps/@${program.latitude},${program.longitude},27z`
    );

    mainWindow.webContents.on("did-finish-load", start);

    mainWindow.on("closed", function() {
        mainWindow = null;
        app.quit();
    });
});

// capture
