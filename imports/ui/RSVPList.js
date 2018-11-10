// import React from "react";
// import PropTypes from "prop-types";
// import { createContainer } from "meteor/react-meteor-data";

// import { Delete, Save, Comment } from "@material-ui/icons";
// import {
// 	Button,
// 	Checkbox,
// 	IconButton,
// 	FormControlLabel,
// 	List,
// 	ListItem,
// 	ListSubheader,
// 	ListItemSecondaryAction,
// 	ListItemText,
// 	TextField
// } from "@material-ui/core";

// const styles = {
// 	root: {
// 		width: "100%",
// 		maxWidth: 360
// 	}
// };

// export class MemberList extends React.Component {
// 	state = {
// 		checked: [0]
// 	};

// 	handleToggle = (value) => () => {
// 		const { checked } = this.state;
// 		const currentIndex = checked.indexOf(value);
// 		const newChecked = [...checked];

// 		if (currentIndex === -1) {
// 			newChecked.push(value);
// 		} else {
// 			newChecked.splice(currentIndex, 1);
// 		}

// 		this.setState({
// 			checked: newChecked
// 		});
// 	};

// 	render() {
// 		var requests = [0, 1, 2, 3];
// 		return (
// 			<div className="memberList-div">
// 				<List className="">
// 					<ListSubheader className="memberList-header">REQUESTS</ListSubheader>
// 					{requests.map((request, i) => (
// 						<div key={request}>
// 							<ListItem
// 								className="memberList-item"
// 								role={undefined}
// 								dense
// 								button
// 								onClick={this.handleToggle(request)}
// 							>
// 								<Checkbox
// 									checked={
// 										this.state.checked.indexOf(request) !== -1
// 									}
// 									tabIndex={-1}
// 									disableRipple
// 								/>
// 								<ListItemText
// 									className="memberList-item-text"
// 									primary={`Line item ${request + 1}`}
// 								/>
// 								<ListItemSecondaryAction>
// 									<IconButton aria-label="Comments">
// 										<Comment />
// 									</IconButton>
// 								</ListItemSecondaryAction>
// 							</ListItem>
// 						</div>
// 					))}
// 				</List>
// 			</div>
// 		);
// 	}
// }

// MemberList.propTypes = {};

// export default createContainer(() => {
// 	return {
// 		// anything returned in here is passed into the component down below
// 		// ...
// 	};
// }, MemberList);
