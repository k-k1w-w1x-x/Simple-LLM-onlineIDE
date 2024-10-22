const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron')
const path = require('path')
const { fork } = require('child_process');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
    });

    mainWindow.loadURL('http://localhost:3001'); 

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

    mainWindow.webContents.openDevTools();
}

function startServer() {
    const server = fork(path.join(__dirname, 'server.js'));
    return server;
}

app.whenReady().then(() => {
    console.log(`App started.`);
    startServer();
    createWindow();
});

app.on('window-all-closed', () => {
    app.quit();
});

const menuTemplate = [
    {
        label: '文件',
        submenu: [
            {
                label: '打开文件',
                accelerator: 'CmdOrCtrl+O', // 快捷键
                click() {
                    openFile();
                }
            },
            { type: 'separator' },
            {
                label: '退出',
                accelerator: 'CmdOrCtrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

function openFile() {
    dialog.showOpenDialog(mainWindow, {
        properties: ['openFile']
    }).then(result => {
        if (!result.canceled) {
            console.log(result.filePaths);
        }
    }).catch(err => {
        console.error(err);
    });
}