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

export class RequestItem extends React.Component {
	state = {
		name: "Not Available"
	};

	componentDidMount() {
		var self = this;

		Meteor.call("users.findById", this.props.userId, function(err, user) {
			if (err) {
				alert(err);
			}

			if (user) {
				self.setState({ name: user.fName + " " + user.lName });
			}
		});
	}

	acceptRequest = () => {
		alert("accept");
	};

	rejectRequest = () => {
		alert("reject");
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
					primary={this.state.name}
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
						onClick={this.rejectRequest}
					>
						<Cancel />
					</IconButton>
				</ListItemSecondaryAction>
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
