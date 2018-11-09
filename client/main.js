import { Meteor } from "meteor/meteor";
// import React from "react";
import ReactDOM from "react-dom";
import { Session } from "meteor/session";
import { Tracker } from "meteor/tracker";

import { AppRouter, onAuthChange } from "../imports/routes/AppRouter";
import "../imports/startup/simple-schema-configuration";

// tracks authentication
Tracker.autorun(() => {
	const isAuthenticated = !!Meteor.userId();
	onAuthChange(isAuthenticated);
});

// tracks selected note
Tracker.autorun(() => {
	// update url when selected note changes
	var currentNote = Session.get("selectedSearchId");

	if (currentNote) {
		Session.set("isNavOpen", false);
		// history.replace(`/dashboard/${currentNote}`);
	}
});

// tracks navbar
Tracker.autorun(() => {
	// add/remove class to body
	var isNavOpen = Session.get("isNavOpen");

	if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
		document.addEventListener(
			"deviceready",
			onDeviceReady(isNavOpen),
			false
		);
	} else {
		onDeviceReady(isNavOpen);
	}
});

function onDeviceReady(isNavOpen) {
	document.body.classList.toggle("navOpen", isNavOpen);
}

// startup
Meteor.startup(() => {
	// Session.set('showVisible', true);
	console.log("meteor startup...");
	Session.set("selectedTeamId", undefined);
	Session.set("selectedTeamName", undefined);
	Session.set("isNavOpen", false);
	ReactDOM.render(AppRouter, document.getElementById("app"));
	console.log("trying to call twilio startup");
	Meteor.call("twilio.startup");
});
