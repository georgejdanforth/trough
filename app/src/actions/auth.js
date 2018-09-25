import jwtDecode from 'jwt-decode';

import errors from '../utils/errors';
import { login } from '../utils/http';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

const requestLogin = (creds) => ({
    type: LOGIN_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    creds
});

const receiveLogin = (creds) => ({
    type: LOGIN_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    creds
});

const loginError = (error) => ({
    type: LOGIN_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    error
});

export function loginUser (creds) {
    return (dispatch) => {
        dispatch(requestLogin(creds));
        return login(creds)
            .then((response) => {
                const { accessToken, refreshToken } = response.data;
                const { identity, user_claims } = jwtDecode(accessToken);
                localStorage.setItem('access_token', accessToken);
                localStorage.setItem('refresh_token', refreshToken);
                dispatch(receiveLogin({ id: identity, email: user_claims.email }));
            })
            .catch((error) =>{
                const { status, data } = error.response;
                let errorType;

                if (status === 400) {
                    errorType = errors.incorrectPassword;
                } else if (status === 404) {
                    errorType = errors.userNotFound;
                } else {
                    errorType = errors.unknown;
                }

                dispatch(loginError({
                    errorType: errorType,
                    message: data.error
                }));
            });
    };
}

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

const requestLogout = () => ({
    type: LOGOUT_REQUEST,
    isFetching: true,
    isAuthenticated: true
});

const receiveLogout = () => ({
    type: LOGOUT_SUCCESS,
    isFetching: false,
    isAuthenticated: false
});

const logoutError = () => ({
    type: LOGOUT_FAILURE,
    isFetching: false,
    isAuthenticated: true
});

export function logoutUser() {
    return (dispatch) => {
        dispatch(requestLogout());
        localStorage.removeItem('access_token');
        dispatch(receiveLogout());
    };
}