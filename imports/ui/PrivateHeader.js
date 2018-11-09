import React from "react";
import { Redirect } from "react-router";
import PropTypes from "prop-types";
import { Accounts } from "meteor/accounts-base";
import { createContainer } from "meteor/react-meteor-data";
import { Session } from "meteor/session";
import { Link } from "react-router-dom";

import TeamSelect from "./TeamSelect";

export const PrivateHeader = (props) => {
	var navImageSrc = props.isNavOpen ? "/images/x.svg" : "/images/bars.svg";
	return (
		<div className="header">
			<div className="header_content">
				<img
					className="header_navToggle"
					src={navImageSrc}
					onClick={() => props.handleNavClick()}
				/>
				<Link className="header_title" to="/dashboard">
					{props.title}
				</Link>
				<TeamSelect />
				<div>
					<Link className="headerLinkButton" to="/account">
						Account
					</Link>
					{/* <Link className="headerLinkButton" to="/teams">
						Teams
					</Link> */}
					<Link className="headerLinkButton" to="/coach">
						Coach
					</Link>
					<Link className="headerLinkButton" to="/forum">
						Forum
					</Link>
					<button
						className="headerLinkButton"
						onClick={() => props.handleLogout()}
					>
						Logout
					</button>
				</div>
			</div>
		</div>
	);
};

function handleLogout() {
	Accounts.logout();
}

function handleNavClick() {
	var curNav = Session.get("isNavOpen");
	Session.set("isNavOpen", !curNav);
}

PrivateHeader.propTypes = {
	title: PropTypes.string.isRequired,
	handleLogout: PropTypes.func.isRequired,
	handleNavClick: PropTypes.func.isRequired,
	isNavOpen: PropTypes.bool.isRequired
};

export default createContainer(() => {
	return {
		// anything returned in here is passed into the component down below
		handleLogout,
		handleNavClick,
		isNavOpen: Session.get("isNavOpen")
	};
}, PrivateHeader);

// export default PrivateHeader;
