import React from "react";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
import PropTypes from "prop-types";

import {
	// Edit
	// 	ExpandMore,
	// 	Save,
	// 	Delete,
	Cancel,
	AddCircle,
	NoteAdd
} from "@material-ui/icons";
import {
	Button,
	IconButton,
	// 	ExpansionPanel,
	// 	ExpansionPanelSummary,
	// 	ExpansionPanelDetails,
	// 	Grid,
	Menu,
	MenuItem,
	Modal,
	TextField
	// 	Typography
} from "@material-ui/core";

import DropDownMenu from "./DropDownMenu";

const EVENT_TYPES = [
	{ _id: "0", title: "game" },
	{ _id: "1", title: "party" },
	{ _id: "2", title: "colonoscopy" }
];

export default class GameCreate extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalOpen: this.props.isOpen,
			delete: false,
			title: "Untitled",
			date: "2018-01-01",
			type: ""
		};
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.modalOpen != this.props.isOpen) {
			this.setState({
				title: "Untitled",
				date: "2018-01-01",
				type: "",
				modalOpen: this.props.isOpen
			});
		}
	}

	createEvent = () => {
		var self = this;
		Meteor.call(
			"games.insert",
			Session.get("selectedTeamId"),
			self.state.title,
			self.state.date,
			self.state.type,
			function(err, res) {
				if (err) {
					alert(err);
				}

				if (res) {
					self.props.callback(res);
					self.closeModal();
				}
			}
		);
	};

	handleChange = (name) => (event) => {
		this.setState({
			[name]: event.target.value
		});
	};

	handleTypeChange = (_id, type) => {
		this.setState({ type: type });
	};

	closeModal = () => {
		this.setState({ modalOpen: false });
	};

	render() {
		var GameCreateModal = (
			<Modal
				// onClose={handleModalClose.bind(this)} // leaving this commented so you can only exit via buttons
				open={this.state.modalOpen}
			>
				<div className="create-modal-div">
					<span className="create-modal-title">
						Create {this.state.type}:
					</span>
					<TextField
						id="title"
						label="Title"
						variant="outlined"
						InputLabelProps={{
							classes: {
								root: "editor-title-label"
							}
						}}
						InputProps={{
							classes: {
								input: "editor-title-input"
							}
						}}
						value={this.state.title}
						onChange={this.handleChange("title")}
						margin="normal"
					/>
					<TextField
						id="date"
						label="Date"
						type="date"
						variant="outlined"
						InputLabelProps={{
							classes: {
								root: "editor-title-label"
							}
						}}
						InputProps={{
							classes: {
								input: "editor-title-input"
							}
						}}
						value={this.state.date}
						onChange={this.handleChange("date")}
						margin="normal"
					/>
					<div className="createGame-type">
						<DropDownMenu
							source={EVENT_TYPES}
							item="Type"
							onClickEvent={this.handleTypeChange}
							onAddEvent={() => {
								alert("Can't add event types!");
							}}
						/>
					</div>
					<div>
						<Button
							className="button button-secondary"
							onClick={this.createEvent}
						>
							<AddCircle />
							Create
						</Button>
						<Button
							className="button button-secondary"
							onClick={this.closeModal}
						>
							<Cancel />
							Cancel
						</Button>
					</div>
				</div>
			</Modal>
		);

		return <div>{GameCreateModal}</div>;
	}
}

GameCreate.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	callback: PropTypes.func
};
