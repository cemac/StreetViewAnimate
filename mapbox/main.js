

const electron = require('electron');

require('electron-reload')(__dirname);


const app = electron.app;  // Module to control application life.

  app.commandLine.appendSwitch('--no-sandbox');

app.commandLine.appendSwitch('enable-unsafe-es3-apis');
// app.commandLine.appendSwitch('--ignore-gpu-blacklist');
 app.commandLine.appendSwitch('ignore-cpu-blacklist');

  app.commandLine.appendSwitch('enable-gpu-memory-buffer-video-frames');

  app.commandLine.appendSwitch('enable-native-gpu-memory-buffers');


  app.commandLine.appendSwitch('enable-prototype-webgl2');

  app.commandLine.appendSwitch('enable-gpu-rasterization');



  app.commandLine.appendSwitch('enable-webgl2-compute-context ');


  //
   app.commandLine.appendSwitch('override-use-software-gl-for-tests');


app.commandLine.appendSwitch('gpu-launcher');



const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
var mainWindow = null;

app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit();
    }});

app.on('ready', function() {
    const myLocation = 'file://' + __dirname
    mainWindow = new BrowserWindow({width:900, height: 800,resizable: true,title:'Dan Ellis 2016' ,
	webgl: true,
  webgl2:true,
  webPreferences: {
      sandbox:false,
      webgl: true,
      webgl2:true,
      experimentalFeatures: true,
      experimentalCanvasFeatures: true
  },

    show:true});
    mainWindow.openDevTools();    // and load the index.html of the app.
    mainWindow.loadURL( myLocation + '/index.html');

    mainWindow.on('closed', function() { mainWindow = null;  app.quit();});
});
