import React from "react";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";
import { createContainer } from "meteor/react-meteor-data";
import { Games } from "../api/games";
import { Session } from "meteor/session";

import { Delete, Save, Comment } from "@material-ui/icons";
import {
	Button,
	Checkbox,
	IconButton,
	FormControlLabel,
	List,
	ListItem,
	ListSubheader,
	ListItemSecondaryAction,
	ListItemText,
	TextField
} from "@material-ui/core";

import GameItem from "./GameItem";

export class GameList extends React.Component {
	state = {
		checked: [0]
	};

	createGame = () => {
		Meteor.call("games.insert", Session.get("selectedTeamId"), function(
			err,
			res
		) {
			if (err) {
				alert(err);
			}

			if (res) {
				// ...
			}
		});
	};

	render() {
		var gamesTable = (
			<div className="memberList-item-empty">No games found</div>
		);

		if (this.props.games.length > 0) {
			gamesTable = this.props.games.map((game, i) => (
				<GameItem key={game._id} game={game} />
			));
		}

		return (
			<div className="memberList-div">
				<List className="">
					<ListSubheader className="memberList-header">
						<Button
							onClick={this.createGame}
							className="createGame-button"
						>
							Create Game
						</Button>
					</ListSubheader>
					{gamesTable}
				</List>
			</div>
		);
	}
}

GameList.propTypes = {
	games: PropTypes.array
};

export default createContainer(() => {
	Meteor.subscribe("games");
	return {
		// anything returned in here is passed into the component down below
		games: Games.find(
			{ teamId: Session.get("selectedTeamId") },
			{
				sort: {
					date: 1
				}
			}
		).fetch()
	};
}, GameList);
