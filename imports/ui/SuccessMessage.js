import React from "react";
import PropTypes from "prop-types";
import { Cancel, Delete } from "@material-ui/icons";
import { Button, Grid, Modal } from "@material-ui/core";

export default class SuccessMessage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalOpen: this.props.isOpen,
			delete: false,
			type: this.props.type
		};
	}

	static triggerMessage() {
		// set success message
		var sn = document.getElementById("savedNotification");
		sn.classList.toggle("saved-visible", true);
		setTimeout(() => sn.classList.toggle("saved-visible", false), 1000);
	}

	render() {
		return (
			<div id="savedNotification" className="saved">
				<p>{this.props.message}</p>
			</div>
		);
	}
}

SuccessMessage.propTypes = {
	message: PropTypes.string.isRequired
};
