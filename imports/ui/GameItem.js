import React from "react";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";
import { createContainer } from "meteor/react-meteor-data";
import { Session } from "meteor/session";

import { Delete, Edit, Save, Comment } from "@material-ui/icons";
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

import ConfirmDelete from "./ConfirmDelete";

export class GameItem extends React.Component {
	state = {
		title: "Untitled",
		type: "N/A",
		date: "N/A",
		deleteModalOpen: false,
		editModalOpen: false
	};

	componentDidMount() {
		this.updateState();
	}

	componentDidUpdate() {
		this.updateState();
	}

	updateState() {
		if (!this.props.game) {
			return;
		}

		var game = this.props.game;

		if (this.state.title != game.title) {
			this.setState({ title: game.title });
		}

		if (this.state.type != game.type) {
			this.setState({ type: game.type });
		}

		if (this.state.date != game.date) {
			this.setState({ date: game.date });
		}
	}

	deleteGame = (res) => {
		this.setState({ deleteModalOpen: false });

		if (!res) {
			return;
		}

		Meteor.call("games.remove", this.props.game._id, function(err, res) {
			if (err) {
				alert(err);
			}

			if (res) {
				// ...
			}
		});
	};

	editGame = (res) => {
		this.setState({ editModalOpen: false });

		if (!res) {
			return;
		}

		// Meteor.call("games.remove", this.props.gameId, function(err, res) {
		// 	if (err) {
		// 		alert(err);
		// 	}

		// 	if (res) {
		// 		// ...
		// 	}
		// });
	};

	render() {
		if (!this.props.game) {
			return (
				<div className="memberList-div">
					<span>Game not found!</span>
				</div>
			);
		}

		return (
			<ListItem
				className="memberList-item"
				// button
				// onClick={this.handleToggle(userId)}
			>
				<ListItemText
					className="memberList-item-text"
					primary={this.state.title}
				/>
				<ListItemSecondaryAction>
					<IconButton
						aria-label="Edit"
						className="editGame"
						onClick={() => alert("edit game")}
					>
						<Edit />
					</IconButton>
					<IconButton
						aria-label="Delete"
						className="deleteGame"
						onClick={() => this.setState({ deleteModalOpen: true })}
					>
						<Delete />
					</IconButton>
				</ListItemSecondaryAction>
				<ConfirmDelete
					isOpen={this.state.deleteModalOpen}
					type={"game"}
					callback={this.deleteGame}
				/>
				{/* <GameEdit
					isOpen={this.state.editModalOpen}
					type={"edit"}
					callback={this.editGame}
				/> */}
			</ListItem>
		);
	}
}

GameItem.propTypes = {
	game: PropTypes.object.isRequired
};

export default createContainer(() => {
	return {
		// anything returned in here is passed into the component down below
	};
}, GameItem);
