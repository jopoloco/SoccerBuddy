import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";

export const Teams = new Mongo.Collection("teams");

if (Meteor.isServer) {
	Meteor.publish("teams", function() {
		console.log("test: " + this.userId);
		return Teams.find({ members: this.userId });
	});
}
