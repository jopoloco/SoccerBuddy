import React from "react";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Accounts } from "meteor/accounts-base";
import { createContainer } from "meteor/react-meteor-data";

import {
	AddCircle,
	Cancel,
	Delete,
	ExpandMore,
	Save,
	Comment
} from "@material-ui/icons";
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

import { Events } from "../api/events";
import DropDownMenu from "./DropDownMenu";
import SuccessMessage from "./SuccessMessage";

const EVENT_TYPES = [
	{ _id: "0", title: "game" },
	{ _id: "1", title: "party" },
	{ _id: "2", title: "colonoscopy" }
];

export class Admin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: "Untitled",
			date: "2018-01-01",
			type: "",
			typeId: "-1",
			checked: [0],
			location: ""
		};
	}

	componentDidMount() {
		// var self = this;
		// var userId = Meteor.userId();

		if (this.props.game) {
			var game = this.props.game;
			var typeId = this.state.typeId;
			for (var i = 0; i < EVENT_TYPES.length; i++) {
				if (EVENT_TYPES[i].title == game.type) {
					typeId = EVENT_TYPES[i]._id;
				}
			}

			this.setState({
				title: game.title,
				date: game.date,
				type: game.type,
				typeId: typeId,
				location: game.location
			});
		}
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

	handleChange = (name) => (event) => {
		this.setState({
			[name]: event.target.value
		});
	};

	handleTypeChange = (_id, type) => {
		this.setState({ type: type });
	};

	saveGame = () => {
		var self = this;
		var updates = {
			title: this.state.title,
			date: this.state.date,
			type: this.state.type,
			location: this.state.location
		};
		Meteor.call(
			"events.update",
			this.props.game._id,
			this.props.game.coachId,
			updates,
			function(err, res) {
				if (err) {
					alert(err);
				}

				if (res) {
					// success messsage
					SuccessMessage.triggerMessage();
				}
			}
		);
	};

	render() {
		return (
			<div className="editGame-editor-div">
				<div className="editGame-title-div">
					<h1>{"Modify '" + this.state.title + "' Details"}</h1>
					<h2>
						{"selected event id: " + Session.get("selectedEventId")}
					</h2>
				</div>
				<div className="editGame-body-div">
					<div className="editGame-details-div">
						<TextField
							id="title"
							label="Title"
							className="gameEdit-textfield"
							variant="outlined"
							InputLabelProps={{
								classes: {
									root: "gameEdit-editor-title-label"
								}
							}}
							InputProps={{
								classes: {
									input: "gameEdit-editor-title-input"
								}
							}}
							value={this.state.title}
							onChange={this.handleChange("title")}
							margin="normal"
						/>
						<TextField
							id="dateTime"
							label="Date and Time"
							className="gameEdit-textfield"
							type="datetime-local"
							variant="outlined"
							InputLabelProps={{
								classes: {
									root: "gameEdit-editor-title-label"
								}
							}}
							InputProps={{
								classes: {
									input: "gameEdit-editor-title-input"
								}
							}}
							value={this.state.date}
							onChange={this.handleChange("date")}
							margin="normal"
						/>
						<TextField
							id="location"
							label="Location"
							className="gameEdit-textfield"
							variant="outlined"
							InputLabelProps={{
								classes: {
									root: "gameEdit-editor-title-label"
								}
							}}
							InputProps={{
								classes: {
									input: "gameEdit-editor-title-input"
								}
							}}
							value={this.state.location}
							onChange={this.handleChange("location")}
							margin="normal"
						/>
						<div className="gameEdit-type">
							<label>Type:</label>
							<DropDownMenu
								source={EVENT_TYPES}
								item="Type"
								selectedId={this.state.typeId}
								onClickEvent={this.handleTypeChange}
								onAddEvent={() => {
									alert("Can't add event types!");
								}}
							/>
						</div>
						<div className="gameEdit-save">
							<Button
								className="button button-secondary gameEdit-button"
								onClick={this.saveGame}
							>
								<Save />
								Save
							</Button>
						</div>
						<SuccessMessage message="Game Updated" />
					</div>
				</div>
			</div>
		);
	}
}

Admin.propTypes = {
	game: PropTypes.object
};

export default createContainer(() => {
	Meteor.subscribe("events");
	return {
		game: Events.findOne({ _id: Session.get("selectedEventId") })
	};
}, Admin);
