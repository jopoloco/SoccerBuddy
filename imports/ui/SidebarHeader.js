import React from "react";
import PropTypes from "prop-types";
import { Accounts } from "meteor/accounts-base";
import { createContainer } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";

import { NoteAdd } from "@material-ui/icons";
import { Button, Menu, MenuItem } from "@material-ui/core";

import { Searches } from "../api/searches";

export class SidebarHeader extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			anchorEl: null
		};
	}

	handleMenuClick = (event) => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleMenuItemClick = (id) => {
		this.props.Session.set("selectedSearchId", id);
		this.handleMenuClose();
	};

	handleMenuClose = () => {
		this.setState({ anchorEl: null });
	};

	handleAddClick = () => {
		this.props.meteorCall("searches.insert", (err, res) => {
			if (res) {
				// make new search the selected search
				this.props.Session.set("selectedSearchId", res);
				this.props.meteorCall("agenda.add", res);
				this.props.meteorCall("searchResults.insert", res);
			}
		});
	};

	render() {
		var { anchorEl } = this.state;
		var { searches, Session, meteorCall } = this.props;
		searches = searches.sort(compareSearchTitles);

		var menuItems = (
			<div>
				{searches.map((search, i) => {
					return (
						<MenuItem
							onClick={() => this.handleMenuItemClick(search._id)}
							key={search._id}
						>
							{search.title || "Untitled search"}
						</MenuItem>
					);
				})}
			</div>
		);

		var searchMenu = (
			<Menu
				id="simple-menu"
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={this.handleMenuClose}
				className="searchMenu"
			>
				{menuItems}
			</Menu>
		);

		var menuButton = (
			<Button
				// aria-owns={anchorEl ? 'simple-menu' : null}
				// aria-haspopup="true"
				onClick={this.handleMenuClick}
				className="button button-secondary menu-button"
			>
				Select Search
			</Button>
		);

		var addButton = (
			<Button
				onClick={this.handleAddClick}
				className="button button-secondary addSearch-button"
				// classes={{
				//     label: "button-label"
				// }}
			>
				<NoteAdd className="icon-large" />
			</Button>
		);

		return (
			<div className="sidebarHeader">
				{menuButton}
				{addButton}
				{searchMenu}
			</div>
		);
	}
}

function compareSearchTitles(a, b) {
	var ac = a.title.toLowerCase();
	var bc = b.title.toLowerCase();

	if (ac < bc) return -1;
	if (ac > bc) return 1;
}

SidebarHeader.propTypes = {
	// title: PropTypes.string.isRequired
	meteorCall: PropTypes.func.isRequired,
	Session: PropTypes.object.isRequired,
	searches: PropTypes.array.isRequired
};

export default createContainer(() => {
	// if (!selectedProjectId && selectedNoteId) {
	//     var note = Notes.findOne({ _id: selectedNoteId });
	//     if (note) {
	//         selectedProjectId = note.projectId;
	//         Session.set("selectedProjectId", selectedProjectId);
	//     }
	// }
	var userId = Meteor.userId();

	return {
		// anything returned in here is passed into the component down below
		meteorCall: Meteor.call,
		Session,
		searches: Searches.find(
			{ userId },
			{
				sort: {
					title: 1
				}
			}
		).fetch()
	};
}, SidebarHeader);
