const crypto = require("crypto")

class Enc{
	constructor(){
		this.alg = "aes-256-cbc"
	}

	getRandomIV(){
		return crypto.randomBytes(16)
	}

	encrypt(text, password, iv) {
		password = crypto.createHash("sha256").update(String(password)).digest("base64").substr(0, 32);
 		let cipher = crypto.createCipheriv(this.alg, Buffer.from(password), iv);
 		let encrypted = cipher.update(text);
 		encrypted = Buffer.concat([encrypted, cipher.final()]);
 		return {"iv": iv.toString("hex"), "pass": encrypted.toString("hex")};
	}

	decrypt(text, password) {
		password = crypto.createHash("sha256").update(String(password)).digest("base64").substr(0, 32);
 		let iv = Buffer.from(text["iv"], "hex");
 		let encryptedText = Buffer.from(text["pass"], "hex");
 		let decipher = crypto.createDecipheriv(this.alg, Buffer.from(password), iv);
 		let decrypted = decipher.update(encryptedText);
 		decrypted = Buffer.concat([decrypted, decipher.final()]);
 		return decrypted.toString();
	}

}

module.exports = {Enc}