import React from "react";
import PropTypes from "prop-types";
import { createContainer } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";

import Item from "./Item";
import ItemListEmpty from "./ItemListEmpty";
import { Searches } from "../api/searches";

const MAX_LENGTH = 30;

export class ItemList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			items: [],
			error: "no results available",
			total: 0
		};

		updateItems.bind(this)(this.props);
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props != prevProps) {
			updateItems.bind(this)(this.props);
		}
	}

	render() {
		if (this.state.items.length > 0) {
			var errorComp = undefined;
			if (this.state.error != "") {
				errorComp = (
					<span className="item-list-error">
						Error: {this.state.error}
					</span>
				);
			}
			return (
				<div className="item-list-container">
					<span className="item-list-total">
						Total: {this.state.total}
					</span>
					{errorComp}
					<div className="item-list">
						{this.state.items.map((item, i) => {
							var key = i + "-" + item.itemId;
							return <Item key={key} item={item} />;
						})}
					</div>
				</div>
			);
		} else {
			return <ItemListEmpty msg={this.state.error} />;
		}
	}
}

function updateItems(props) {
	props.call("search.compile", props.selectedSearchId, (err, res) => {
		if (res) {
			if (res.results.length > MAX_LENGTH) {
				res.results = res.results.splice(0, MAX_LENGTH);
			}
			this.setState({
				items: res.results,
				total: res.total,
				error: res.error
			});
		} else if (err) {
			// console.log("Error: " + err);
			this.setState({
				items: [],
				error: err.message
			});
		}
	});
}

ItemList.propTypes = {
	call: PropTypes.func.isRequired,
	selectedSearchId: PropTypes.string,
	search: PropTypes.object.isRequired,
	updateToken: PropTypes.number
};

export default createContainer(() => {
	var searchId = Session.get("selectedSearchId");
	return {
		call: Meteor.call,
		selectedSearchId: searchId,
		search: Searches.findOne({ _id: searchId })
	};
}, ItemList);
