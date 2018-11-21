import React from "react";
import PropTypes from "prop-types";
import { Session } from "meteor/session";
import { createContainer } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";

import { Delete, Save } from "@material-ui/icons";
import {
	Button,
	Checkbox,
	FormControlLabel,
	TextField
} from "@material-ui/core";

import ConfirmDelete from "./ConfirmDelete";
import { Teams } from "../api/teams";

export class SearchEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: "Untitled search",
			price: "500",
			auction: true,
			auctionBIN: true,
			fixedPrice: true,
			modalOpen: false
		};
	}

	componentDidUpdate(prevProps, prevState) {
		var curSearchId = this.props.search ? this.props.search._id : undefined;
		var prevSearchId = prevProps.search ? prevProps.search._id : undefined;

		if (this.props.search) {
			// editing a search
			if (curSearchId && curSearchId != prevSearchId) {
				this.setState({
					title: this.props.search.title || "Untitled search",
					price: this.props.search.price || 500,
					auction: this.props.search.auction,
					auctionBIN: this.props.search.auctionBIN,
					fixedPrice: this.props.search.fixedPrice
				});
			}
		}

		// var title = document.getElementById("EditorTitle");
		// if (title) {
		// 	title.style.height = "45px";
		// 	title.style.height = title.scrollHeight + "px";
		// }
	}

	handleDeleteSearch = (res) => {
		// res is the result from the ConfirmDelete modal. true=delete, false=cancel
		this.setState({ modalOpen: false }); // always close modal, then handle delete

		console.log("we received: " + res);

		if (!res) return;

		this.props.call("searches.remove", this.props.search._id); // delete search
		this.props.call("searchResults.remove", this.props.search._id); // dleete search resutls
		this.props.call("agenda.cancel", this.props.search._id); // cancel agenda job
		Session.set("selectedSearchId", "");
	};

	handleChange = (name) => (event) => {
		this.setState({
			[name]: event.target.value
		});
	};

	render() {
		if (this.props.selectedSearchId && this.props.search) {
			return (
				<div className="editor">
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
						onChange={handleTitleChange.bind(this)}
						margin="normal"
					/>
					<TextField
						id="price"
						label="Price"
						variant="outlined"
						InputLabelProps={{
							classes: {
								root: "editor-textfield-label"
							}
						}}
						InputProps={{
							classes: {
								input: "editor-textfield-input"
							}
						}}
						value={this.state.price}
						onChange={handleChange.bind(this, "price")}
						margin="normal"
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={this.state.auction}
								onChange={handleChecked.bind(this, "auction")}
								classes={{
									root: "checkbox-unchecked",
									checked: "checkbox-checked"
								}}
							/>
						}
						label="Auction"
						classes={{
							label: "editor-formcontrollabel-label"
						}}
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={this.state.auctionBIN}
								onChange={handleChecked.bind(
									this,
									"auctionBIN"
								)}
								classes={{
									root: "checkbox-unchecked",
									checked: "checkbox-checked"
								}}
							/>
						}
						label="Auction W/BIN"
						classes={{
							label: "editor-formcontrollabel-label"
						}}
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={this.state.fixedPrice}
								onChange={handleChecked.bind(
									this,
									"fixedPrice"
								)}
								classes={{
									root: "checkbox-unchecked",
									checked: "checkbox-checked"
								}}
							/>
						}
						label="Fixed Price"
						classes={{
							label: "editor-formcontrollabel-label"
						}}
					/>
					<div className="editor-button-div">
						<Button
							className="button button-secondary"
							onClick={() => this.setState({ modalOpen: true })}
						>
							<Delete />
							Delete
						</Button>
						<Button
							className="button button-secondary"
							onClick={saveSearch.bind(this)}
						>
							<Save />
							Save
						</Button>
					</div>
					<ConfirmDelete
						isOpen={this.state.modalOpen}
						type={"search"}
						callback={this.handleDeleteSearch}
					/>
				</div>
			);
		} else {
			// we have nothing
			return (
				<div className="editor">
					<p className="editor-message">
						{" "}
						Pick or create a team to get started.
					</p>
				</div>
			);
		}
	}
}

// function handleBodyChange(e) {
// 	var body = e.target.value;
// 	this.setState({ body });
// 	// this.props.call("searches.update", this.props.search._id, { body });
// }

function handleChange(name, e) {
	this.setState({
		[name]: e.target.value
	});
}

function handleChecked(name, e) {
	this.setState({
		[name]: e.target.checked
	});
}

function handleTitleChange(e) {
	// resize text area
	// e.target.style.height = "auto";
	// e.target.style.height = e.target.scrollHeight + "px";

	var title = e.target.value;
	this.setState({ title });
	// this.props.call("searches.update", this.props.search._id, { title });
}

function saveSearch(e) {
	this.props.call("searches.update", this.props.search._id, {
		title: this.state.title,
		price: this.state.price,
		auction: this.state.auction,
		auctionBIN: this.state.auctionBIN,
		fixedPrice: this.state.fixedPrice
	});

	this.props.call("searchResults.clear", this.props.search._id);
	this.props.call("agenda.update", this.props.search._id);
}

SearchEditor.propTypes = {
	search: PropTypes.object,
	selectedSearchId: PropTypes.string,
	call: PropTypes.func.isRequired
};

export default createContainer(() => {
	var selectedSearchId = Session.get("selectedSearchId");

	return {
		selectedSearchId,
		search: null,
		team: Teams.findOne({ _id: null }),
		call: Meteor.call
	};
}, SearchEditor);
