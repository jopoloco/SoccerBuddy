import React from "react";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Accounts } from "meteor/accounts-base";
import { createContainer } from "meteor/react-meteor-data";

import TeamMenu from "./TeamMenu";
import FindTeam from "./FindTeam";

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
	IconButton,
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

	handleTeamClick = (_id, title) => {
		Session.set("selectedTeamId", _id);
		Session.set("selectedTeamTitle", title);
		Session.set("selectedEventId", undefined);
		Session.set("selectedEventTitle", undefined);
	};

	handleTeamDelete = (teamId) => {
		var userId = Meteor.userId();
		Meteor.call("teams.member.remove", userId, teamId, function(err, res) {
			if (err) {
				alert(err);
			}

			if (res) {
				Session.set("selectedTeamId", undefined);
				Session.set("selectedTeamTitle", undefined);
				Session.set("selectedEventId", undefined);
				Session.set("selectedEventTitle", undefined);
			}
		});
	};

	findTeamCallback = () => {
		this.setState({ modalOpen: false });
	};

	render() {
		return (
			<div className="find-team-div">
				<TeamMenu
					source={this.props.teams}
					item="Team"
					onClickEvent={this.handleTeamClick}
					onAddEvent={() => this.setState({ modalOpen: true })}
					onDeleteEvent={this.handleTeamDelete}
				/>
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
