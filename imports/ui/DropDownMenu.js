import React from "react";
import PropTypes from "prop-types";
import { createContainer } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";

import {
	// Edit
	ExpandMore,
	// 	Save,
	// 	Delete,
	// 	Cancel,
	// 	AddCircle,
	NoteAdd
} from "@material-ui/icons";
import {
	Button,
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

export class DropDownMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			anchorEl: null,
			date: undefined,
			disabled:
				this.props.item != "Team" && this.props.source.length <= 0,
			index: -1
		};
	}

	handleMenuClick = (event) => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleMenuItemClick = (_id, name, index) => {
		this.setState({ index: index });
		this.props.onClickEvent(_id, name);
		this.handleMenuClose();
	};

	handleAddItemClick = () => {
		this.props.onAddEvent();
		this.handleMenuClose();
	};

	handleMenuClose = () => {
		this.setState({ anchorEl: null });
	};

	componentDidMount() {
		this.updateComponent(this.state.disabled);
	}

	componentDidUpdate(prevProps, prevState) {
		this.updateComponent(prevState.disabled);
	}

	updateComponent(disabled) {
		if (
			this.props.item != "Team" &&
			disabled != this.props.source.length <= 0
		) {
			this.setState({ disabled: this.props.source.length <= 0 });
		}

		if (this.state.index == -1 && this.props.selectedId) {
			this.props.source.map((item, i) => {
				if (item._id == this.props.selectedId) {
					this.setState({ index: i });
				}
			});
		}
	}

	render() {
		var { anchorEl } = this.state;
		var source = this.props.source;

		var addNew = undefined;
		if (this.props.item == "Team") {
			addNew = (
				<MenuItem
					onClick={() => this.handleAddItemClick()}
					className={"dropdown-newitem"}
				>
					{"Add new " + this.props.item}
				</MenuItem>
			);
		}

		var items = (
			<div>
				{source.map((item, i) => {
					var title = item.title;
					return (
						<MenuItem
							onClick={() =>
								this.handleMenuItemClick(item._id, title, i)
							}
							key={item._id}
							selected={item._id == this.props.selectedId}
							className={
								this.props.item == "Team" &&
								item.coachId == Meteor.userId()
									? "coachedTeam"
									: ""
							}
						>
							{title || "Untitled " + this.props.item}
						</MenuItem>
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
				className="button button-secondary menu-button"
				disabled={this.state.disabled}
			>
				{this.state.disabled
					? "No " + this.props.item + " Available"
					: this.state.index == -1
						? "Select a " + this.props.item
						: this.props.source[this.state.index].title}
				<ExpandMore className="icon-right" />
			</Button>
		);

		return (
			<div className="menu">
				{button}
				{menu}
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

DropDownMenu.propTypes = {
	source: PropTypes.array.isRequired,
	selectedId: PropTypes.string,
	item: PropTypes.string.isRequired,
	onClickEvent: PropTypes.func.isRequired,
	onAddEvent: PropTypes.func.isRequired
};

export default createContainer(() => {
	// if (!selectedProjectId && selectedNoteId) {
	//     var note = Notes.findOne({ _id: selectedNoteId });
	//     if (note) {
	//         selectedProjectId = note.projectId;
	//         Session.set("selectedProjectId", selectedProjectId);
	//     }
	// }

	return {
		// anything returned in here is passed into the component down below
		Session
	};
}, DropDownMenu);
