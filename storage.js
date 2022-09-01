const path = require("path")
const fs = require("fs")
const {Enc} = require("./encryption")

class Storage{
	constructor(){
		this.stPath = path.join(__dirname, "storage")
		this.enc = new Enc()
	}

	checkJSON(jsonFile, json){
		if(!fs.existsSync(jsonFile)){
			fs.writeFileSync(jsonFile, JSON.stringify(json))
		}
	}

	getPasswords(master){
		let masterJson = {"passwords":[]}
		let masterJsonFile = path.join(this.stPath, "master.json")
		this.checkJSON(masterJsonFile, masterJson)
		let jsondata = JSON.parse(fs.readFileSync(masterJsonFile))
		for(let i = 0; i<jsondata["passwords"].length; i++){
			let curr = jsondata["passwords"][i]
			let pass = this.enc.decrypt(curr, master)
			curr["pass"] = pass
			masterJson["passwords"].push(curr)
		}
		return masterJson
	}

	addPassword(master, passwordJson){
		let masterJson = {"passwords":[]}
		let masterJsonFile = path.join(this.stPath, "master.json")
		this.checkJSON(masterJsonFile, masterJson)
		let jsondata = JSON.parse(fs.readFileSync(masterJsonFile))

		let encPass = this.enc.encrypt(passwordJson["pass"], master, this.enc.getRandomIV())
		passwordJson["pass"] = encPass["pass"]
		passwordJson["iv"] = encPass["iv"]

		jsondata["passwords"].push(passwordJson)
		fs.writeFileSync(masterJsonFile, JSON.stringify(jsondata))
	}
}

module.exports = {Storage}