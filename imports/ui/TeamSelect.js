import React from "react";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Accounts } from "meteor/accounts-base";
import { createContainer } from "meteor/react-meteor-data";

import DropDownMenu from "./DropDownMenu";
import { FindTeam } from "./FindTeam";

import { Teams } from "../api/teams";

import {
	// Edit
	// 	ExpandMore,
	// 	Save,
	// 	Delete,
	// 	Cancel,
	// 	AddCircle,
	NoteAdd
} from "@material-ui/icons";
import {
	Button,
	// 	ExpansionPanel,
	// 	ExpansionPanelSummary,
	// 	ExpansionPanelDetails,
	// 	Grid,
	Menu,
	MenuItem,
	// 	Modal,
	TextField
	// 	Typography
} from "@material-ui/core";

export class TeamSelect extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: "",
			modalOpen: false
		};
	}

	componentDidMount() {
		// var self = this;
		var userId = Meteor.userId();
		Meteor.call("users.findById", userId, function(err, user) {
			if (err) {
				alert(err);
			}

			if (user) {
				// self.setState({ userEmail: user.emails[0].address });
			}
		});
	}

	handleTeamClick = (_id, name) => {
		Session.set("selectedTeamId", _id);
		Session.set("selectedTeamName", name);
	};

	findTeamCallback = () => {
		this.setState({ modalOpen: false });
	};

	render() {
		var addTeamButton = (
			<Button
				onClick={() => this.setState({ modalOpen: true })}
				className="button button-secondary addTeam-button"
				// classes={{
				//     label: "button-label"
				// }}
			>
				<NoteAdd className="icon-large" />
			</Button>
		);

		return (
		// <div className="boxedView">
		// 	<div className="boxedView_box">
		/* <h1>Pick a Team</h1>

				{this.state.error ? (
					<p id="errorP">{this.state.error}</p>
				) : (
					undefined
				)} */

			<div className="find-team-div">
				<DropDownMenu
					source={this.props.teams}
					item="Team"
					onClickEvent={this.handleTeamClick}
					onAddEvent={() => this.setState({ modalOpen: true })}
				/>
				{/* {addTeamButton} */}
				<FindTeam
					isOpen={this.state.modalOpen}
					callback={this.findTeamCallback}
				/>
			</div>
		);
	}
}

TeamSelect.propTypes = {
	// updateUser: PropTypes.func.isRequired
	teams: PropTypes.array.isRequired,
	teamId: PropTypes.string
};

export default createContainer(() => {
	Meteor.subscribe("teams");
	return {
		teams: Teams.find({ members: Meteor.userId() }).fetch(),
		teamId: Session.get("selectedTeamId")
	};
}, TeamSelect);
