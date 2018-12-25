import React from "react";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Accounts } from "meteor/accounts-base";
import { createContainer } from "meteor/react-meteor-data";

import { Delete, Save } from "@material-ui/icons";
import {
	AppBar,
	Button,
	Tabs,
	Tab,
	TabContainer,
	TextField
} from "@material-ui/core";

import { Events } from "../api/events";
import Admin from "./Admin";
import RSVPList from "./RSVPList";
import Formation from "./Formation";

const COMPS = [Admin, RSVPList, Formation];

export class EditGame extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: "Undefined",
			component: Admin,
			tab: 0
		};
	}

	componentDidMount() {
		// var self = this;
		// var userId = Meteor.userId();

		if (this.props.game) {
			this.setState({ title: this.props.game.title });
		}
	}

	handleTabChange = (event, value) => {
		this.setState({ tab: value, component: COMPS[value] });
	};

	render() {
		return (
			<div className="editGame-page">
				<AppBar position="static" className="editGame-header">
					<Tabs
						value={this.state.tab}
						onChange={this.handleTabChange}
					>
						<Tab label="Admin" />
						<Tab label="Rollcall" />
						<Tab label="Formation" />
					</Tabs>
				</AppBar>
				<div className="editGame-main">
					<this.state.component />
				</div>
			</div>
		);
	}
}

EditGame.propTypes = {
	game: PropTypes.object
};

export default createContainer(() => {
	Meteor.subscribe("events");
	return {
		game: Events.findOne({ _id: Session.get("selectedEventId") })
	};
}, EditGame);
