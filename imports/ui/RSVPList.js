import React from "react";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Accounts } from "meteor/accounts-base";
import { createContainer } from "meteor/react-meteor-data";

import { Delete, Save, Comment, FilterList } from "@material-ui/icons";
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
	Table,
	TableBody,
	TableRow,
	TableCell,
	TableSortLabel,
	TableHead,
	Toolbar,
	Tooltip,
	Typography
} from "@material-ui/core";

import { Games } from "../api/games";

const rows = [
	{
		id: "name",
		numeric: false,
		disablePadding: true,
		label: "Dessert (100g serving)"
	},
	{ id: "calories", numeric: true, disablePadding: false, label: "Calories" },
	{ id: "fat", numeric: true, disablePadding: false, label: "Fat (g)" },
	{ id: "carbs", numeric: true, disablePadding: false, label: "Carbs (g)" },
	{
		id: "protein",
		numeric: true,
		disablePadding: false,
		label: "Protein (g)"
	}
];

let counter = 0;
function createData(name, calories, fat, carbs, protein) {
	counter += 1;
	return { id: counter, name, calories, fat, carbs, protein };
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
					{rows.map((row) => {
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
									title="Sort"
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
	const { numSelected } = props;

	return (
		<Toolbar className="rsvp-toolbar">
			<div className="rsvp-toolbar-div">
				{numSelected > 0 ? (
					<Typography color="inherit" variant="subtitle1">
						{numSelected} selected
					</Typography>
				) : (
					<Typography variant="h6" id="tableTitle">
						Nutrition
					</Typography>
				)}
			</div>
			<div className="spacer" />
			<div className="actions">
				{numSelected > 0 ? (
					<Tooltip title="Delete">
						<IconButton aria-label="Delete">
							<Delete />
						</IconButton>
					</Tooltip>
				) : (
					<Tooltip title="Filter list">
						<IconButton aria-label="Filter list">
							<FilterList />
						</IconButton>
					</Tooltip>
				)}
			</div>
		</Toolbar>
	);
};

EnhancedTableToolbar.propTypes = {
	numSelected: PropTypes.number.isRequired
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
			data: [
				createData("Cupcake", 305, 3.7, 67, 4.3),
				createData("Donut", 452, 25.0, 51, 4.9),
				createData("Eclair", 262, 16.0, 24, 6.0),
				createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
				createData("Gingerbread", 356, 16.0, 49, 3.9),
				createData("Honeycomb", 408, 3.2, 87, 6.5),
				createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
				createData("Jelly Bean", 375, 0.0, 94, 0.0),
				createData("KitKat", 518, 26.0, 65, 7.0),
				createData("Lollipop", 392, 0.2, 98, 0.0),
				createData("Marshmallow", 318, 0, 81, 2.0),
				createData("Nougat", 360, 19.0, 9, 37.0),
				createData("Oreo", 437, 18.0, 63, 4.0)
			]
		};
	}

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

		if (this.props.game) {
			this.setState({ title: this.props.game.title });
		}
	}

	render() {
		const { data, order, orderBy, selected } = this.state;

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
						<EnhancedTableToolbar numSelected={selected.length} />
						<div className="rsvp-table-wrapper">
							<Table className="rsvp-table">
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
													padding="none"
												>
													{n.name}
												</TableCell>
												<TableCell numeric>
													{n.calories}
												</TableCell>
												<TableCell numeric>
													{n.fat}
												</TableCell>
												<TableCell numeric>
													{n.carbs}
												</TableCell>
												<TableCell numeric>
													{n.protein}
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

RSVPList.propTypes = {
	game: PropTypes.object
};

export default createContainer(() => {
	Meteor.subscribe("games");
	return {
		game: Games.findOne({ _id: Session.get("selectedEventId") })
	};
}, RSVPList);
