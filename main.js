const { app, BrowserWindow} = require('electron');

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        icon: __dirname + '/icons/icon.png',
    });
    mainWindow.loadFile('./pages/index.html');
});