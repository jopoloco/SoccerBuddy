import { Meteor } from "meteor/meteor";
import React from "react";
import { Redirect } from "react-router";
import { Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Session } from "meteor/session";

import { MuiThemeProvider } from "@material-ui/core/styles";
import { create } from "jss";
import JssProvider from "react-jss/lib/JssProvider";
import { createGenerateClassName, jssPreset } from "@material-ui/core/styles";
import "../../client/main.scss";

import customTheme from "../client/styles/muiTheme";
import Dashboard from "../ui/Dashboard";
import Login from "../ui/Login";
import NotFound from "../ui/NotFound";
import Signup from "../ui/Signup";
import Account from "../ui/Account";
import Coach from "../ui/Coach";
import Forum from "../ui/Forum";
import TeamSelect from "../ui/TeamSelect";
import EditGame from "../ui/EditGame";
import Admin from "../ui/Admin";
import Page from "../ui/Page";

const unauthenticatedPages = ["/", "/signup"];
const authenticatedPages = [
	"/dashboard",
	"/account",
	"/coach",
	"/forum",
	"/edit/game"
];
export const history = createBrowserHistory();

const styleNode = document.createComment("insertion-point-jss");
document.head.insertBefore(styleNode, document.head.firstChild);

const generateClassName = createGenerateClassName();
const jss = create(jssPreset());
jss.options.insertionPoint = "insertion-point-jss";

function onEnter(isPublic, Component) {
	ClearNote();
	if (isPublic) {
		if (Meteor.userId()) {
			return <Redirect to="/dashboard" />;
		} else {
			return <Component />;
		}
	} else {
		if (!Meteor.userId()) {
			return <Redirect to="/" />;
		} else {
			return <Page component={Component} />;
		}
	}
}

function onEnterNotePage(props, Component) {
	if (!Meteor.userId()) {
		ClearNote();
		return <Redirect to="/" />;
	} else {
		Session.set("selectedNoteId", props.match.params.id);
		return <Component />;
	}
}

function onEnterEditGame(props, Component) {
	if (!Meteor.userId() || !Session.get("selectedTeamId")) {
		// ...
		return <Redirect to="/" />;
	} else {
		Session.set("selectedEventId", props.match.params.id);
		return <Page component={Component} />;
	}
}

function ClearNote() {
	Session.set("selectedNoteId", undefined);
}

export const onAuthChange = (isAuthenticated) => {
	const pathname = history.location.pathname;
	const isUnauthenticatedPage = unauthenticatedPages.includes(pathname);
	const isAuthenticatedPage = authenticatedPages.includes(pathname);

	if (isAuthenticated && isUnauthenticatedPage) {
		history.replace("/dashboard");
	} else if (!isAuthenticated && isAuthenticatedPage) {
		ClearNote();
		history.replace("/");
	}
};

export const AppRouter = (
	// this allows us to inject the custom styling from the imported css file above.
	// unfortunate, but, if we don't, the MUI styling takes precedence over our class styling
	<JssProvider jss={jss} generateClassName={generateClassName}>
		<MuiThemeProvider theme={customTheme}>
			<Router history={history}>
				<Switch>
					<Route exact path="/" render={() => onEnter(true, Login)} />
					<Route
						exact
						path="/signup"
						render={() => onEnter(true, Signup)}
					/>
					<Route
						exact
						path="/dashboard"
						render={() => onEnter(false, Dashboard)}
					/>
					<Route
						exact
						path="/dashboard/:id"
						render={(props) => onEnterNotePage(props, Dashboard)}
					/>
					<Route
						exact
						path="/account"
						render={() => onEnter(false, Account)}
					/>
					{/* <Route
						exact
						path="/teams"
						render={() => onEnter(false, TeamSelect)}
					/> */}
					<Route
						exact
						path="/coach"
						render={() => onEnter(false, Coach)}
					/>
					<Route
						exact
						path="/forum"
						render={() => onEnter(false, Forum)}
					/>
					<Route
						exact
						path="/edit/game/:id"
						render={(props) => onEnterEditGame(props, EditGame)}
					/>
					<Route component={NotFound} />
				</Switch>
			</Router>
		</MuiThemeProvider>
	</JssProvider>
);
