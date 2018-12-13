import { Meteor } from "meteor/meteor";
import React from "react";
import { Session } from "meteor/session";
import PropTypes from "prop-types";
import Select from "react-select";
import { createContainer } from "meteor/react-meteor-data";

import { Teams } from "../api/teams";

import { AddBox, Cancel, Delete, NoteAdd } from "@material-ui/icons";
import { IconButton, Grid, Modal, TextField } from "@material-ui/core";

export class AddMemberModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalOpen: this.props.isOpen,
			searchName: "",
			createName: "",
			existingTeamId: "",
			selectedTeam: ""
		};
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.modalOpen != this.props.isOpen) {
			this.setState({ modalOpen: this.props.isOpen });
		}
	}

	handleModalClose = () => {
		this.setState({
			modalOpen: false
		});
		this.props.callback();
	};

	handleCreateChange = (e) => {
		var title = e.target.value;
		this.setState({ createName: title });
	};

	handleTeamChange = (selectedTeam) => {
		this.setState({
			existingTeamId: selectedTeam.value,
			selectedTeam: selectedTeam
		});
		console.log("Option selected: " + selectedTeam.label);
	};

	addExistingTeam = () => {
		// pull team id off of list
		var teamId = this.state.existingTeamId;

		// call method to request team
		Meteor.call("teams.request", teamId, (err, res) => {
			if (err) {
				err = "Could not send team request: " + err;
				console.log(err);
				alert(err);
			}
			if (res) {
				// clear entry
				this.setState({ existingTeamId: "", selectedTeam: "" });
			}
		});
	};

	addNewTeam = () => {
		// grab team name
		var teamName = this.state.createName;

		// create new team
		Meteor.call("teams.insert", teamName, (err, res) => {
			if (err) {
				err = "Could not create team: " + err;
				console.log(err);
				alert(err);
			}
			if (res) {
				// set new team to selected team
				Session.set("selectedTeamId", res);
				Session.set("selectedTeamTitle", teamName);
				this.handleModalClose();
			}
		});
	};

	render() {
		var TeamModal = (
			<Modal onClose={this.handleModalClose} open={this.state.modalOpen}>
				<div className="addMember-modal-div">
					<div className="createTeam-div">
						<span className="addTeam-title">
							Add someone to roll call:
						</span>
						<div className="existingTeam-div-sub">
							<TextField
								id="createName"
								label="Team Name"
								className="existingTeam-searchName addTeamItem"
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
								value={this.state.createName}
								onChange={this.handleCreateChange}
								margin="normal"
							/>
							<IconButton
								onClick={this.addNewTeam}
								className="addTeamItem-button"
								classes={{
									label: "addTeam-modal-button-label"
								}}
							>
								<AddBox />
							</IconButton>
						</div>
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
