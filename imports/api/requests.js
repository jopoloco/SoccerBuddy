import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";

export const Requests = new Mongo.Collection("requests");

if (Meteor.isServer) {
	Meteor.publish("requests", function() {
		return Requests.find({});
	});
}
