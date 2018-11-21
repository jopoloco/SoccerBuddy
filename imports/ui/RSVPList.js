import React from "react";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Accounts } from "meteor/accounts-base";
import { createContainer } from "meteor/react-meteor-data";

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

import { Games } from "../api/games";

export class Admin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: "Undefined",
			checked: [0]
		};
	}

	handleToggle = (value) => () => {
		const { checked } = this.state;
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		this.setState({
			checked: newChecked
		});
	};

	componentDidMount() {
		// var self = this;
		// var userId = Meteor.userId();

		if (this.props.game) {
			this.setState({ title: this.props.game.title });
		}
	}

	render() {
		var requests = [0, 1, 2, 3];
		return (
			<div className="editGame-editor-div">
				<div className="editGame-title-div">
					<h1>{"Modify '" + this.state.title + "' Details"}</h1>
					<h2>
						{"selected event id: " + Session.get("selectedEventId")}
					</h2>
				</div>
				<div className="editGame-body-div">
					<div className="editGame-memberList-div">
						<List className="">
							<ListSubheader className="memberList-header">
								MEMBERS
							</ListSubheader>
							{requests.map((request, i) => (
								<div key={request}>
									<ListItem
										className="memberList-item"
										role={undefined}
										dense
										button
										onClick={this.handleToggle(request)}
									>
										<Checkbox
											checked={
												this.state.checked.indexOf(
													request
												) !== -1
											}
											tabIndex={-1}
											disableRipple
										/>
										<ListItemText
											className="memberList-item-text"
											primary={`Line item ${request + 1}`}
										/>
										<ListItemSecondaryAction>
											<IconButton aria-label="Comments">
												<Comment />
											</IconButton>
										</ListItemSecondaryAction>
									</ListItem>
								</div>
							))}
						</List>
					</div>
					<div className="editGame-rsvp-div">RSVP AREA!</div>
				</div>
			</div>
		);
	}
}

Admin.propTypes = {
	game: PropTypes.object
};

export default createContainer(() => {
	Meteor.subscribe("games");
	return {
		game: Games.findOne({ _id: Session.get("selectedEventId") })
	};
}, Admin);
