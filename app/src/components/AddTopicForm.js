import React from 'react';
import {
    Box,
    Button,
    Control,
    Field,
    Icon as FormIcon,
    Input,
    Label,
} from 'bloomer';

import { addTopic } from '../utils/http';


const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 30;


export default class AddTopicForm extends React.Component {
    state = {
        name: null,
        isValidName: false
    };

    isValidName = name => (
        MIN_NAME_LENGTH < name.length < MAX_NAME_LENGTH
        && !this.props.topics.map(feed => feed.name).includes(name)
    );

    updateName = ({ target }) => this.setState({
        name: target.value,
        isValidName: this.isValidName(target.value)
    });

    submit = () => addTopic(this.state.name).then(() => this.props.close());

    render() {
        return (
            <Box>
                <Field><Label>Add a new topic</Label></Field>
                <Field hasAddons={'right'}>
                    <Control className={'is-expanded'}>
                        <Input
                            className={'is-fullwidth'}
                            onChange={this.updateName}
                            placeholder={'New topic name...'}
                        />
                    </Control>
                    <Control>
                        <Button
                            disabled={!this.state.isValidName}
                            onClick={this.submit}
                        >
                            Add
                        </Button>
                    </Control>
                </Field>
            </Box>
        );
    }
}
