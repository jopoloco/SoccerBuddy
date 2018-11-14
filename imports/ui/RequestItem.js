import React from "react";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";
import { createContainer } from "meteor/react-meteor-data";
import { Teams } from "../api/teams";
import { Session } from "meteor/session";

import { Delete, Cancel, CheckCircle, Save, Comment } from "@material-ui/icons";
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

export class RequestItem extends React.Component {
	state = {
		userName: "Not Available",
		userId: "",
		deleteModalOpen: false
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

	acceptRequest = () => {
		var teamId = Session.get("selectedTeamId");
		Meteor.call(
			"teams.request.approve",
			this.state.userId,
			teamId,
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

	rejectRequest = (res) => {
		this.setState({ deleteModalOpen: false });

		if (!res) {
			return;
		}

		var teamId = Session.get("selectedTeamId");
		Meteor.call("teams.request.reject", this.state.userId, teamId, function(
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
					<IconButton
						aria-label="Accept"
						className="acceptRequest"
						onClick={this.acceptRequest}
					>
						<CheckCircle />
					</IconButton>
					<IconButton
						aria-label="Reject"
						className="rejectRequest"
						onClick={() => this.setState({ deleteModalOpen: true })}
					>
						<Cancel />
					</IconButton>
				</ListItemSecondaryAction>
				<ConfirmDelete
					isOpen={this.state.deleteModalOpen}
					type={"request"}
					callback={this.rejectRequest}
				/>
			</ListItem>
		);
	}
}

RequestItem.propTypes = {
	userId: PropTypes.string.isRequired
};

export default createContainer(() => {
	return {
		// anything returned in here is passed into the component down below
	};
}, RequestItem);
