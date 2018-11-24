import React from "react";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { createContainer } from "meteor/react-meteor-data";
import { Teams } from "../api/teams";
import { history } from "../routes/AppRouter";

import ConfirmDelete from "./ConfirmDelete";
import MemberList from "./MemberList";
import GameList from "./GameList";

import { Delete, Save } from "@material-ui/icons";
import {
	Button,
	Checkbox,
	FormControlLabel,
	TextField
} from "@material-ui/core";

const TEAM = "team";
const MEMBER = "member";
const REQUEST = "request";
const GAME = "game";

export class Coach extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: "",
			title: "No team selected",
			code: "---",
			coachId: undefined,
			deleteModalOpen: false,
			deleteType: TEAM,
			deleteId: undefined,
			disabled: true
		};
		this.teamNameRef = React.createRef();
		this.coachRef = React.createRef();
	}

	componentDidMount() {
		this.updateComponent(this.props.team, this);
	}

	componentDidUpdate(prevProps, prevState) {
		// if (prevProps.selectedTeamTitle != this.props.selectedTeamTitle) {
		// 	this.setState({
		// 		title: "Manage '" + this.props.selectedTeamTitle + "'",
		// 		code: "code: " + this.props.selectedTeamId
		// 	});
		// }

		if (prevProps.team != this.props.team) {
			this.updateComponent(this.props.team, this);
		}
	}

	updateComponent(team, self) {
		if (!team) {
			self.coachRef.current.value = null;
			self.teamNameRef.current.value = null;
			self.setState({
				coachId: undefined,
				title: "No team selected",
				code: "---",
				disabled: true
			});

			document
				.getElementById("coachDiv")
				.classList.toggle("coach-hidden", true);

			return;
		}

		if (team.coachId != Meteor.userId()) {
			history.push("/dashboard");
		}

		Meteor.call("users.findById", team.coachId, function(err, res) {
			if (err) {
				alert(err);
			}

			if (res && res.emails.length > 0) {
				self.coachRef.current.value =
					res.fName + " " + res.lName + "; (not working yet)";
				self.setState({ coachId: res._id });
			}
		});

		this.setState({
			title: "Manage '" + team.title + "'",
			code: "code: " + team._id,
			disabled: false
		});

		document
			.getElementById("coachDiv")
			.classList.toggle("coach-hidden", false);

		self.teamNameRef.current.value = team.title;
	}

	onSubmit(e) {
		e.preventDefault();
		this.setState({ error: "" });

		var self = this;
		var teamTitle = this.teamNameRef.current.value.trim();
		var coach = this.coachRef.current.value.trim();
		var coachId = this.state.coachId;

		// if (
		// 	oldPassword != "" &&
		// 	newPassword != "" &&
		// 	(oldPassword.length < 9 || newPassword < 9)
		// ) {
		// 	return this.setState({
		// 		error: "Password length must be greater than 8 characters"
		// 	});
		// }

		// if (phoneNumber != "" && phoneNumber.length != 10) {
		// 	return this.setState({
		// 		error: "Phone number must be 10 digits long"
		// 	});
		// }

		var updates = {
			title: teamTitle,
			coachId: coachId
		};

		Meteor.call(
			"teams.update",
			Session.get("selectedTeamId"),
			updates,
			function(err, res) {
				if (err) {
					alert(err);
				}

				if (res) {
					Session.set("selectedTeamTitle", teamTitle);
				}
			}
		);
	}

	confirmDeleteFunc = (type, id) => {
		this.setState({
			deleteModalOpen: true,
			deleteType: type,
			deleteId: id
		});
	};

	deleteFunc = (res) => {
		// ... call proper delete function based on type. use id for delete method
		var type = this.state.deleteType;
		var id = this.state.deleteId;
		this.setState({ deleteModalOpen: false });

		if (!res) {
			return;
		}

		if (type == TEAM) {
			Session.set("selectedTeamId", undefined);
			Session.set("selectedTeamTitle", undefined);
			Meteor.call("teams.remove", id);
		}
	};

	render() {
		return (
			<div className="boxedView">
				<div className="coach-box">
					<h1>{this.state.title}</h1>
					<h2>{this.state.code}</h2>

					{this.state.error ? (
						<p id="errorP">{this.state.error}</p>
					) : (
						undefined
					)}

					<div id="coachDiv" className="coach-hidden coach-div">
						<div className="coach-sub-div">
							<span className="coach-sub-div-title">Details</span>
							<form
								className="boxedView_form"
								onSubmit={this.onSubmit.bind(this)}
								noValidate
							>
								<input
									className="boxview-form-input"
									type="text"
									ref={this.teamNameRef}
									name="teamName"
									placeholder="Team Name"
								/>
								<input
									className="boxview-form-input"
									type="text"
									ref={this.coachRef}
									name="coach"
									placeholder="Coach (not working yet)"
									disabled={true}
								/>
								<button
									className="button"
									disabled={this.state.disabled}
								>
									Update Team
								</button>
							</form>
							<Link to="/dashboard">
								Cancel changes and return to dashboard
							</Link>
						</div>
						<div className="coach-sub-div">
							<span className="coach-sub-div-title">Members</span>
							<MemberList />
						</div>
						<div className="coach-sub-div">
							<span className="coach-sub-div-title">Games</span>
							<GameList />
						</div>
						<Button
							onClick={() =>
								this.confirmDeleteFunc(
									TEAM,
									Session.get("selectedTeamId")
								)
							}
							className="button button-secondary menu-button"
							disabled={this.state.disabled}
						>
							Delete Team
						</Button>
					</div>
				</div>
				<ConfirmDelete
					isOpen={this.state.deleteModalOpen}
					type={this.state.deleteType}
					callback={this.deleteFunc}
				/>
			</div>
		);
	}
}

Coach.propTypes = {
	team: PropTypes.object
};

export default createContainer(() => {
	return {
		team: Teams.findOne({ _id: Session.get("selectedTeamId") })
	};
}, Coach);
