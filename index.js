const electron = require('electron');
const log4js = require('log4js');
const TCPRelay = require('shadowsocks-over-websocket').TCPRelay;
const {
  app,
  ipcMain,
  BrowserWindow,
  dialog
} = electron;

const DEBUG = false;

let win;
var logger = log4js.getLogger('ss-over-ws-gui');
var running = false;
var relay = null;

function createWindow() {

  win = new BrowserWindow({
    width: DEBUG ? 520 : 320,
    height: 500,
    resizeable: false,
    maximizable: false,
    fullscreen: false,
    fullscreenable: false,
    titleBarStyle: 'hidden',
    // frame: false,
    transparent: true,
    webPreferences: {
      devTools: DEBUG
    }
  });

  win.loadURL(`file://${__dirname}/assets/html/index.html`);
  win.on('closed', () => {
    win = null;
  });

  win.show();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  console.log('window all closed')
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  console.log('app active')
  if (win === null) {
    createWindow();
  }
});

ipcMain.on('app-start', function(event, config) {
  relay = new TCPRelay(config, true, 'info');
  relay.bootstrap().then(function() {
    logger.info('tcprelay is running', config);
    running = true;
    event.sender.send('sslocal-status-change', true);
  }).catch(function(error) {
    logger.error(error);
    running = false;
    event.sender.send('sslocal-status-change', false);
  });
});

ipcMain.on('app-shutdown', function(event) {
  relay && relay.stop().then(function() {
    logger.info('tcprelay is stopped');
    running = false;
    event.sender.send('sslocal-status-change', false);
    relay = null;
  });
});