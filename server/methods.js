import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { Teams } from "../imports/api/teams";
import { Games } from "../imports/api/games";
import { UpdateSearchResults, PerformSearch } from "./searchHelper";
import moment from "moment";
import SimpleSchema from "simpl-schema";
import { CancelAgendaJob, AddAgendaJob } from "./agenda";
import { setupApi } from "./twilio_server";

const YES = 0;
const NO = 1;
const MAYBE = 2;

Meteor.methods({
	greet() {
		console.log("Hello server! main");
		Meteor._sleepForMs(5);
		return "hello server! return";
	},
	"teams.insert"(teamTitle) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}

		new SimpleSchema({
			teamTitle: {
				type: String,
				min: 1
			}
		}).validate({ teamTitle });

		// team schema
		var teamId = Teams.insert({
			coachId: this.userId,
			title: teamTitle,
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

		return Teams.update(
			{ _id },
			{
				$push: {
					requests: this.userId
				}
			}
		);
	},
	"teams.request.approve"(user, team) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}

		new SimpleSchema({
			user: {
				type: String,
				min: 1
			},
			team: {
				type: String,
				min: 1
			}
		}).validate({ user, team });

		var teamInstance = Teams.findOne({ _id: team });

		if (!teamInstance) {
			throw new Meteor.Error("team not found");
		}

		if (teamInstance.members.includes(user)) {
			throw new Meteor.Error("User is already a member of this team");
		}

		if (!teamInstance.requests.includes(user)) {
			throw new Meteor.Error(
				"User has not requested membership to this team"
			);
		}

		return Teams.update(
			{ _id: team },
			{
				$push: {
					members: user
				},
				$pull: {
					requests: user
				}
			}
		);
	},
	"teams.request.reject"(user, team) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}

		new SimpleSchema({
			user: {
				type: String,
				min: 1
			},
			team: {
				type: String,
				min: 1
			}
		}).validate({ user, team });

		var teamInstance = Teams.findOne({ _id: team });

		if (!teamInstance) {
			throw new Meteor.Error("team not found");
		}

		if (!teamInstance.requests.includes(user)) {
			throw new Meteor.Error(
				"User has not requested membership to this team"
			);
		}

		return Teams.update(
			{ _id: team },
			{
				$pull: {
					requests: user
				}
			}
		);
	},
	"teams.member.remove"(user, team) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}

		new SimpleSchema({
			user: {
				type: String,
				min: 1
			},
			team: {
				type: String,
				min: 1
			}
		}).validate({ user, team });

		var teamInstance = Teams.findOne({ _id: team });

		if (!teamInstance) {
			throw new Meteor.Error("team not found");
		}

		if (!teamInstance.members.includes(user)) {
			throw new Meteor.Error("User is not a member of this team");
		}

		if (teamInstance.coachId == user) {
			throw new Meteor.Error("Cannot remove coach from team");
		}

		return Teams.update(
			{ _id: team },
			{
				$pull: {
					members: user
				}
			}
		);
	},
	"teams.toggleCoach"(user, team, isCoach) {
		throw new Meteor.Error("not implement yet");
	},
	"games.insert"(teamId, title, date, type) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}

		var team = Teams.findOne({ _id: teamId });
		if (!team) {
			throw new Meteor.Error("team not found");
		}

		// game schema
		var gameId = Games.insert({
			date: date,
			teamId: teamId,
			opponent: "unnamed",
			title: title,
			type: type,
			coachId: team.coachId,
			rollCall: []
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

		return Teams.remove({ _id, coachId: this.userId });
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

		return Games.remove({ _id, coachId: this.userId });
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
			title: {
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
	"games.update"(_id, coachId, updates) {
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
			},
			type: {
				type: String,
				optional: true
			},
			title: {
				type: String,
				optional: true
			}
		}).validate({
			_id,
			...updates
		});

		return Games.update(
			{ _id, coachId },
			{
				$set: {
					...updates
				}
			}
		);
	},
	"games.rsvp"(_id, userId, attending) {
		new SimpleSchema({
			_id: {
				type: String,
				min: 1
			},
			userId: {
				type: String,
				min: 1
			},
			attending: {
				type: SimpleSchema.Integer,
				allowedValues: [YES, NO, MAYBE] // yes, no, maybe
			}
		}).validate({
			_id,
			userId,
			attending
		});

		var ret = Games.update(
			{ _id },
			{
				$pull: {
					rollCall: { user: userId }
				}
			}
		);

		return (
			ret +
			Games.update(
				{ _id },
				{
					$push: {
						rollCall: { user: userId, attending: attending }
					}
				}
			)
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
