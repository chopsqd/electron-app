const path = require("path");
const os = require("os");
const fs = require("fs");
const resizeImg = require("resize-img");
const {app, BrowserWindow, Menu, ipcMain, shell} = require("electron");

// For tests
process.env.NODE_ENV = 'production'

const isDev = process.env.NODE_ENV !== 'production'
const isMac = process.platform === 'darwin'
let mainWindow

function createMainWindow() {
    mainWindow = new BrowserWindow({
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

    // Remove mainWindow from memory on close
    mainWindow.on('closed', () => (mainWindow = null))


    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow()
        }
    })
})

//Menu template
const menu = [
    {
        label: 'Test',
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
    resizeImage(options)
})

// Resize the image
async function resizeImage({imgPath, width, height, dest}) {
    try {
        const newPath = await resizeImg(fs.readFileSync(imgPath), {
            width: +width,
            height: +height
        })
        const filename = path.basename(imgPath)

        // Create dest folder if not exists
        if(!fs.existsSync(dest)) {
            fs.mkdirSync(dest)
        }

        // Write file to the destination folder
        fs.writeFileSync(path.join(dest, filename), newPath)

        // Send success to render
        mainWindow.webContents.send('image:done')

        // Open dest folder
        shell.openPath(dest)
    } catch (error) {
        console.log(error)
    }
}

app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit()
    }
})