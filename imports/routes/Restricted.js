import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
// import { withRouter } from 'react-router-dom';
/**
 * Higher-order component (HOC) to wrap restricted pages
 */
export function RestrictedPublic() {
	class RestrictedPublic extends Component {
		componentWillMount() {
			this.checkAuthentication(this.props);
		}
		// componentWillReceiveProps(nextProps) {
		//     if (nextProps.location !== this.props.location) {
		//         this.checkAuthentication(nextProps);
		//     }
		// }
		checkAuthentication(params) {
			const { history } = params;
			// history.replace({ pathname: '/login' });
			if (Meteor.userId()) {
				history.push("/dashboard");
			}
		}
		render() {
			return <RestrictedPublic {...this.props} />;
		}
	}
	return RestrictedPublic;
}

export function RestrictedPrivate() {
	class RestrictedPrivate extends Component {
		componentWillMount() {
			this.checkAuthentication(this.props);
		}
		// componentWillReceiveProps(nextProps) {
		//     if (nextProps.location !== this.props.location) {
		//         this.checkAuthentication(nextProps);
		//     }
		// }
		checkAuthentication(params) {
			const { history } = params;
			// history.replace({ pathname: '/login' });
			if (!Meteor.userId()) {
				history.push("/");
			}
		}
		render() {
			return <RestrictedPrivate {...this.props} />;
		}
	}
	// return withRouter(Restricted);
}
