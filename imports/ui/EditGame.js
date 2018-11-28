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

import { Games } from "../api/games";
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
		var menu = (
			<div className="pageContent-sidebar">
				<div className="editGame-menu-div">
					MENU!
					<Button
						onClick={() => this.setState({ component: Admin })}
						className="button button-secondary menu-button"
						disabled={this.state.disabled}
					>
						Admin
					</Button>
					<Button
						onClick={() => this.setState({ component: RSVPList })}
						className="button button-secondary menu-button"
						disabled={this.state.disabled}
					>
						RSVP
					</Button>
					<Button
						onClick={() => this.setState({ component: Formation })}
						className="button button-secondary menu-button"
						disabled={this.state.disabled}
					>
						Formation
					</Button>
				</div>
			</div>
		);

		return (
			<div className="editGame-page">
				{/* {menu} */}
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
				{/* {this.state.tab === 0 && <TabContainer>Item One</TabContainer>}
				{this.state.tab === 1 && <TabContainer>Item Two</TabContainer>}
				{this.state.tab === 2 && <TabContainer>Item Three</TabContainer>} */}
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
	Meteor.subscribe("games");
	return {
		game: Games.findOne({ _id: Session.get("selectedEventId") })
	};
}, EditGame);
