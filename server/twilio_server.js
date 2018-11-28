//
//
// keep for reference
const http = require("http"); // comment for debug
// const express = require("express");
// const MessagingResponse = require("twilio").twiml.MessagingResponse;
// const bodyParser = require("body-parser");
// var jsonParser = bodyParser.json(); // in case request is in json

// use
import { Meteor } from "meteor/meteor";
import { WebApp } from "meteor/webapp";
import express from "express";
import twilio from "twilio";
import bodyParser from "body-parser";

import { requestUpdate } from "./requestHelper";

// Your Account Sid and Auth Token from twilio.com/console
const accountSid = "ACe312f86d62e91bcec8a9b576c73c9a34";
const authToken = "f337f242c205af3303b9cdb4edc3502e";
const FROM = "+13524538456";
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var initiated = false;
var client = new twilio(accountSid, authToken);

const PORT = process.env.PORT ? process.env.PORT : 1337; // comment for debug
const YES = 0;
const NO = 1;
const MAYBE = 2;

export function setupApi() {
	console.log("you have now run the API");

	app.get("/api", (req, res) => {
		res.send("hello there. this is the api");
	});

	app.post("/sms", urlencodedParser, async (req, res) => {
		var body = req.body.Body.toLowerCase().trim();
		var reply = "";
		var attending = -1;
		var phoneNumber = req.body.From.replace("+1", "");

		if (body == "yes") {
			reply =
				"Thank you for your response! We look forward to seeing you!";
			attending = YES;
		} else if (body == "no") {
			reply = "Thank you for your response! We regret you can't make it.";
			attending = NO;
		} else if (body == "maybe") {
			reply = "Thank you for your response! We hope you can make it.";
			attending = MAYBE;
		}

		if (reply != "") {
			try {
				var result = await requestUpdate(phoneNumber, attending);

				if (result.err != "") {
					throw new Meteor.Error(
						"Error while updating request: " + result.err
					);
				}

				var twiml = new twilio.twiml.MessagingResponse();
				twiml.message(reply);
				res.writeHead(200, { "Content-Type": "text/xml" });
				res.end(twiml.toString());
			} catch (error) {
				console.log("error in try/catch: " + error);
			}
		}
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

	// uncomment this to run debug listener
	http.createServer(app).listen(1337, () => {
		console.log("Express server listening on port 1337");
	});

	app.listen(PORT, () => {
		console.log("example app is now listenging on port :" + PORT);
	});
	// comment to here
}

export async function sendSMS(msg, number) {
	if (!initiated) {
		setupApi();
	}

	if (!number || number.length != 10) {
		console.log("Number is an invalid format! Number: " + number);
		throw new Meteor.Error(
			"Number is an invalid format! Number: " + number
		);
	}

	number = "+1" + number;
	console.log("sending SMS to: " + number);

	try {
		var response = { result: true, details: undefined };

		await client.messages.create(
			{
				body: msg,
				from: FROM,
				to: number
			},
			function(err, res) {
				if (err) {
					console.log("oh no! " + err);
					response.result = false;
					response.details = err;

					console.log("result: " + response.result);
					console.log("details: " + response.details);
				} else if (res) {
					console.log(res.sid);
					response.result = true;
					response.details = res.sid;

					console.log("result: " + response.result);
					console.log("details: " + response.details);
				}
			}
		);

		return response;
	} catch (error) {
		console.log("try/catch error: " + error);
		return response;
	}
}
