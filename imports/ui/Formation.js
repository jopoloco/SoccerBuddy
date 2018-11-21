import React from "react";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Accounts } from "meteor/accounts-base";
import { createContainer } from "meteor/react-meteor-data";

import { AddCircle, Cancel, Delete, Save, Comment } from "@material-ui/icons";
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

import { Games } from "../api/games";

export class Formation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: "Untitled"
		};
	}

	componentDidMount() {
		// var self = this;
		// var userId = Meteor.userId();
	}

	render() {
		return (
			<div className="editGame-editor-div">
				This has not been setup, yet!
			</div>
		);
	}
}

Formation.propTypes = {
	game: PropTypes.object
};

export default createContainer(() => {
	Meteor.subscribe("games");
	return {
		game: Games.findOne({ _id: Session.get("selectedEventId") })
	};
}, Formation);
