import React from "react";
import { Meteor } from "meteor/meteor";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Accounts } from "meteor/accounts-base";
import { createContainer } from "meteor/react-meteor-data";

export class Signup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: ""
		};
		this.fNameRef = React.createRef();
		this.lNameRef = React.createRef();
		this.emailRef = React.createRef();
		this.passRef = React.createRef();
		this.numRef = React.createRef();
	}

	onSubmit(e) {
		e.preventDefault();

		var fName = this.fNameRef.current.value.trim();
		var lName = this.lNameRef.current.value.trim();
		var email = this.emailRef.current.value.trim();
		var password = this.passRef.current.value.trim();
		var phoneNumber = this.numRef.current.value.trim().replace(/\D/g, "");

		if (password.length < 9) {
			return this.setState({
				error: "Password length must be greater than 8 characters"
			});
		}

		if (phoneNumber.length < 10) {
			return this.setState({
				error: "Phone number must be 10 digits long"
			});
		}

		this.props.createUser({ email, password }, (err) => {
			if (err) {
				this.setState({ error: err.reason });
			} else {
				this.setState({ error: "" });
				var userId = Meteor.userId();
				Meteor.call(
					"users.updateInfo",
					userId,
					fName,
					lName,
					phoneNumber,
					(err) => {
						if (err) {
							this.setState({ error: err.error });
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
					<h1>Join</h1>

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
							type="fName"
							ref={this.fNameRef}
							name="fName"
							placeholder="First Name"
						/>
						<input
							className="boxview-form-input"
							type="lName"
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
							ref={this.passRef}
							name="password"
							placeholder="Password"
						/>
						<input
							className="boxview-form-input"
							type="tel"
							ref={this.numRef}
							name="phoneNumber"
							placeholder="555-555-5555"
						/>
						<button className="button">Create Account</button>
					</form>
					<Link to="/">Already have an account?</Link>
				</div>
			</div>
		);
	}
}

Signup.propTypes = {
	createUser: PropTypes.func.isRequired
};

export default createContainer(() => {
	return {
		createUser: Accounts.createUser
	};
}, Signup);
