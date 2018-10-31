import { Meteor } from "meteor/meteor";

Meteor.methods({
	greet() {
		console.log("Hello client! main");
		return "hello client! return";
	},
	"search.compile"(_id) {
		return "running on client";
	}
});
