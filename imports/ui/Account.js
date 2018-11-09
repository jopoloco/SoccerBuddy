import React from "react";
import { Meteor } from "meteor/meteor";
import { Link } from "react-router-dom";
// import PropTypes from "prop-types";
import { Accounts } from "meteor/accounts-base";
import { createContainer } from "meteor/react-meteor-data";

export class Account extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: ""
		};
		this.fNameRef = React.createRef();
		this.lNameRef = React.createRef();
		this.emailRef = React.createRef();
		this.oldPassRef = React.createRef();
		this.newPassRef = React.createRef();
		this.numRef = React.createRef();
	}

	componentDidMount() {
		var self = this;
		var userId = Meteor.userId();
		Meteor.call("users.findById", userId, function(err, user) {
			if (err) {
				alert(err);
			}

			if (user) {
				// self.setState({ userEmail: user.emails[0].address });
				self.fNameRef.current.value = user.fName ? user.fName : null;
				self.lNameRef.current.value = user.lName ? user.lName : null;
				self.emailRef.current.value =
					user.emails.length > 0 ? user.emails[0].address : null;
				self.numRef.current.value = user.phoneNumber
					? user.phoneNumber
					: null;
			}
		});
	}

	onSubmit(e) {
		e.preventDefault();
		this.setState({ error: "" });

		var self = this;
		var fName = this.fNameRef.current.value.trim();
		var lName = this.lNameRef.current.value.trim();
		var email = this.emailRef.current.value.trim();
		var oldPassword = this.oldPassRef.current.value.trim();
		var newPassword = this.newPassRef.current.value.trim();
		var phoneNumber = this.numRef.current.value.trim().replace(/\D/g, "");

		if (
			oldPassword != "" &&
			newPassword != "" &&
			(oldPassword.length < 9 || newPassword < 9)
		) {
			return this.setState({
				error: "Password length must be greater than 8 characters"
			});
		}

		if (phoneNumber != "" && phoneNumber.length != 10) {
			return this.setState({
				error: "Phone number must be 10 digits long"
			});
		}

		Meteor.call("users.findById", Meteor.userId(), function(err, user) {
			if (err) {
				alert(err);
			}

			if (user) {
				if (
					email != "" &&
					user.emails.length > 0 &&
					email != user.emails[0].address
				) {
					Meteor.call(
						"users.updateEmail",
						user._id,
						user.emails[0].address,
						email,
						(err, res) => {
							if (err) {
								self.setState({ error: err.reason });
							}
						}
					);
				}

				if (
					oldPassword != "" &&
					newPassword != "" &&
					oldPassword != newPassword
				) {
					Accounts.changePassword(
						oldPassword,
						newPassword,
						(err, res) => {
							if (err) {
								self.setState({ error: err.reason });
							}
						}
					);
				}

				Meteor.call(
					"users.updateInfo",
					user._id,
					fName,
					lName,
					phoneNumber,
					(err, res) => {
						if (err) {
							self.setState({ error: err.reason });
						}
					}
				);
			}
		});
	}

	render() {
		return (
			<div className="boxedView">
				<div className="boxedView_box">
					<h1>Account</h1>

					{this.state.error ? (
						<p id="errorP">{this.state.error}</p>
					) : (
						undefined
					)}

					<form
						className="boxedView_form"
						onSubmit={this.onSubmit.bind(this)}
						noValidate
					>
						<input
							className="boxview-form-input"
							type="text"
							ref={this.fNameRef}
							name="fName"
							placeholder="First Name"
						/>
						<input
							className="boxview-form-input"
							type="text"
							ref={this.lNameRef}
							name="lName"
							placeholder="Last Name"
						/>
						<input
							className="boxview-form-input"
							type="email"
							ref={this.emailRef}
							name="email"
							placeholder="Email"
						/>
						<input
							className="boxview-form-input"
							type="password"
							ref={this.oldPassRef}
							name="oldPassword"
							placeholder="Old Password"
						/>
						<input
							className="boxview-form-input"
							type="password"
							ref={this.newPassRef}
							name="newPassword"
							placeholder="New Password"
						/>
						<input
							className="boxview-form-input"
							type="tel"
							ref={this.numRef}
							name="phoneNumber"
							placeholder="555-555-5555"
						/>
						<button className="button">Update Account</button>
					</form>
					<Link to="/dashboard">
						Cancel changes and return to dashboard
					</Link>
				</div>
			</div>
		);
	}
}

Account.propTypes = {
	// updateUser: PropTypes.func.isRequired
};

export default createContainer(() => {
	return {};
}, Account);
