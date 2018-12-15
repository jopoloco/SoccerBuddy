import { Meteor } from "meteor/meteor";
import SimpleSchema from "simpl-schema";
import { Accounts } from "meteor/accounts-base";

export const validateNewUser = (user) => {
	console.log("fName: " + user.fName);
	console.log("rollcall: " + user.isRollcall);
	console.log("rollclal is undefined: " + user.isRollcall == undefined);
	if (user.isRollcall) {
		return true;
	}

	const email = user.emails[0].address;
	new SimpleSchema({
		email: {
			type: String
			// regEx: SimpleSchema.RegEx.Email
		}
	}).validate({ email });

	return true;
};

if (Meteor.isServer) {
	// Accounts.validateNewUser(validateNewUser);
}
