import { Meteor } from "meteor/meteor";
import React from "react";
import { Session } from "meteor/session";
import PropTypes from "prop-types";
import Select from "react-select";
import { AddBox, Cancel, Delete, NoteAdd } from "@material-ui/icons";
import { Button, Grid, Modal, TextField } from "@material-ui/core";

const options = [
	{ value: "chocolate", label: "Chocolate" },
	{ value: "strawberry", label: "Strawberry" },
	{ value: "vanilla", label: "Vanilla" }
];

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
			existingTeamId: ""
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
		this.setState({ existingTeamId: selectedTeam.value });
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
				// set success message?
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
				Session.set("selectedTeamName", teamName);
				this.handleModalClose();
			}
		});
	};

	render() {
		var TeamModal = (
			<Modal onClose={this.handleModalClose} open={this.state.modalOpen}>
				<div className="addTeam-modal-div">
					<div className="existingTeam-div">
						<span className="addTeam-title">
							Add an existing team:
						</span>
						<div className="existingTeam-div-select">
							<Select
								value={this.state.selectedTeam}
								onChange={this.handleTeamChange}
								options={options}
								className="teamSearch"
								placeholder="Team Name..."
								styles={styles.customStyles}
							/>
							<Button
								onClick={this.addExistingTeam}
								className="addTeamItem addTeamItem-button"
								classes={{
									label: "addTeam-modal-button-label"
								}}
							>
								<AddBox />
							</Button>
						</div>
					</div>

					<div className="createTeam-div">
						<span className="addTeam-title">Create a team:</span>
						<TextField
							id="createName"
							label="Team Name"
							className="existingTeam-searchName addTeamItem"
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
						<Button
							onClick={this.addNewTeam}
							className="addTeamItem addTeamItem-button"
							classes={{
								label: "addTeam-modal-button-label"
							}}
						>
							<AddBox className="icon-left" />
							Create Team
						</Button>
					</div>
				</div>
			</Modal>
		);

		return <div>{TeamModal}</div>;
	}
}

FindTeam.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	callback: PropTypes.func.isRequired
};

// function handleModalClose() {
// 	this.setState({
// 		modalOpen: false
// 	});
// 	this.props.callback(false);
// }
