const electron = require("electron")
const {ipcRenderer} = electron

const mainbox = document.getElementById("mainbox")
const url = new URLSearchParams(window.location.search)

function getImageByApp(app){
	if(app=="Discord"){
		return "images/discord.png"
	}

	else if(app=="AWS"){
		return "images/aws.png"
	}

	else if(app=="Github"){
		return "images/github.png"
	}

	else if(app=="Google"){
		return "images/google.png"
	}

	else if(app=="Mail"){
		return "images/mail.png"
	}

	else if(app=="Twitter"){
		return "images/twitter.png"
	}

	else{
		return "images/default.png"
	}
}

if(url.get("iv")===null){
	location.href = "index.html"
}

ipcRenderer.send("getpass:send")

ipcRenderer.on('getpass:rcv', (e, jsondata)=>{
	if(jsondata===null){
		return location.href = "login.html"
	}
	/*
		<div class="pass-title-div">
			<img src="images/discord-logo.png">
			<p class="pass-title">Discord [Main]</p>
		</div>
		<p class="pass-desc">This is a test, i wanna test the UI.</p>
		<p>(Double click to copy)</p>
		<input type="text" id="usern" value="test123@test.com" readonly>
		<input type="password" id="pass" value="coolpassword" readonly>
	*/
	for(let i = 0; i<jsondata["passwords"].length; i++){

		let curr = jsondata["passwords"][i]

		if(curr["iv"]===url.get("iv")){
			let titleDiv = document.createElement("div")
			titleDiv.setAttribute("class", "pass-title-div")

			let img = document.createElement("img")
			img.setAttribute("src", getImageByApp(curr["app"]))
			
			let p1 = document.createElement("p")
			p1.setAttribute("class", "pass-title")
			p1.innerText = curr["app"] + " [" + ((curr["type"]) ? "Main" : "Alt") + "]"

			let p2 = document.createElement("p")
			p2.setAttribute("class", "pass-desc")
			p2.innerText = curr["desc"]

			let p3 = document.createElement("p")
			p3.innerText = "(Double click to copy)"

			let userInput = document.createElement("input")
			userInput.setAttribute("id", "usern")
			userInput.setAttribute("type", "text")
			userInput.setAttribute("value", curr["usern"])

			let passInput = document.createElement("input")
			passInput.setAttribute("id", "pass")
			passInput.setAttribute("type", "password")
			passInput.setAttribute("value", curr["pass"])

			titleDiv.appendChild(img)
			titleDiv.appendChild(p1)
			mainbox.appendChild(titleDiv)
			mainbox.appendChild(p2)
			mainbox.appendChild(p3)
			mainbox.appendChild(userInput)
			mainbox.appendChild(passInput)

			const usern = document.getElementById("usern")
			const pass = document.getElementById("pass")

			usern.addEventListener("dblclick", ()=>{
				navigator.clipboard.writeText(usern.value);
				usern.style.border = "solid 1px green"
				setTimeout(()=>{
					usern.style.border = "none"
				},1000)
			})

			pass.addEventListener("dblclick", ()=>{
				navigator.clipboard.writeText(pass.value);
				pass.style.border = "solid 1px green"
				setTimeout(()=>{
					pass.style.border = "none"
				},1000)
			})

			return
		}

		//location.href = "index.html"

	}
})