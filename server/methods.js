import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { Teams } from "../imports/api/teams";
import { Games } from "../imports/api/games";
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
	"teams.insert"(teamName) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}

		new SimpleSchema({
			teamName: {
				type: String,
				min: 1
			}
		}).validate({ teamName });

		// team schema
		var teamId = Teams.insert({
			coachId: this.userId,
			name: teamName,
			members: [this.userId],
			games: [],
			requests: []
		});

		return teamId;
	},
	"teams.request"(_id) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}

		new SimpleSchema({
			_id: {
				type: String,
				min: 1
			}
		}).validate({ _id });

		var team = Teams.findOne({ _id });

		if (!team) {
			throw new Meteor.Error("team not found");
		}

		if (team.members.includes(this.userId)) {
			throw new Meteor.Error("already a member of this team");
		}

		Teams.update(
			{ _id },
			{
				$push: {
					requests: this.userId
				}
			}
		);
	},
	"games.insert"(teamId) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}

		var team = Teams.findOne({ _id: teamId });
		if (!team) {
			throw new Meteor.Error("team not found");
		}

		// game schema
		var gameId = Games.insert({
			date: moment().valueOf().date,
			teamId: teamId,
			opponent: "unnamed",
			coachId: team.coachId
		});

		return gameId;
	},
	"teams.remove"(_id) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}

		new SimpleSchema({
			_id: {
				type: String,
				min: 1
			}
		}).validate({ _id });

		Teams.remove({ _id, coachId: this.userId });
	},
	"games.remove"(_id) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}

		new SimpleSchema({
			_id: {
				type: String,
				min: 1
			}
		}).validate({ _id });

		Games.remove({ _id, coachId: this.userId });
	},
	// async "teams.update"(teamId, items) {
	// 	throw new Meteor.Error("not implemented yet");
	// 	await UpdateSearchResults(teamId, items);
	// },
	"teams.update"(_id, updates) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}

		new SimpleSchema({
			_id: {
				type: String,
				min: 1,
				optional: false
			},
			coachId: {
				type: String,
				optional: true
			},
			name: {
				type: String,
				optional: true
			}
			// members: {
			// 	type: Array,
			// 	optional: true
			// },
			// games: {
			// 	type: Array,
			// 	optional: true
			// },
			// requests: {
			// 	type: Array,
			// 	optional: true
			// },
		}).validate({
			_id,
			...updates
		});

		return Teams.update(
			{ _id, coachId: this.userId },
			{
				$set: {
					...updates
				}
			}
		);
	},
	"games.update"(_id, updates) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}

		new SimpleSchema({
			_id: {
				type: String,
				min: 1,
				optional: false
			},
			teamId: {
				type: String,
				optional: true
			},
			opponent: {
				type: String,
				optional: true
			},
			coachId: {
				type: String,
				optional: true
			},
			date: {
				type: String,
				optional: true
			}
		}).validate({
			_id,
			...updates
		});

		Games.update(
			{ _id, coachId: this.userId },
			{
				$set: {
					...updates
				}
			}
		);
	},
	async "games.compile"(searchId) {
		throw new Meteor.Error("not implement yet");
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
