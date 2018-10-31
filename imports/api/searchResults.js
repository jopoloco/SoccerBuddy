import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";

export const SearchResults = new Mongo.Collection("searchResults");

if (Meteor.isServer) {
	Meteor.publish("searchResults", function() {
		return SearchResults.find({ userId: this.userId });
	});
}
