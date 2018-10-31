import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";

export const Searches = new Mongo.Collection("searches");

if (Meteor.isServer) {
	Meteor.publish("searches", function() {
		return Searches.find({ userId: this.userId });
	});
}
