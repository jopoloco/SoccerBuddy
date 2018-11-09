import React from "react";
import PropTypes from "prop-types";
import { createContainer } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";

import { Games } from "../api/games";
import { FindTeam } from "./FindTeam";
import DropDownMenu from "./DropDownMenu";

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
		// Session.set("selectedTeamId", _id);
		// Session.set("selectedTeamName", name);
	};

	render() {
		var games = this.props.games;
		var reducedGames = Games.find({ members: Meteor.userId() }).fetch();

		return (
			<div className="sidebarHeader">
				<DropDownMenu
					source={reducedGames}
					item="Game"
					onClickEvent={this.handleGameClick}
					onAddEvent={() => {}}
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
	var userId = Meteor.userId();

	return {
		// anything returned in here is passed into the component down below
		meteorCall: Meteor.call,
		Session,
		search: null,
		games: Games.find({}).fetch()
		// games: Games.find(
		// 	{ team: { $in: teams._id}  },
		// 	{
		// 		sort: {
		// 			title: 1
		// 		}
		// 	}
		// ).fetch(),
	};
}, SidebarHeader);
