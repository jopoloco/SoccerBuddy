import React from "react";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";
import { createContainer } from "meteor/react-meteor-data";
import { Teams } from "../api/teams";
import { Session } from "meteor/session";

import { AddCircle, Delete, Save, Comment } from "@material-ui/icons";
import {
	Button,
	Checkbox,
	IconButton,
	FormControlLabel,
	List,
	ListItem,
	ListSubheader,
	ListItemSecondaryAction,
	ListItemText,
	TextField
} from "@material-ui/core";

import RequestItem from "./RequestItem";
import MemberItem from "./MemberItem";
import AddMemberModal from "./AddMemberModal";

export class MemberList extends React.Component {
	state = {
		checked: [0],
		addMemberModalOpen: false
	};

	handleToggle = (value) => () => {
		const { checked } = this.state;
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		this.setState({
			checked: newChecked
		});
	};

	addMemberCallback = () => {
		this.setState({ addMemberModalOpen: false });
	};

	render() {
		if (!this.props.team) {
			return (
				<div className="memberList-div">
					<span>Team not found!</span>
				</div>
			);
		}

		var requestsTable = (
			<div className="memberList-item-empty">No requests found</div>
		);
		var membersTable = (
			<div className="memberList-item-empty">No members found</div>
		);

		if (this.props.team.requests.length > 0) {
			requestsTable = this.props.team.requests.map((request, i) => (
				<RequestItem key={request} userId={request} />
			));
		}

		if (this.props.team.members.length > 0) {
			membersTable = this.props.team.members.map((member, i) => (
				<MemberItem key={member} userId={member} />
			));
		}

		return (
			<div className="memberList-div">
				<List className="">
					<ListSubheader className="memberList-header">
						REQUESTS
					</ListSubheader>
					{requestsTable}
					<ListSubheader className="memberList-header">
						MEMBERS
						<IconButton
							aria-label="Add Member"
							className="deleteMember"
							onClick={() =>
								this.setState({ addMemberModalOpen: true })
							}
						>
							<AddCircle />
						</IconButton>
					</ListSubheader>
					{membersTable}
				</List>
				<AddMemberModal
					isOpen={this.state.addMemberModalOpen}
					callback={this.addMemberCallback}
				/>
			</div>
		);
	}
}

MemberList.propTypes = {
	team: PropTypes.object
};

export default createContainer(() => {
	return {
		// anything returned in here is passed into the component down below
		team: Teams.findOne({ _id: Session.get("selectedTeamId") })
	};
}, MemberList);
