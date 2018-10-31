import React from "react";
import PropTypes from "prop-types";
import { createContainer } from "meteor/react-meteor-data";

export class ItemListEmpty extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: this.props.msg
		};
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.msg != prevProps.msg) {
			this.setState({ error: this.props.msg });
		}
	}

	render() {
		return <div className="itemListEmpty">{this.state.error}</div>;
	}
}

ItemListEmpty.propTypes = {
	msg: PropTypes.string
};

export default createContainer(() => {
	return {
		// anything returned in here is passed into the component down below
		// exampleProp
	};
}, ItemListEmpty);
