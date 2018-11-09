import React from "react";
import PropTypes from "prop-types";
import { createContainer } from "meteor/react-meteor-data";

import PrivateHeader from "./PrivateHeader";

export class Page extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: ""
		};
	}

	render() {
		return (
			<div>
				<PrivateHeader title="Soccer Buddy" />
				<this.props.component />
			</div>
		);
	}
}

Page.propTypes = {
	component: PropTypes.func.isRequired
};

export default createContainer(() => {
	return {};
}, Page);
