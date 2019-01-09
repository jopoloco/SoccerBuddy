import React from "react";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Accounts } from "meteor/accounts-base";
import { createContainer } from "meteor/react-meteor-data";

import {
	Delete,
	Save,
	CheckBox,
	CheckBoxOutlineBlank,
	Comment,
	FilterList,
	BluetoothDisabled,
	Sms,
	Mail
} from "@material-ui/icons";
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
	Switch,
	Table,
	TableBody,
	TableRow,
	TableCell,
	TableSortLabel,
	TableHead,
	TextField,
	Toolbar,
	Tooltip,
	Typography
} from "@material-ui/core";

import { Events } from "../api/events";
import { Teams } from "../api/teams";

const ROWS = [
	{ id: "name", disablePadding: false, label: "Player" },
	{ id: "attending", disablePadding: false, label: "Attending?" }
];

const ATTENDING = ["Yes", "No", "Maybe"];

const REQUEST = "Please reply with either YES, NO, or MAYBE";

// var counter = 0;
function createData(_id, name, attending, phoneNumber, email) {
	// counter += 1;
	return { id: _id, name, attending, phoneNumber, email };
}

function desc(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function stableSort(array, cmp) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = cmp(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

function getSorting(order, orderBy) {
	return order === "desc"
		? (a, b) => desc(a, b, orderBy)
		: (a, b) => -desc(a, b, orderBy);
}

class EnhancedTableHead extends React.Component {
	createSortHandler = (property) => (event) => {
		this.props.onRequestSort(event, property);
	};

	render() {
		const {
			onSelectAllClick,
			order,
			orderBy,
			numSelected,
			rowCount
		} = this.props;

		return (
			<TableHead>
				<TableRow>
					<TableCell padding="checkbox">
						<Checkbox
							indeterminate={
								numSelected > 0 && numSelected < rowCount
							}
							checked={numSelected === rowCount}
							onChange={onSelectAllClick}
						/>
					</TableCell>
					{ROWS.map((row) => {
						return (
							<TableCell
								key={row.id}
								numeric={row.numeric}
								padding={
									row.disablePadding ? "none" : "default"
								}
								sortDirection={
									orderBy === row.id ? order : false
								}
							>
								<Tooltip
									title={("Sort by " + row.label).replace(
										"?",
										""
									)}
									placement={
										row.numeric
											? "bottom-end"
											: "bottom-start"
									}
									enterDelay={300}
								>
									<TableSortLabel
										active={orderBy === row.id}
										direction={order}
										onClick={this.createSortHandler(row.id)}
									>
										{row.label}
									</TableSortLabel>
								</Tooltip>
							</TableCell>
						);
					}, this)}
				</TableRow>
			</TableHead>
		);
	}
}

EnhancedTableHead.propTypes = {
	numSelected: PropTypes.number.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	order: PropTypes.string.isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired
};

let EnhancedTableToolbar = (props) => {
	const { selected, callback } = props;

	return (
		<Toolbar className="rsvp-toolbar">
			<div className="rsvp-toolbar-div">
				{selected.length > 0 ? (
					<Typography color="inherit" variant="subtitle1">
						{selected.length} selected
					</Typography>
				) : (
					<Typography variant="h6" id="tableTitle">
						Rollcall
					</Typography>
				)}
			</div>
			<div className="spacer" />
			{/* <div className="actions">
				<Tooltip title="Swap between email and sms">
					<div>
						<IconButton
							aria-label="Sms"
							disabled={selected.length <= 0}
							onClick={callback}
						>
							<Sms />
						</IconButton>
					</div>
				</Tooltip>
			</div> */}
		</Toolbar>
	);
};

EnhancedTableToolbar.propTypes = {
	selected: PropTypes.array.isRequired,
	callback: PropTypes.func.isRequired
};

export class RSVPList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: "Undefined",
			checked: [],
			selected: [],
			order: "asc",
			orderBy: "calories",
			data: [],
			rsvpIsSMS: false,
			smsMessage: "",
			emailMessage: ""
		};
	}

	// handleToggle = (value) => () => {
	// 	const { checked } = this.state;
	// 	const currentIndex = checked.indexOf(value);
	// 	const newChecked = [...checked];

	// 	if (currentIndex === -1) {
	// 		newChecked.push(value);
	// 	} else {
	// 		newChecked.splice(currentIndex, 1);
	// 	}

	// 	this.setState({
	// 		checked: newChecked
	// 	});
	// };

	handleRequestSort = (event, property) => {
		const orderBy = property;
		let order = "desc";

		if (this.state.orderBy === property && this.state.order === "desc") {
			order = "asc";
		}

		this.setState({ order, orderBy });
	};

	handleSelectAllClick = (event) => {
		if (event.target.checked) {
			this.setState((state) => ({
				selected: state.data.map((n) => n.id)
			}));
			return;
		}
		this.setState({ selected: [] });
	};

	handleClick = (event, id) => {
		const { selected } = this.state;
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			);
		}

		this.setState({ selected: newSelected });
	};

	isSelected = (id) => this.state.selected.indexOf(id) !== -1;

	componentDidMount() {
		// var self = this;
		// var userId = Meteor.userId();

		this.updateComponent();
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			this.props.game != prevProps.game ||
			this.props.members != prevProps.members
		) {
			this.updateComponent();
		}
	}

	updateComponent() {
		if (this.props.game) {
			this.setState({ title: this.props.game.title });
		}

		if (this.props.members && this.props.members.length > 0) {
			var self = this;
			Meteor.call("users.findUsersById", this.props.members, function(
				err,
				res
			) {
				if (err) {
					alert(err);
				}

				if (res) {
					var data = res.map((user, i) => {
						var name = user.fName + " " + user.lName;
						var attending = 2;
						var phoneNumber = user.phoneNumber;
						var email =
							user.emails.length > 0
								? user.emails[0].address
								: null;
						self.props.game.rollCall.some(function(obj) {
							if (obj.user == user._id) {
								attending = obj.attending;
								return true;
							}
						});

						return createData(
							user._id,
							name,
							attending,
							phoneNumber,
							email
						);
					});
					self.setState({ data: data });
				}
			});
		}
	}

	sendRSVPRequest = () => {
		const {
			data,
			selected,
			smsMessage,
			emailMessage,
			rsvpIsSMS
		} = this.state;
		var self = this;

		if (selected.length <= 0) {
			alert("No users selected!");
			return;
		}

		var list = selected.map((el, i) => {
			var user = data.filter((obj) => {
				return obj.id == el;
			})[0];
			return {
				name: user.name,
				phoneNumber: user.phoneNumber,
				email: user.email
			};
		});

		for (var i = 0; i < list.length; i++) {
			var { name, phoneNumber, email } = list[i];
			var msg = "";
			if (rsvpIsSMS) {
				if (smsMessage == "") {
					var g = this.props.game;
					var date = g.date.substring(0, 10);
					var time = g.date.substring(11);
					msg =
						"Hello, " +
						name +
						"! Your coach has requested you RSVP for the ";
					msg =
						msg + g.type + " '" + g.title + "' at " + time + " on " + date;
					msg = msg + ", located at '" + g.location + "'";
					msg =
						msg +
						". Please reply with either YES, NO, or MAYBE to this text. Thanks!";
				} else {
					msg = smsMessage; // + "; " + REQUEST;
				}
				Meteor.call("sms.send", msg, phoneNumber, function(err, res) {
					if (err) {
						alert(err);
					}
					if (res) {
						console.log("success!");
						Meteor.call(
							"requests.insert",
							res.phoneNumber,
							self.props.game._id,
							function(err, res) {
								if (err) {
									alert(err);
								}
								if (res) {
									console.log(res);
								}
							}
						);
					}
				});
			} else {
				Meteor.call("email.send", emailMessage, email, function(
					err,
					res
				) {
					if (err) {
						alert(err);
					}
					if (res) {
						console.log("success!");
					}
				});
			}
		}
	};

	handleSwitchChange = (event) => {
		var checked = event.target.checked;
		var sn = document.getElementById("requestNotification");
		sn.classList.toggle("request-visible", checked);

		this.setState({ rsvpIsSMS: checked });
	};

	handleMessageChange = (event) => {
		var msg = event.target.value;
		if (this.state.rsvpIsSMS) {
			if (msg.length > 300) {
				// don't set the message as it is too long
				return;
			}

			this.setState({ smsMessage: msg });
		} else {
			this.setState({ emailMessage: msg });
		}
	};

	render() {
		const { data, order, orderBy, selected } = this.state;

		var rsvpToggle = (
			<div className="rsvp-type-toggle">
				<Tooltip title="Swap between email and sms">
					<FormControlLabel
						value="email"
						label="Email"
						labelPlacement="start"
						control={
							<FormControlLabel
								value="sms"
								control={
									<Switch
										checked={this.state.rsvpIsSMS}
										onChange={this.handleSwitchChange}
										value="rsvpType"
										classes={{
											bar: this.state.rsvpIsSMS
												? "rsvp-toggle-barChecked"
												: "rsvp-toggle-bar",
											icon: "rsvp-toggle-icon",
											iconChecked:
												"rsvp-toggle-iconChecked"
										}}
									/>
								}
								label="SMS"
								labelPlacement="end"
								classes={{
									label: "formControl-right"
								}}
								// onChange={this.handleSwitchChange}
							/>
						}
						classes={{
							label: "formControl-left"
						}}
						// onChange={this.handleSwitchChange}
					/>
					{/* <div>
			<IconButton
				aria-label="Sms"
				disabled={selected.length <= 0}
				onClick={callback}
			>
				<Sms />
			</IconButton>
		</div> */}
				</Tooltip>
			</div>
		);

		var requestNotification = (
			<div id="requestNotification" className="request">
				<span>
					*Please note*: Leave the msg blank to send a request.
				</span>
				<br />
				<span>Only the last request sent to a member is valid.</span>
				{/* <span style={{ color: "black" }}>&quot;{REQUEST}&quot;</span> */}
			</div>
		);

		var CharacterCount = this.state.rsvpIsSMS ? (
			<div className="characterCount-div">
				{"Characters remaining: " +
					(300 - this.state.smsMessage.length)}
			</div>
		) : (
			undefined
		);

		var rsvpArea = (
			<div className="editGame-rsvp-div">
				<div className="rsvp-message-header">
					<span>Compose RSVP Message</span>
					{rsvpToggle}
				</div>
				<div className="editGame-rsvp-message-div">
					{requestNotification}
					<TextField
						id="standard-multiline-static"
						label={
							this.state.rsvpIsSMS
								? "RSVP SMS Message"
								: "RSVP Email Message"
						}
						multiline
						rows="10"
						className="rsvp-message"
						margin="normal"
						variant="outlined"
						InputLabelProps={{
							classes: {
								root: "gameEdit-editor-title-label"
							}
						}}
						InputProps={{
							classes: {
								input: "gameEdit-editor-title-input"
							}
						}}
						value={
							this.state.rsvpIsSMS
								? this.state.smsMessage
								: this.state.emailMessage
						}
						onChange={this.handleMessageChange}
					/>
					{CharacterCount}
					<Button
						className="button button-secondary rsvp-button"
						onClick={this.sendRSVPRequest}
					>
						{this.state.rsvpIsSMS ? (
							<Sms className="icon-left" />
						) : (
							<Mail className="icon-left" />
						)}
						Send Message
					</Button>
				</div>
			</div>
		);

		return (
			<div className="editGame-editor-div">
				<div className="editGame-title-div">
					<h1>{"Modify '" + this.state.title + "' Details"}</h1>
					<h2>
						{"selected event id: " + Session.get("selectedEventId")}
					</h2>
				</div>
				<div className="editGame-body-div">
					<div className="editGame-memberList-div">
						<EnhancedTableToolbar
							selected={selected}
							callback={this.handleSwitchChange}
						/>
						<div className="rsvp-table-wrapper">
							<Table
								className="rsvp-table"
								style={{ tableLayout: "fixed" }}
							>
								<EnhancedTableHead
									numSelected={this.state.selected.length}
									order={order}
									orderBy={orderBy}
									onSelectAllClick={this.handleSelectAllClick}
									onRequestSort={this.handleRequestSort}
									rowCount={data.length}
								/>
								<TableBody>
									{stableSort(
										data,
										getSorting(order, orderBy)
									).map((n) => {
										const isSelected = this.isSelected(
											n.id
										);
										return (
											<TableRow
												hover
												onClick={(event) =>
													this.handleClick(
														event,
														n.id
													)
												}
												role="checkbox"
												aria-checked={isSelected}
												tabIndex={-1}
												key={n.id}
												selected={isSelected}
											>
												<TableCell padding="checkbox">
													<Checkbox
														checked={isSelected}
													/>
												</TableCell>
												<TableCell
													component="th"
													scope="row"
												>
													{n.name}
												</TableCell>
												<TableCell>
													{ATTENDING[n.attending]}
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</div>
					</div>
					{rsvpArea}
				</div>
			</div>
		);
	}
}

RSVPList.propTypes = {
	game: PropTypes.object,
	members: PropTypes.array.isRequired
};

export default createContainer(() => {
	Meteor.subscribe("events");
	Meteor.subscribe("teams");
	var game = Events.findOne({ _id: Session.get("selectedEventId") });
	var team = game ? Teams.findOne({ _id: game.teamId }) : undefined;
	return {
		game: game,
		members: team ? team.members : []
	};
}, RSVPList);
