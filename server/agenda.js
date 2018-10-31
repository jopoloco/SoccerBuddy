// import { Agenda } from "./agenda";
import moment from "moment";
import { Meteor } from "meteor/meteor";

import { PerformSearch, UpdateSearchResults } from "./searchHelper";

console.log("im beginning");

var Agenda = require("agenda");

console.log("creating agenda");
var agenda = new Agenda();

console.log("setting database");
// agenda.database("localhost:3001/meteor", "agendaJobs");
agenda.database(
	"mongodb://heroku_136rm0wj:lrnupb8i8rj9t2pdcsson1vb3j@ds131963.mlab.com:31963/heroku_136rm0wj",
	"agendaJobs"
);
agenda.defaultLockLifetime(600000); // 10 minutes

console.log("defining job");
agenda.define("console log", (job, done) => {
	console.log(moment().valueOf());
	done();
});

// agenda.define("cancel", (job, done) => {
// 	console.log("YOU SHOULD NOT SEE THIS");
// 	done();
// });

// agenda.define("gamma", (job, done) => {
// 	console.log("=================== original");
// 	done();
// });

agenda.define("purge", (job, done) => {
	console.log("PURGING===============================================");
	agenda.purge((err, numRemoved) => {
		// ...
		console.log(
			"REMOVED: " +
				numRemoved +
				"=============================================="
		);
	});
	done();
});

function log(msg) {
	console.log(msg);
}

async function startBaselineJobs() {
	console.log("in start");
	await agenda._ready;
	agenda.every("10 minutes", "console log");
	agenda.every("1 hours", "purge");
	// agenda.every("1 seconds", "cancel");
	// agenda.every("1 seconds", "gamma");

	console.log("redifining all");
	var jobs = await agenda.jobs({ name: { $regex: /^poll/ } });
	log("matches: " + jobs.length);

	for (var i = 0; i < jobs.length; i++) {
		var jobName = jobs[i].attrs.name;
		var searchId = getSearchId(jobName);

		defineJob(jobName, searchId);
	}

	agenda.start();
}

// leaving this to demonstrate how to reset and cancel properly;
// async function updateBaseline() {
// 	console.log("in update");
// 	agenda.cancel({ name: "cancel" }, (err, numRemoved) => {
// 		console.log("--------------------------------------cancel complete");
// 	});

// 	agenda.define("gamma", (job, done) => {
// 		console.log("=-=-=-=-=-=-=-=-=-=-=-=-=- updated!");
// 		done();
// 	});
// }

async function startup() {
	console.log("starting base");
	await startBaselineJobs();

	// await new Promise((resolve) => setTimeout(resolve, 5000));

	// console.log("updating base");
	// await updateBaseline();
}

function defineJob(jobName, searchId) {
	console.log("Generating job for: " + jobName);

	agenda.define(jobName, async (job, done) => {
		console.log("running: " + jobName);

		var res = await PerformSearch(searchId, true).catch((error) => {
			// console.log(error);
			console.log("ERROR");
			done();
		});
		var items = [];

		console.log("back from performing search");

		if (res) {
			if (res.error) {
				console.log("throwing error!: " + res.error);
				// throw new Meteor.Error(res.error);
			} else {
				console.log("no error!");
			}

			if (res.results) {
				if (res.results.length > 0) {
					console.log("got results!: " + res.results.length);
					items = res.results;
				} else {
					console.log("no results :-(");
				}
			} else {
				console.log("results object doesn't exist");
			}

			await UpdateSearchResults(searchId, items);
		}

		done();
	});
}

function getPollName(searchId) {
	return "poll_" + searchId;
}

function getSearchId(jobName) {
	var res = jobName.split("poll_");
	return res[1];
}

export function GenerateAgendaJob(searchId) {
	var jobName = getPollName(searchId);
	defineJob(jobName, searchId);
}

export async function AddAgendaJob(searchId) {
	var jobName = getPollName(searchId);
	var frequency = "1 hours"; // get this from the query?;
	console.log("Creating job for: " + jobName);

	GenerateAgendaJob(searchId);
	agenda.every(frequency, jobName);
}

export async function CancelAgendaJob(searchId) {
	var job = getPollName(searchId);
	console.log("cancelling agenda job: " + job);
	agenda.cancel({ name: job }, (err, numRemoved) => {
		// ...
	});
}

console.log("starting baseline jobs...");
startup();
console.log("I'm done");
