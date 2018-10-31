// not being used!

import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";

export const AgendaJobs = new Mongo.Collection("agendaJobs");

if (Meteor.isServer) {
	Meteor.publish("agendaJobs", function() {
		return AgendaJobs.find({});
	});
}
