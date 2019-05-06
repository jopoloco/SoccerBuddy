import { Meteor } from "meteor/meteor";
import { Teams } from "../imports/api/teams";
import { Events } from "../imports/api/events";
import { Requests } from "../imports/api/requests";
import SimpleSchema from "simpl-schema";

const YES = 0;
const NO = 1;
const MAYBE = 2;

export async function requestUpdate(phoneNumber, attending) {
	var result = { err: "", res: "" };
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

	try {
		var request = await Requests.rawCollection().findOne({
			phoneNumber: phoneNumber
		});

		if (!request) {
			result.err = "Request not found!";
			return result;
		}

		var user = await Meteor.users
			.rawCollection()
			.findOne({ phoneNumber: request.phoneNumber });
		if (!user) {
			result.err = "A user with that phone number could not be located.";
			return result;
		}

		var event = await Events.rawCollection().findOne({
			_id: request.eventId
		});
		if (!event) {
			result.err = "A game with that id could not be located.";
			return result;
		}

		var team = await Teams.rawCollection().findOne({ _id: event.teamId });
		if (!team) {
			result.err = "An associated team could not be located.";
			return result;
		}

		if (!team.members.includes(user._id)) {
			result.err = "User is not a member of the associated team!";
			return result;
		}

		if (
			(await Requests.rawCollection().remove({
				phoneNumber: phoneNumber
			})) <= 0
		) {
			result.err = "Failed to remove old requests.";
			return result;
		}

		result.res = await Events.rawCollection().update(
			{ _id: event._id },
			{
				$pull: {
					rollCall: { user: user._id }
				}
			}
		);

		if (result.res <= 0) {
			result.err = "Failed to remove old attendance.";
			return result;
		}

		result.res += await Events.rawCollection().update(
			{ _id: event._id },
			{
				$push: {
					rollCall: { user: user._id, attending: attending }
				}
			}
		);

		if (result.res <= 1) {
			result.err = "Failed to add new attendance.";
			return result;
		} else {
			// should be a success. notify coach
			var attendString =
				attending == YES
					? " is now attending "
					: attending == NO
						? " is not attending "
						: " might attend ";
			// update text here. attending is just a number. need to contextualize.
			var msg =
				"Reservation has been updated: " +
				user.fName +
				" " +
				user.lName +
				attendString +
				event.title +
				" on " +
				event.date;

			console.log(msg);
			var sms = true;
			if (sms) {
				// send sms
				Meteor.call("sms.send", msg, phoneNumber, function(err, res) {
					if (err) {
						alert(err);
					}
					if (res) {
						console.log("sms success!");
					}
				});
			} else {
				// send email
			}
		}
	} catch (error) {
		result.err = error;
		return result;
	}

	return result;
}
