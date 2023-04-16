const PostalMime = require('postal-mime');
import { connect } from '@planetscale/database'

const config = {
	host: 'aws.connect.psdb.cloud',
	username: '51kbeuzgqvjtu6i9fux7',
	password: 'pscale_pw_3YhwzLxG6WFGoBukwZNraK0Vun2JskOBRIJtdIFk81T',
	fetch: (url, init) => {
	  delete (init)["cache"]; // Remove cache header
	  return fetch(url, init);
	}
  }

async function streamToArrayBuffer(stream, streamSize) {
	let result = new Uint8Array(streamSize);
	let bytesRead = 0;
	const reader = stream.getReader();
	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			break;
		}
		result.set(value, bytesRead);
		bytesRead += value.length;
	}
	return result;
}

export default {
	async email(message, env, ctx) {
		const randomid = generateRandomString(20)
		const rawEmail = await streamToArrayBuffer(message.raw, message.rawSize);
		const parser = new PostalMime.default();
		const parsedEmail = await parser.parse(rawEmail);
		const url = `https://rest.ably.io/channels/${parsedEmail.to[0].address.replace('@goog.re', '').toLowerCase()}/publish`;
		const auth = "KrffQw.B5z7vA:tqifIlfRyw9nW2PTAHYxEcWEnE0DteTKJ7zacjMLy9c";

		const html = parsedEmail.html.replace("'",'"')
		console.log(html)
		const data = {
			name: "update", data: { "id": randomid, "subject": parsedEmail.subject, "from": parsedEmail.from.name, "from_mail": parsedEmail.from.address, "messageId": parsedEmail.messageId, "date": parsedEmail.date, "to": parsedEmail.to[0].address }
		};
		const data2 = { "subject": parsedEmail.subject, "from": parsedEmail.from.name, "from_mail": parsedEmail.from.address, "messageId": parsedEmail.messageId}
		
		console.log(data2)
		
		const conn = connect(config)
		const results = await conn.execute(`INSERT INTO mail (id,receiver,info,date,body) VALUES ('${randomid}','${message.to}','${JSON.stringify(data2)}',NOW(),'${html}')`)
		console.log(results)
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Basic ${btoa(auth)}`,
			},
			body: JSON.stringify(data),
		});
		console.log("Status Code:", response.status);
		const responsedata = await response.json();
		console.log("Status Body:", responsedata);

	}
};

function generateRandomString(length) {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
	  result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
  }
