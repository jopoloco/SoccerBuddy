import React from "react";
import PropTypes from "prop-types";
import { createContainer } from "meteor/react-meteor-data";

import { Grid, Paper } from "@material-ui/core";

export class Item extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			example: "example"
		};
	}

	handleImageErrored = () => {
		this.setState({ imageStatus: "failed to load" });
	};

	render() {
		const item = this.props.item;
		const imageId = item.itemId + "_image";

		function resizeImage() {
			const img = document.getElementById(imageId);

			if (img.height > img.width) {
				img.style.height = "100%";
				img.style.width = "auto";
			} else {
				img.style.height = "auto";
				img.style.width = "100%";
			}
		}

		return (
			<div className="item" onClick={() => window.open(item.url)}>
				<Grid
					container
					spacing={16}
					className="card-grid"
					direction="column"
					justify="center"
					alignItems="center"
				>
					<Grid item xs className="item-image-div">
						<img
							id={imageId}
							src={item.image}
							onLoad={resizeImage}
							onError={this.handleImageErrored}
						/>
					</Grid>
					<Grid item xs className="item-text">
						<Paper className="card-paper">{item.title}</Paper>
					</Grid>
					<Grid item xs className="item-text">
						<Paper className="card-paper">{item.condition}</Paper>
					</Grid>
					<Grid item xs className="item-text">
						<Paper className="card-paper">
							{item.auctionPrice}
						</Paper>
					</Grid>
					{/* <Grid item xs className="item-text">
						<Paper className="card-paper">{item.buyPrice}</Paper>
					</Grid> */}
					<Grid item xs className="item-text">
						<Paper className="card-paper">{item.timeLeft}</Paper>
					</Grid>
				</Grid>
			</div>
		);
	}
}

Item.propTypes = {
	// title: PropTypes.string.isRequired
	item: PropTypes.object
};

export default createContainer(() => {
	return {
		// anything returned in here is passed into the component down below
		// exampleProp
	};
}, Item);
