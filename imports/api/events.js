import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";

export const Events = new Mongo.Collection("events");

if (Meteor.isServer) {
	Meteor.publish("events", function() {
		return Events.find({});
	});
}
