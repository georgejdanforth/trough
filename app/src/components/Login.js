import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import {
    Button,
    Card,
    CardContent,
    Column,
    Columns,
    Container,
    Content,
    Control,
    Field,
    Input,
} from 'bloomer';

import errors from '../utils/errors';


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { email: '', password: '' };
    }

    changeValue(event, type) {
        const { value } = event.target;
        this.setState({[type]: value});
    }

    handleClick(event) {
        this.props.onLoginClick({
            email: this.state.email,
            password: this.state.password
        });
    }

    render() {
        if (this.props.isAuthenticated) return (<Redirect to={'/'}/>);

        return (
            <Container isFluid>
                <Columns isCentered>
                    <Column isSize='1/4'>
                        <Card>
                            <CardContent>
                                <Content>
                                    <Field>
                                        <Control>
                                            <Input
                                                placeholder='Email'
                                                onChange={(event) => this.changeValue(event, 'email')}
                                            />
                                        </Control>
                                    </Field>
                                    <Field>
                                        <Control>
                                            <Input
                                                placeholder='Password'
                                                type='password'
                                                onChange={(event) => this.changeValue(event, 'password')}
                                            />
                                        </Control>
                                    </Field>
                                    <Field>
                                        <Control>
                                            <Button
                                                isColor='dark'
                                                className='is-fullwidth'
                                                onClick={(event) => this.handleClick(event)}
                                            >
                                                Log In
                                            </Button>
                                        </Control>
                                    </Field>
                                </Content>
                            </CardContent>
                        </Card>
                    </Column>
                </Columns>
            </Container>
        );
    }

}

Login.propTypes = {
    onLoginClick: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    error: PropTypes.object
};

export default Login;
