import React from "react";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";
import { createContainer } from "meteor/react-meteor-data";
import { Teams } from "../api/teams";
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

import { ConfirmDelete } from "./ConfirmDelete";

export class GameItem extends React.Component {
	state = {
		userName: "Not Available",
		userId: "",
		deleteModalOpen: false,
		coach: false
	};

	componentDidMount() {
		var self = this;

		Meteor.call("users.findById", this.props.userId, function(err, user) {
			if (err) {
				alert(err);
			}

			if (user) {
				self.setState({
					userName: user.fName + " " + user.lName,
					userId: user._id
				});
			}
		});
	}

	deleteMember = (res) => {
		this.setState({ deleteModalOpen: false });

		if (!res) {
			return;
		}

		var teamId = Session.get("selectedTeamId");
		Meteor.call("teams.member.remove", this.state.userId, teamId, function(
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

	toggleCoach = () => {
		var coach = !this.state.coach;
		this.setState({ coach });
	};

	render() {
		var { userId } = this.props;

		return (
			<ListItem
				className="memberList-item"
				// button
				// onClick={this.handleToggle(userId)}
			>
				<ListItemText
					className="memberList-item-text"
					primary={this.state.userName}
				/>
				<ListItemSecondaryAction>
					<Checkbox
						checked={this.state.coach}
						tabIndex={-1}
						onChange={this.toggleCoach}
						classes={{
							checked: "coachCheck"
						}}
					/>
					<IconButton
						aria-label="Delete"
						className="deleteMember"
						onClick={() => this.setState({ deleteModalOpen: true })}
					>
						<Delete />
					</IconButton>
				</ListItemSecondaryAction>
				<ConfirmDelete
					isOpen={this.state.deleteModalOpen}
					type={"member"}
					callback={this.deleteMember}
				/>
			</ListItem>
		);
	}
}

GameItem.propTypes = {
	userId: PropTypes.string.isRequired
};

export default createContainer(() => {
	return {
		// anything returned in here is passed into the component down below
		team: Teams.findOne({ _id: Session.get("selectedTeamId") })
	};
}, GameItem);
