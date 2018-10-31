import {Meteor} from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom';
import {createContainer} from 'meteor/react-meteor-data';

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ''
    };
  }

  onSubmit(e) {
    e.preventDefault();

    var email = this.refs.email.value.trim();
    var password = this.refs.password.value.trim();

    this.props.loginWithPassword({email}, password, (err) => {
      if (err) {
        this.setState({error: 'Unable to login. Verify email and password.'});
      }
      else {
        this.setState({error: ''});
        <Redirect to="/dashboard"/>
      }
    });
  }

  render() {
    return (
        <div className="boxedView">
          <div className="boxedView_box">
            <h1>Login</h1>

            {this.state.error ? <p id="errorP">{this.state.error}</p> : undefined }

            <form className="boxedView_form" onSubmit={this.onSubmit.bind(this)} noValidate>
              <input type="email" ref="email" name="email" placeholder="Email"/>
              <input type="password" ref="password" name="password" placeholder="Password"/>
              <button className="button">Login</button>
            </form>

            <Link to="/signup">Need to create an account?</Link>
          </div>
        </div>
    )
  }
}

Login.propTypes = {
  loginWithPassword: PropTypes.func.isRequired
};

export default createContainer(() => {
  return {
    loginWithPassword: Meteor.loginWithPassword
  };
}, Login);