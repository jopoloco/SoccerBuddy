import React from "react";
import PropTypes from "prop-types";
import { createContainer } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";

import { Games } from "../api/games";
import { FindTeam } from "./FindTeam";
import DropDownMenu from "./DropDownMenu";
import GameList from "./GameList";

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

export class SidebarHeader extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			date: undefined
		};
	}

	handleGameClick = (_id, name) => {
		// do stuff here!
		Session.set("selectedGameId", _id);
		Session.set("selectedGameTitle", name);
	};

	render() {
		return (
			<div className="sidebarHeader">
				<DropDownMenu
					source={this.props.games}
					item="Game"
					onClickEvent={this.handleGameClick}
					onAddEvent={() => {
						alert("Can't add games from here!");
					}}
				/>
			</div>
		);
	}
}

SidebarHeader.propTypes = {
	// title: PropTypes.string.isRequired
	meteorCall: PropTypes.func.isRequired,
	Session: PropTypes.object.isRequired,
	games: PropTypes.array
};

export default createContainer(() => {
	Meteor.subscribe("games");
	return {
		// anything returned in here is passed into the component down below
		meteorCall: Meteor.call,
		Session,
		games: Games.find(
			{ teamId: Session.get("selectedTeamId") },
			{
				sort: {
					date: 1
				}
			}
		).fetch()
	};
}, SidebarHeader);
