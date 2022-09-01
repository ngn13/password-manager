const electron = require("electron")
const {ipcRenderer} = electron

const passDiv = document.getElementById("flex-pass-div")
const logout = document.getElementById("logout")

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

ipcRenderer.send("getpass:send")

ipcRenderer.on('getpass:rcv', (e, jsondata)=>{
	//console.log(jsondata)
	if(jsondata===null){
		return location.href = "login.html"
	}
	/*
	<div class="pass-div-outer">
		<img src="images/discord-logo.png">
		<div class="pass-div">
			<p class="pass-title">Discord [Main]</p>
			<p class="pass-desc">This is a test, i wanna test the UI.</p>
		</div>
	</div>

	we dont wanna cause xss so we'll create all the elements one by one
	and then set innerText values.
	*/
	for(let i = 0; i<jsondata["passwords"].length; i++){

		let curr = jsondata["passwords"][i]

		let mainDiv = document.createElement("div")
		mainDiv.setAttribute("class", "pass-div-outer")
		mainDiv.setAttribute("iv", curr["iv"])

		let img = document.createElement("img")
		img.setAttribute("src", getImageByApp(curr["app"]))

		let innerDiv = document.createElement("div")
		innerDiv.setAttribute("class", "pass-div")

		let p1 = document.createElement("p")
		p1.setAttribute("class", "pass-title")

		let p2 = document.createElement("p")
		p2.setAttribute("class", "pass-desc")

		p1.innerText = curr["app"] + " [" + ((curr["type"]) ? "Main" : "Alt") + "]"
		p2.innerText = curr["desc"]

		innerDiv.appendChild(p1)
		innerDiv.appendChild(p2)
		mainDiv.appendChild(img)
		mainDiv.appendChild(innerDiv)
		passDiv.appendChild(mainDiv)

		mainDiv.addEventListener("click", ()=>{
			return location.href = "getpass.html?iv=" + mainDiv.getAttribute("iv")
		})

	}
})

logout.addEventListener("click", ()=>{
	ipcRenderer.send("logout")
})