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

import { Events } from "../api/events";

export class Formation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: "Untitled",
			tasks: [
				{ name: "Learn Angular", category: "wip", bgcolor: "yellow" },
				{ name: "React", category: "wip", bgcolor: "pink" },
				{ name: "Vue", category: "complete", bgcolor: "skyblue" }
			]
		};
	}

	onDragStart = (ev, id) => {
		console.log("dragstart:", id);
		ev.dataTransfer.setData("id", id);
	};

	onDragOver = (ev) => {
		ev.preventDefault();
	};

	onDrop = (ev, cat) => {
		let id = ev.dataTransfer.getData("id");

		let tasks = this.state.tasks.filter((task) => {
			if (task.name == id) {
				task.category = cat;
			}
			return task;
		});

		this.setState({
			...this.state,
			tasks
		});
	};

	componentDidMount() {
		// var self = this;
		// var userId = Meteor.userId();
	}

	render() {
		var tasks = {
			wip: [],
			complete: []
		};

		this.state.tasks.forEach((t) => {
			tasks[t.category].push(
				<div
					key={t.name}
					onDragStart={(e) => this.onDragStart(e, t.name)}
					draggable
					className="draggable"
					style={{ backgroundColor: t.bgcolor }}
				>
					{t.name}
				</div>
			);
		});

		return (
			<div className="editGame-editor-div">
				<div className="formation-div">
					<h2 className="header">DRAG & DROP DEMO</h2>
					<div className="container-drag">
						<div
							className="wip"
							onDragOver={(e) => this.onDragOver(e)}
							onDrop={(e) => {
								this.onDrop(e, "wip");
							}}
						>
							<span className="task-header">WIP</span>
							{tasks.wip}
						</div>
						<div
							className="droppable"
							onDragOver={(e) => this.onDragOver(e)}
							onDrop={(e) => this.onDrop(e, "complete")}
						>
							<span className="task-header">COMPLETED</span>
							{tasks.complete}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Formation.propTypes = {
	game: PropTypes.object
};

export default createContainer(() => {
	Meteor.subscribe("events");
	return {
		game: Events.findOne({ _id: Session.get("selectedEventId") })
	};
}, Formation);
