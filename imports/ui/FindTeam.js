import { Meteor } from "meteor/meteor";
import React from "react";
import { Session } from "meteor/session";
import PropTypes from "prop-types";
import Select from "react-select";
import { createContainer } from "meteor/react-meteor-data";

import { Teams } from "../api/teams";

import { AddBox, Cancel, Delete, NoteAdd } from "@material-ui/icons";
import { IconButton, Grid, Modal, TextField } from "@material-ui/core";

import SuccessMessage from "./SuccessMessage";

const styles = {
	customStyles: {
		option: (provided, state) => ({
			...provided,
			color: state.isSelected ? "#f5be41" : "#333333",
			backgroundColor: state.isSelected
				? "#258039"
				: state.isFocused
					? "#31a9b8"
					: null
		}),
		control: (provided, state) => ({
			// none of react-select's styles are passed to <Control />
			...provided,
			boxShadow: state.isFocused
				? "0 0 0 1px #333333"
				: "0 0 0 1px #aaaaaa",
			border: "none"
		})
		// singleValue: (provided, state) => {
		// 	const opacity = state.isDisabled ? 0.5 : 1;
		// 	const transition = "opacity 300ms";

		// 	return { ...provided, opacity, transition };
		// }
	}
};

export class FindTeam extends React.Component {
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

	handleSearchChange = (e) => {
		var title = e.target.value;
		this.setState({ searchName: title });
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

				// set success message
				SuccessMessage.triggerMessage();
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
		// generate options:
		var options = this.props.teams.map((team, i) => {
			return { value: team._id, label: team.title };
		});

		var TeamModal = (
			<Modal onClose={this.handleModalClose} open={this.state.modalOpen}>
				<div className="addTeam-modal-div">
					<div className="existingTeam-div">
						<span className="addTeam-title">
							Add an existing team:
						</span>
						<div className="existingTeam-div-sub">
							<Select
								value={this.state.selectedTeam}
								onChange={this.handleTeamChange}
								options={options}
								className="teamSearch"
								placeholder="Team Name..."
								styles={styles.customStyles}
							/>
							<IconButton
								onClick={this.addExistingTeam}
								className="addTeamItem-button"
								classes={{
									label: "addTeam-modal-button-label"
								}}
							>
								<AddBox />
							</IconButton>
						</div>
					</div>

					<div className="createTeam-div">
						<span className="addTeam-title">Create a team:</span>
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
					<SuccessMessage message="Membership requested" />
				</div>
			</Modal>
		);

		return <div>{TeamModal}</div>;
	}
}

FindTeam.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	callback: PropTypes.func.isRequired,
	teams: PropTypes.array.isRequired
};

export default createContainer(() => {
	Meteor.subscribe("teams");
	return {
		teams: Teams.find({
			$and: [
				{ members: { $nin: [Meteor.userId()] } },
				{ requests: { $nin: [Meteor.userId()] } }
			]
		}).fetch()
	};
}, FindTeam);
