import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { Teams } from "../imports/api/teams";
import { Games } from "../imports/api/games";
import { Requests } from "../imports/api/requests";
import { UpdateSearchResults, PerformSearch } from "./searchHelper";
import moment from "moment";
import SimpleSchema from "simpl-schema";
import { CancelAgendaJob, AddAgendaJob } from "./agenda";
import { setupApi, sendSMS } from "./twilio_server";

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
	"users.createRollcallUser"(fName, lName, phoneNumber) {
		new SimpleSchema({
			fName: {
				type: String,
				min: 1
			},
			lName: {
				type: String,
				min: 1
			},
			phoneNumber: {
				type: String,
				// regEx: SimpleSchema.RegEx.Phone,
				min: 10
			}
		}).validate({
			fName,
			lName,
			phoneNumber
		});

		// ensure this phone number is not being used
		var existingUser = Meteor.users.findOne({ phoneNumber: phoneNumber });
		if (existingUser) {
			throw new Meteor.Error(
				"This phone number is already in use by a user"
			);
		}

		Meteor.users.insert(userId, {
			$set: {
				phoneNumber: phoneNumber,
				fName: fName,
				lName: lName
			}
		});
	},
	"users.findUsersById"(users) {
		return users.map((u, i) => {
			var user = Meteor.users.findOne({ _id: u });
			if (!user) {
				throw new Meteor.Error("No user found!");
			}

			return user;
		});
	},
	"users.updateEmail"(userId, oldEmail, newEmail) {
		Accounts.addEmail(userId, newEmail);
		Accounts.removeEmail(userId, oldEmail);
	},
	"users.updateInfo"(userId, fName, lName, phoneNumber) {
		new SimpleSchema({
			fName: {
				type: String,
				min: 1
			},
			lName: {
				type: String,
				min: 1
			},
			userId: {
				type: String,
				min: 1
			},
			phoneNumber: {
				type: String,
				// regEx: SimpleSchema.RegEx.Phone,
				min: 10
			}
		}).validate({
			fName,
			lName,
			userId,
			phoneNumber
		});

		// ensure this phone number is not being used
		var existingUser = Meteor.users.findOne({ phoneNumber: phoneNumber });
		if (existingUser) {
			throw new Meteor.Error(
				"This phone number is already in use by a user"
			);
		}

		Meteor.users.update(userId, {
			$set: {
				phoneNumber: phoneNumber,
				fName: fName,
				lName: lName
			}
		});
	},
	"users.findByPhoneNumber"(phoneNumber) {
		var user = Meteor.users.findOne({ phoneNumber: phoneNumber });
		if (!user) {
			throw new Meteor.Error("No user found!");
		}

		return user;
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
	"requests.insert"(phoneNumber, eventId) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}

		new SimpleSchema({
			phoneNumber: {
				type: String,
				// regEx: SimpleSchema.RegEx.Phone,
				min: 10
			},
			eventId: {
				type: String,
				min: 1
			}
		}).validate({ phoneNumber, eventId });

		// request schema
		var requestId = Requests.insert({
			phoneNumber: phoneNumber,
			eventId: eventId
		});

		return requestId;
	},
	"requests.update"(phoneNumber, attending) {
		new SimpleSchema({
			phoneNumber: {
				type: String,
				// regEx: SimpleSchema.RegEx.Phone,
				min: 10
			},
			attending: {
				type: SimpleSchema.Integer,
				allowedValues: [YES, NO, MAYBE] // yes, no, maybe
			}
		}).validate({
			phoneNumber,
			attending
		});

		var request = Requests.findOne({ phoneNumber: phoneNumber });
		if (!request) {
			throw new Meteor.Error("Request not found!");
		}

		var user = Meteor.users.findOne({ phoneNumber: request.phoneNumber });
		if (!user) {
			throw new Meteor.Error(
				"A user with that phone number could not be located."
			);
		}

		var event = Games.findOne({ _id: request.eventId });
		if (!event) {
			throw new Meteor.Error("A game with that id could not be located.");
		}

		var team = Teams.findOne({ _id: event.teamId });
		if (!team) {
			throw new Meteor.Error("An associated team could not be located.");
		}

		if (!team.members.include(user._id)) {
			throw new Meteor.Error(
				"User is not a member of the associated team!"
			);
		}

		Requests.remove({ phoneNumber: phoneNumber });

		var ret = Games.update(
			{ _id: event._id },
			{
				$pull: {
					rollCall: { user: user._id }
				}
			}
		);

		return (
			ret +
			Games.update(
				{ _id: event._id },
				{
					$push: {
						rollCall: { user: user._id, attending: attending }
					}
				}
			)
		);
	},
	"requests.update.sync"(phoneNumber, attending) {
		var result = Meteor.makeSync("requests.update")(phoneNumber, attending);
		if (result.error === null) {
			return result.data;
		} else {
			throw new Meteor.Error(result.error.response.statusCode, "error!");
		}
	},
	"twilio.startup"() {
		console.log("running twilio startup");
		setupApi();
	},
	async "sms.send"(msg, number) {
		var response = await sendSMS(msg, number);

		if (response.result) {
			return { phoneNumber: number, response: response.details };
		} else {
			throw new Meteor.Error("Failed to send SMS: " + response.details);
		}
	},
	"email.send"(msg, email) {
		throw new Meteor.Error("Not implemented yet!");
	}
});

Meteor.makeSync = function(fn, context) {
	return function(/* arguments */) {
		var self = context || this;
		var newArgs = _.toArray(arguments);
		var callback;

		for (var i = newArgs.length - 1; i >= 0; --i) {
			var arg = newArgs[i];
			var type = typeof arg;
			if (type !== "undefined") {
				if (type === "function") {
					callback = arg;
				}
				break;
			}
		}

		if (!callback) {
			var fut = new Future();
			callback = function(error, data) {
				fut.return({ error: error, data: data });
			};

			++i;
		}

		newArgs[i] = Meteor.bindEnvironment(callback);
		var result = fn.apply(self, newArgs);
		return fut ? fut.wait() : result;
	};
};
