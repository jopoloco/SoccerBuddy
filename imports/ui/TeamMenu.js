import React from "react";
import PropTypes from "prop-types";
import { createContainer } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";

import {
	// Edit
	// 	ExpandMore,
	// 	Save,
	Delete,
	// 	Cancel,
	// 	AddCircle,
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
	// 	Modal,
	TextField
	// 	Typography
} from "@material-ui/core";

import ConfirmDelete from "./ConfirmDelete";

export class TeamMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			deleteModalOpen: false,
			deleteType: "team",
			anchorEl: null,
			date: undefined,
			index: -1,
			deleteId: undefined
		};
	}

	handleMenuClick = (event) => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleMenuItemClick = (_id, title) => {
		this.props.onClickEvent(_id, title);
		this.handleMenuClose();
	};

	handleAddItemClick = () => {
		this.props.onAddEvent();
		this.handleMenuClose();
	};

	handleDeleteTeam = (res) => {
		this.handleMenuClose();

		if (!res) {
			return;
		}

		this.props.onDeleteEvent(this.state.deleteId);
	};

	handleMenuClose = () => {
		this.setState({
			anchorEl: null,
			deleteModalOpen: false,
			deleteId: undefined
		});
	};

	render() {
		var { anchorEl } = this.state;
		var source = this.props.source;

		var addNew = (
			<MenuItem
				onClick={() => this.handleAddItemClick()}
				className={"dropdown-newitem"}
			>
				Add new team
			</MenuItem>
		);

		var items = (
			<div>
				{source.map((item, i) => {
					var title = item.title;
					return (
						<div key={item._id} className="teamMenu-item ">
							<MenuItem
								onClick={() =>
									this.handleMenuItemClick(item._id, title)
								}
								selected={item._id == this.props.selectedId}
								className={
									item.coachId == Meteor.userId()
										? "teamMenu-team coachedTeam"
										: "teamMenu-team"
								}
							>
								{title || "Untitled team"}
							</MenuItem>
							<IconButton
								onClick={() =>
									this.setState({
										deleteModalOpen: true,
										deleteId: item._id
									})
								}
								className="addTeamItem-button"
								classes={{
									label: "addTeam-modal-button-label"
								}}
							>
								<Delete />
							</IconButton>
						</div>
					);
				})}
				{addNew}
			</div>
		);

		var menu = (
			<Menu
				id="simple-menu"
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={this.handleMenuClose}
				className="searchMenu"
			>
				{items}
			</Menu>
		);

		var button = (
			<Button
				// aria-owns={anchorEl ? 'simple-menu' : null}
				// aria-haspopup="true"
				onClick={this.handleMenuClick}
				className="button button-secondary teamMenu-button"
				disabled={this.state.disabled}
			>
				{Session.get("selectedTeamTitle") == undefined
					? "Select a team"
					: Session.get("selectedTeamTitle")}
			</Button>
		);

		return (
			<div className="teamMenu">
				{button}
				{menu}
				<ConfirmDelete
					isOpen={this.state.deleteModalOpen}
					type={this.state.deleteType}
					callback={this.handleDeleteTeam}
				/>
			</div>
		);
	}
}

TeamMenu.propTypes = {
	source: PropTypes.array.isRequired,
	selectedId: PropTypes.string,
	item: PropTypes.string.isRequired,
	onClickEvent: PropTypes.func.isRequired,
	onAddEvent: PropTypes.func.isRequired,
	onDeleteEvent: PropTypes.func.isRequired
};

export default createContainer(() => {
	return {
		// anything returned in here is passed into the component down below
		Session
	};
}, TeamMenu);
