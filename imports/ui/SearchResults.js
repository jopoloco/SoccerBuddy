import React from "react";
import PropTypes from "prop-types";
import { createContainer } from "meteor/react-meteor-data";
import { Session } from "meteor/session";
import moment from "moment";
import { Meteor } from "meteor/meteor";

import { Refresh } from "@material-ui/icons";
import { Button } from "@material-ui/core";

import ItemList from "./ItemList";

export class SearchResults extends React.Component {
	constructor(props) {
		super(props);

		this.ItemList = React.createRef();

		this.state = {
			title: "",
			lastUpdated: moment().valueOf(),
			searchDisabled: false
		};
	}

	updateSearch = () => {
		this.setState({
			searchDisabled: true,
			lastUpdated: moment().valueOf()
		});
		setTimeout(() => this.setState({ searchDisabled: false }), 5500);
	};

	render() {
		if (this.props.selectedSearchId) {
			return (
				<div className="searchResults">
					<ItemList updateToken={this.state.lastUpdated} />
					<div>
						<Button
							className="button button-secondary"
							disabled={this.state.searchDisabled}
							onClick={this.updateSearch}
						>
							<Refresh className="icon-left" />
							Update search
						</Button>
					</div>
				</div>
			);
		} else {
			// we have nothing
			return (
				<div className="searchResults">
					<p className="results-message">
						{" "}
						Pick or create a search to get started.
					</p>
				</div>
			);
		}
	}
}

SearchResults.propTypes = {
	call: PropTypes.func.isRequired,
	selectedSearchId: PropTypes.string
};

export default createContainer(() => {
	var selectedSearchId = Session.get("selectedSearchId");

	return {
		call: Meteor.call,
		selectedSearchId
	};
}, SearchResults);
