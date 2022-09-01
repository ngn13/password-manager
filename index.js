const electron = require("electron")
const url = require("url")
const path = require("path")
const {Constants} = require("./const")
const {Storage} = require("./storage")

const {app, BrowserWindow, Tray, Menu, ipcMain} = electron

const cns = new Constants()
const store = new Storage()
const staticDir = path.join(__dirname, "static")
const imageDir = path.join(__dirname, "images")

let mainWindow = null
let tray = null
let wpos = [0,0]
let matserPass = null

function createTray(){
	tray = new Tray(path.join(imageDir, "logo.png"))
	const cmenu = Menu.buildFromTemplate([
		{
			label: "Open",
			click: ()=>{
				createWindow()
			}
		},
		{
      		label: 'Quit',
      		click: ()=>{
        		app.quit()
      		}
      	}
	])
	tray.setToolTip(cns.APP_NAME)
	tray.setContextMenu(cmenu)
	tray.on("click",()=>{
		if(!mainWindow){
			createWindow()
		}
		mainWindow.focus()
	})
}

function createWindow(){
	if (!tray) {
    	createTray()
  	}

	//mainWindow = new BrowserWindow({resizable:false, width:750, height:450, autoHideMenuBar: true,
	mainWindow = new BrowserWindow({resizable:false, width:750, height:450,
		webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
	})
	mainWindow.loadURL(url.format({
		pathname: path.join(staticDir, "index.html"),
		protocol: "file:",
		slashes: true
	}))
	mainWindow.setPosition(wpos[0], wpos[1])
	mainWindow.on('closed', ()=>{
    	mainWindow = null
  	})
  	mainWindow.on('move', ()=>{
  		wpos = mainWindow.getPosition()
  	})
}

app.on("ready", createWindow)

app.on('window-all-closed', () => {
  // nothing here
})

ipcMain.on("getpass:send", ()=>{

	if(matserPass==null){
		return mainWindow.webContents.send("getpass:rcv", null)
	}

	let jsonData = null

	try{
		jsonData = store.getPasswords(matserPass)
	}catch {
		return mainWindow.webContents.send("getpass:rcv", null)
	}

	mainWindow.webContents.send("getpass:rcv", jsonData)
})

ipcMain.on("logout", ()=>{
	matserPass = null
})

ipcMain.on("login", (e, password)=>{
	matserPass = password
})

ipcMain.on("newpass", (e, app, desc, type, usern, pass)=>{
	console.log(app, desc, type, usern, pass)

	let jsonData = {
  		"iv": "123",
  		"pass": pass,
  		"app": app,
  		"desc": desc,
  		"usern": usern,
  		"type": ((type==="Main") ? true : false)
	}

	store.addPassword(matserPass, jsonData)
})