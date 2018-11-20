import React from "react";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Accounts } from "meteor/accounts-base";
import { createContainer } from "meteor/react-meteor-data";

import { Games } from "../api/games";

export class EditGame extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: "Undefined"
		};
	}

	componentDidMount() {
		// var self = this;
		// var userId = Meteor.userId();

		if (this.props.game) {
			this.setState({ title: this.props.game.title });
		}
	}

	render() {
		return (
			<div className="boxedView">
				<div className="boxedView_box">
					<h1>{this.state.title}</h1>
					<h2>
						{"selected event id: " + Session.get("selectedEventId")}
					</h2>
				</div>
			</div>
		);
	}
}

EditGame.propTypes = {
	game: PropTypes.object
};

export default createContainer(() => {
	return {
		game: Games.findOne({ _id: Session.get("selectedEventId") })
	};
}, EditGame);
