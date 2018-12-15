import { Meteor } from "meteor/meteor";
import React from "react";
import { Session } from "meteor/session";
import PropTypes from "prop-types";
import Select from "react-select";
import { createContainer } from "meteor/react-meteor-data";

import { Teams } from "../api/teams";

import { AddBox, Cancel, Delete, NoteAdd } from "@material-ui/icons";
import { Button, Grid, Modal, TextField } from "@material-ui/core";

export class AddMemberModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalOpen: this.props.isOpen,
			error: "",
			fName: "",
			lName: "",
			phoneNumber: "",
			disabled: true
		};
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.modalOpen != this.props.isOpen) {
			this.setState({
				modalOpen: this.props.isOpen,
				error: "",
				fName: "",
				lName: "",
				phoneNumber: "",
				disabled: true
			});
		}
	}

	handleModalClose = () => {
		this.setState({
			modalOpen: false
		});
		this.props.callback();
	};

	handleChange = (name) => (event) => {
		this.setState(
			{
				[name]: event.target.value
			},
			this.updateDisabled
		);
	};

	updateDisabled = () => {
		var shouldBe = true;
		var { fName, lName, phoneNumber, disabled } = this.state;
		if (fName && lName && phoneNumber) {
			shouldBe = false;
		}

		if (disabled != shouldBe) {
			this.setState({ disabled: shouldBe });
		}
	};

	addUser = () => {
		// pull variables off state
		var { fName, lName, phoneNumber } = this.state;
		var self = this;

		// validate phoneNumber
		phoneNumber = phoneNumber.trim().replace(/\D/g, "");
		if (phoneNumber.length < 10) {
			return this.setState({
				error: "Phone number must be 10 digits long"
			});
		}

		// call method to request team
		Meteor.call(
			"users.createRollcallUser",
			fName,
			lName,
			phoneNumber,
			(err, res) => {
				if (err) {
					err = "Could not add Rollcall user: " + err;
					console.log(err);
					this.setState({ error: err });
				}
				if (res) {
					// clear error
					this.setState({ error: "" });

					// add new user to team
					Meteor.call(
						"teams.member.insert",
						res,
						Session.get("selectedTeamId"),
						(err, res) => {
							if (err) {
								err = "Could not add new user to team: " + err;
								console.log(err);
								this.setState({ error: err });
							}
							if (res) {
								// close modal
								self.handleModalClose();
							}
						}
					);
				}
			}
		);
	};

	render() {
		var TeamModal = (
			<Modal onClose={this.handleModalClose} open={this.state.modalOpen}>
				<div className="addMember-modal-div">
					<span className="addMember-title">
						Add someone to roll call:
					</span>

					{this.state.error ? (
						<p id="errorP">{this.state.error}</p>
					) : (
						undefined
					)}

					<div className="addMember-memberInfo-div">
						<TextField
							id="firstName"
							label="First Name"
							className="addMember-memberInfo-field"
							variant="outlined"
							InputLabelProps={{
								classes: {
									root: "existingTeam-input-label"
								}
							}}
							InputProps={{
								classes: {
									input: "existingTeam-input-field"
								}
							}}
							value={this.state.fName}
							onChange={this.handleChange("fName")}
							margin="normal"
						/>
						<TextField
							id="lastName"
							label="Last Name"
							className="addMember-memberInfo-field"
							variant="outlined"
							InputLabelProps={{
								classes: {
									root: "existingTeam-input-label"
								}
							}}
							InputProps={{
								classes: {
									input: "existingTeam-input-field"
								}
							}}
							value={this.state.lName}
							onChange={this.handleChange("lName")}
							margin="normal"
						/>
						<TextField
							id="phoneNumber"
							label="Phone Number"
							className="addMember-memberInfo-field"
							variant="outlined"
							InputLabelProps={{
								classes: {
									root: "existingTeam-input-label"
								}
							}}
							InputProps={{
								classes: {
									input: "existingTeam-input-field"
								}
							}}
							value={this.state.phoneNumber}
							onChange={this.handleChange("phoneNumber")}
							margin="normal"
						/>
						<Button
							onClick={this.addUser}
							className="addMember-button"
							classes={{
								label: "addMember-button-label"
							}}
							disabled={this.state.disabled}
						>
							Add User
						</Button>
					</div>
				</div>
			</Modal>
		);

		return <div>{TeamModal}</div>;
	}
}

AddMemberModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	callback: PropTypes.func.isRequired
};

export default createContainer(() => {
	return {};
}, AddMemberModal);
