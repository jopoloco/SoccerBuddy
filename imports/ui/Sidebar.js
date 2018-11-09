import React from "react";
import PropTypes from "prop-types";
import { createContainer } from "meteor/react-meteor-data";
import { history } from "../routes/AppRouter";
import { Meteor } from "meteor/meteor";

// import {
// 	Edit,
// 	ExpandMore,
// 	Save,
// 	Delete,
// 	Cancel,
// 	AddCircle,
// 	NoteAdd
// } from "@material-ui/icons";
// import {
// 	Button,
// 	ExpansionPanel,
// 	ExpansionPanelSummary,
// 	ExpansionPanelDetails,
// 	Grid,
// 	Modal,
// 	TextField,
// 	Typography
// } from "@material-ui/core";

// import { ConfirmDelete } from "./ConfirmDelete";
import SidebarHeader from "./SidebarHeader";
import SearchEditor from "./SearchEditor";

export class Sidebar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalOpen: false
		};
	}

	deleteProject = (res) => {
		// res is the result from the ConfirmDelete modal. true=delete, false=cancel
		this.setState({ deleteOpen: false }); // always close modal, then handle delete

		console.log("we received: " + res);

		if (!res) return;

		Meteor.call("projects.remove", this.state.editing);
		push("/dashboard/");
		Session.set("selectedNoteId", "");

		handleModalClose.bind(this)();
	};

	componentDidUpdate(prevProps, prevState) {
		var selectedId = Session.get("selectedProjectId");
		if (selectedId && this.state.curPanel != selectedId) {
			this.setState({ curPanel: selectedId });
		}
	}

	render() {
		return (
			<div className="sidebar">
				<SidebarHeader />
				{/* <SearchEditor /> */}
				{/* <ConfirmDelete /> */}
			</div>
		);
	}
}

function handleChange(panel, event, expanded) {
	this.setState({
		curPanel: expanded ? panel : ""
	});

	if (expanded) {
		Session.set("selectedProjectId", panel);
		Session.set("selectedNoteId", undefined);
		history.push("/dashboard");
	} else {
		Session.set("selectedProjectId", undefined);
		Session.set("selectedNoteId", undefined);
		history.push("/dashboard");
	}
}

function saveProject() {
	Meteor.call("searches.update", this.state.editing, {
		title: this.state.title,
		body: this.state.body,
		dueDate: this.state.dueDate
	});

	handleModalClose.bind(this)();
}

function handleModalClose() {
	this.setState({
		modalOpen: false
	});
}

function push(destination) {
	if (history.push) {
		history.push(destination);
	} else {
		history.__proto__.pushState.call(history, null, null, destination);
	}
}

Sidebar.propTypes = {
	// searches: PropTypes.array.isRequired
};

export default createContainer(() => {
	Meteor.subscribe("searches");

	return {};
}, Sidebar);
