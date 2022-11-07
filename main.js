const path = require("path");
const os = require("os");
const fs = require("fs");
const {app, BrowserWindow, Menu, ipcMain} = require("electron");

const isDev = process.env.NODE !== 'production'
const isMac = process.platform === 'darwin'

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'Image Resizer',
        width: isDev ? 1000 : 500,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
        }
    });

    // Open devtools if in dev env
    if(isDev) {
        mainWindow.webContents.openDevTools()
    }

    mainWindow.loadFile(path.join(__dirname, './render/index.html'))
}

// Create About window
function createAboutWindow() {
    const aboutWindow = new BrowserWindow({
        title: 'About Image Resizer',
        width: 300,
        height: 300,
        autoHideMenuBar: true
    });

    aboutWindow.loadFile(path.join(__dirname, './render/about.html'))
}

app.whenReady().then(() => {
    createMainWindow()

    // Implement menu
    const mainMenu = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(mainMenu)


    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow()
        }
    })
})

//Menu template
const menu = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Quit',
                click: () => app.quit(),
                acceleration: 'Ctrl+W'
            }
        ]
    },
    {
        label: 'Help',
        submenu: [
            {
                label: 'About',
                click: createAboutWindow
            }
        ]
    }
]

// Respond to ipcRenderer resize
ipcMain.on('image:resize', (event, options) => {
    options.dest = path.join(os.homedir(), 'imageresizer')
})

app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit()
    }
})