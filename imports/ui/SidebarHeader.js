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

const YES = 0;
const NO = 1;
const MAYBE = 2;

export class SidebarHeader extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			date: undefined,
			disabled: Session.get("selectedEventId") == undefined
		};
	}

	componentDidUpdate(prevProps, prevState) {
		var noGame = Session.get("selectedEventId") == undefined;
		if (prevState.disabled != noGame) {
			this.setState({ disabled: noGame });
		}
	}

	handleGameClick = (_id, name) => {
		// do stuff here!
		Session.set("selectedEventId", _id);
		Session.set("selectedEventTitle", name);
		this.setState({ disabled: false });
	};

	RSVP = (attending) => {
		Meteor.call(
			"games.rsvp",
			Session.get("selectedEventId"),
			Meteor.userId(),
			attending,
			function(err, res) {
				if (err) {
					alert(err);
				}
				if (res) {
					// ...
				}
			}
		);
	};

	render() {
		return (
			<div className="sidebarHeader">
				<DropDownMenu
					source={this.props.games}
					item="Game"
					onClickEvent={this.handleGameClick}
					selectedId={Session.get("selectedEventId")}
					onAddEvent={() => {
						alert("Can't add games from here!");
					}}
				/>
				<div>
					<Button
						onClick={() => this.RSVP(YES)}
						className={
							this.props.attending == YES
								? "button button-secondary menu-button attending-button"
								: "button button-secondary menu-button"
						}
						disabled={this.state.disabled}
					>
						YES
					</Button>
					<Button
						onClick={() => this.RSVP(NO)}
						className={
							this.props.attending == NO
								? "button button-secondary menu-button attending-button"
								: "button button-secondary menu-button"
						}
						disabled={this.state.disabled}
					>
						NO
					</Button>
					<Button
						onClick={() => this.RSVP(MAYBE)}
						className={
							this.props.attending == MAYBE
								? "button button-secondary menu-button attending-button"
								: "button button-secondary menu-button"
						}
						disabled={this.state.disabled}
					>
						MAYBE
					</Button>
				</div>
			</div>
		);
	}
}

SidebarHeader.propTypes = {
	// title: PropTypes.string.isRequired
	attending: PropTypes.number.isRequired,
	Session: PropTypes.object.isRequired,
	games: PropTypes.array
};

export default createContainer(() => {
	Meteor.subscribe("games");
	var game = Games.findOne({ _id: Session.get("selectedEventId") });
	var attendingArray = [];
	var attending = -1;

	if (game && game.rollCall) {
		attendingArray = game.rollCall.filter((obj) => {
			return obj.user == Meteor.userId();
		});

		if (attendingArray.length == 1) {
			attending = attendingArray[0].attending;
		}
	}

	return {
		// anything returned in here is passed into the component down below
		Session,
		games: Games.find(
			{ teamId: Session.get("selectedTeamId") },
			{
				sort: {
					date: 1
				}
			}
		).fetch(),
		attending: attending
	};
}, SidebarHeader);
