import React from "react";
import PropTypes from "prop-types";
import { Cancel, Delete } from "@material-ui/icons";
import { Button, Grid, Modal } from "@material-ui/core";

export default class GameCreate extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalOpen: this.props.isOpen,
			delete: false,
			type: this.props.type
		};
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.modalOpen != this.props.isOpen) {
			this.setState({ modalOpen: this.props.isOpen });
		}

		if (prevState.type != this.props.type) {
			this.setState({ type: this.props.type });
		}
	}

	render() {
		var ProjectModal = (
			<Modal
				// onClose={handleModalClose.bind(this)} // leaving this commented so you can only exit via buttons
				open={this.state.modalOpen}
			>
				<div className="delete-modal-div">
					<Grid
						container
						direction="column"
						justify="center"
						alignItems="stretch"
						spacing={24}
						className="delete-modal-grid-container"
					>
						<Grid item>
							<span className="delete-modal-title">
								Are you sure you want to delete this{" "}
								{this.state.type}?
							</span>
						</Grid>
						<Grid
							item
							container
							direction="row"
							justify="center"
							alignItems="center"
							spacing={24}
						>
							<Grid item className="delete-modal-button">
								<Button
									onClick={onButtonClick.bind(this, true)}
									className=""
									classes={{
										label: "delete-modal-button-label"
									}}
								>
									<Delete className="icon-left" />
									Yes
								</Button>
							</Grid>
							<Grid item className="delete-modal-button">
								<Button
									onClick={onButtonClick.bind(this, false)}
									className=""
									classes={{
										label: "delete-modal-button-label"
									}}
								>
									<Cancel className="icon-left" />
									Cancel
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</div>
			</Modal>
		);

		return <div>{ProjectModal}</div>;
	}
}

GameCreate.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	type: PropTypes.string.isRequired
};

// function handleModalClose() {
// 	this.setState({
// 		modalOpen: false
// 	});
// 	this.props.callback(false);
// }

function onButtonClick(result) {
	this.props.callback(result);
	this.setState({ modalOpen: false });
}
