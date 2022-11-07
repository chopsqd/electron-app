//
// This file I usually use as a default settings file in my projects
//
// const electron = require("electron");
// const app = electron.app;
// const BrowserWindow = electron.BrowserWindow;
// const path = require("path");
// const url = require("url");
// let win;
//
// function createWindow() {
//     win = new BrowserWindow({
//         webPreferences: {
//             nodeIntegration: true,
//             enableRemoteModule: true,
//             contextIsolation: false
//         },
//         width: 600,
//         height: 380,
//         icon: __dirname + '/logo.png',
//         autoHideMenuBar: true,
//     });
//     win.loadURL(url.format({
//         pathname: path.join(__dirname, 'input.html'),
//         protocol: 'file',
//         slashes: true
//     }));
//
//     win.webContents.openDevTools();
//
//     win.on('closed', () => {
//         win = null;
//     })
// }
//
// app.on('ready', createWindow);