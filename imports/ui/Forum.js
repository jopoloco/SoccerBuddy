import React from "react";
import { Meteor } from "meteor/meteor";
import { Link } from "react-router-dom";
// import PropTypes from "prop-types";
import { Accounts } from "meteor/accounts-base";
import { createContainer } from "meteor/react-meteor-data";

export class Forum extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: ""
		};
	}

	componentDidMount() {
		var self = this;
		var userId = Meteor.userId();
		Meteor.call("users.findById", userId, function(err, user) {
			if (err) {
				alert(err);
			}
		});
	}

	onSubmit(e) {
		e.preventDefault();
		return;
	}

	render() {
		return (
			<div className="boxedView">
				<div className="boxedView_box">
					<h1>Team Forum</h1>

					<p id="errorP">
						This feature has not yet been implemented. Please check
						back soon!
					</p>
				</div>
			</div>
		);
	}
}

Forum.propTypes = {
	// updateUser: PropTypes.func.isRequired
};

export default createContainer(() => {
	return {};
}, Forum);
