// Download the helper library from https://www.twilio.com/docs/node/install

const client = require("twilio")(accountSid, authToken);

client.messages
	.create({
		body: "This is the ship that made the Kessel Run in fourteen parsecs?",
		from: "+13524538456",
		to: "+13523910358"
	})
	.then((message) => console.log(message.sid))
	.done();
