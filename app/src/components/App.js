import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import 'bulma/css/bulma.css';

import { loginUser } from '../actions/auth';

import './App.css';

import Login from './Login';


class App extends React.Component {
    render() {
        const { dispatch, isAuthenticated, user, error } = this.props;
        return (
            <BrowserRouter>
                <div>
                    <Route
                        exact
                        path="/"
                        render={() => (<div><p>Logged out view</p></div>)}
                    />
                    <Route
                        exact
                        path='/login'
                        render={() => (
                            <Login
                                error={error}
                                isAuthenticated={isAuthenticated}
                                onLoginClick={(creds) => dispatch(loginUser(creds))}
                            />
                        )}
                    />
                </div>
            </BrowserRouter>
        );
    }
}

App.propTypes = {
    dispatch: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    user: PropTypes.object,
    error: PropTypes.object
};

function mapStateToProps(state) {
    const { auth } = state;
    const { isAuthenticated, user, error } = auth;
    return { isAuthenticated, user, error };
}

export default connect(mapStateToProps)(App);

