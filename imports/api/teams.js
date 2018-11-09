import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";

export const Teams = new Mongo.Collection("teams");

if (Meteor.isServer) {
	Meteor.publish("teams", function() {
		return Teams.find({});
	});
}
