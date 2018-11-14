import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";

export const Games = new Mongo.Collection("games");

if (Meteor.isServer) {
	Meteor.publish("games", function() {
		return Games.find({});
	});
}
