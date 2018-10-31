//
//
// keep for reference
// const http = require("http");
// const express = require("express");
// const MessagingResponse = require("twilio").twiml.MessagingResponse;
// const bodyParser = require("body-parser");
// var jsonParser = bodyParser.json(); // in case request is in json

// use
import { WebApp } from "meteor/webapp";
import express from "express";
import twilio from "twilio";
import bodyParser from "body-parser";

// Your Account Sid and Auth Token from twilio.com/console
const accountSid = "ACe312f86d62e91bcec8a9b576c73c9a34";
const authToken = "f337f242c205af3303b9cdb4edc3502e";
const FROM = "+13524538456";
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var initiated = false;
var client = new twilio(accountSid, authToken);

// const PORT = process.env.PORT ? process.env.PORT : 1337;

export function setupApi() {
	console.log("you have now run the API");

	app.get("/api", (req, res) => {
		res.send("hello there. this is the api");
	});

	app.post("/sms", urlencodedParser, (req, res) => {
		var twiml = new twilio.twiml.MessagingResponse();
		var body = req.body.Body.toLowerCase();

		if (body.includes("test")) {
			twiml.message("test '" + body + "' received.");
		} else if (body.includes("thanks")) {
			twiml.message("You are welcome!");
		} else {
			twiml.message("No Body param match :-(");
		}

		res.writeHead(200, { "Content-Type": "text/xml" });
		res.end(twiml.toString());
	});

	WebApp.connectHandlers.use(app);
	initiated = true;

	//
	//
	// keeping for reference
	// app.post("/sms", (req, res) => {
	// 	var twiml = new MessagingResponse();

	// 	twiml.message("second wave");

	// 	res.writeHead(200, { "Content-Type": "text/xml" });
	// 	res.end(twiml.toString());
	// });

	// http.createServer(app).listen(1337, () => {
	// 	console.log("Express server listening on port 1337");
	// });

	// app.listen(PORT, () => {
	// 	console.log("example app is now listenging on port :" + PORT);
	// });
}

export function sendSMS(msg, number) {
	if (!initiated) {
		setupApi();
	}

	if (!number || number.length != 10) {
		console.log("Number is an invalid format! Number: " + number);
		return;
	}

	// obviously, this will end up being the user's
	number = "+1" + number;
	console.log("sending SMS to: " + number);

	client.messages
		.create({
			body: msg,
			from: FROM,
			to: number
		})
		.then((message) => console.log(message.sid))
		.done();
}
