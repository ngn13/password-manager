const electron = require("electron")
const {ipcRenderer} = electron

const login = document.getElementById("login")
const input = document.getElementById("input")

login.addEventListener("click", ()=>{
	ipcRenderer.send("login", input.value)
	location.href = "index.html"
})