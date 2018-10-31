import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { Searches } from "../imports/api/searches";
import { SearchResults } from "../imports/api/searchResults";
import { UpdateSearchResults, PerformSearch } from "./searchHelper";
import moment from "moment";
import SimpleSchema from "simpl-schema";
import { CancelAgendaJob, AddAgendaJob } from "./agenda";
import { setupApi } from "./twilio_server";

Meteor.methods({
	greet() {
		console.log("Hello server! main");
		Meteor._sleepForMs(5);
		return "hello server! return";
	},
	"searchResults.insert"(searchId) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}

		// results schema
		var resultsId = SearchResults.insert({
			userId: this.userId,
			searchId: searchId
		});

		return resultsId;
	},
	"searches.insert"(projectId) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}

		// search schema
		var searchId = Searches.insert({
			title: "",
			userId: this.userId,
			price: "500",
			auction: true,
			auctionBIN: true,
			fixedPrice: true
		});

		return searchId;
	},
	"searchResults.remove"(searchId) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}

		new SimpleSchema({
			searchId: {
				type: String,
				min: 1
			}
		}).validate({ searchId });

		SearchResults.remove({ searchId, userId: this.userId });
	},
	"searches.remove"(_id) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}

		new SimpleSchema({
			_id: {
				type: String,
				min: 1
			}
		}).validate({ _id });

		Searches.remove({ _id, userId: this.userId });
	},
	async "searchResults.update"(searchId, items) {
		await UpdateSearchResults(searchId, items);
	},
	"searchResults.clear"(searchId) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}

		new SimpleSchema({
			searchId: {
				type: String,
				min: 1
			}
		}).validate({ searchId });

		SearchResults.update(
			{ searchId, userId: this.userId },
			{ $set: { items: [] } }
		);
	},
	"searches.update"(_id, updates) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}

		new SimpleSchema({
			_id: {
				type: String,
				min: 1,
				optional: false
			},
			title: {
				type: String,
				optional: true
			},
			price: {
				type: String,
				optional: true
			},
			auction: {
				type: Boolean,
				optional: true
			},
			fixedPrice: {
				type: Boolean,
				optional: true
			},
			auctionBIN: {
				type: Boolean,
				optional: true
			}
		}).validate({
			_id,
			...updates
		});

		Searches.update(
			{ _id, userId: this.userId },
			{
				$set: {
					updatedAt: moment().valueOf(),
					...updates
				}
			}
		);
	},
	async "search.compile"(searchId) {
		return await PerformSearch(searchId, false);
	},
	"users.findById"(userId) {
		var user = Meteor.users.findOne({ _id: userId });
		if (!user) {
			throw new Meteor.Error("No user found!");
		}

		return user;
	},
	"users.updateEmail"(userId, oldEmail, newEmail) {
		Accounts.addEmail(userId, newEmail);
		Accounts.removeEmail(userId, oldEmail);
	},
	"users.updateInfo"(userId, fName, lName, phoneNumber) {
		Meteor.users.update(userId, {
			$set: {
				phoneNumber: phoneNumber,
				fName: fName,
				lName: lName
			}
		});
	},
	"agenda.add"(searchId) {
		// AddAgendaJob(searchId);
	},
	"agenda.update"(searchId) {
		// GenerateAgendaJob(searchId);
		AddAgendaJob(searchId);
	},
	"agenda.cancel"(searchId) {
		CancelAgendaJob(searchId);
	},
	"twilio.startup"() {
		console.log("running twilio startup");
		setupApi();
	}
});
