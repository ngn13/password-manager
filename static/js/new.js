const electron = require("electron")
const {ipcRenderer} = electron

const app = document.getElementById("app")
const desc = document.getElementById("desc")
const type = document.getElementById("type")
const usern = document.getElementById("usern")
const pass = document.getElementById("pass")
const addnew = document.getElementById("addnew")

addnew.addEventListener("click", ()=>{
	ipcRenderer.send('newpass', app.value, desc.value, type.value, usern.value, pass.value)
	location.href = "index.html"
})