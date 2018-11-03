import React from 'react';
import { Box, Field, Label } from 'bloomer';

import ToggleMenu from './ToggleMenu';
import { addToTopics, getTopics } from '../../utils/http';


export default class AddToTopicForm extends React.Component {
    state = {
        topics: [],
    };

    componentDidMount() {
        getTopics(this.props.feed.id).then(({data}) => this.setState({ topics: data }));
    }

    submit = ids => addToTopics(ids, [this.props.feed.id]).then(() => this.props.close());

    render() {
        return (
            <Box>
                <Field>
                    <Label>Select topics for { this.props.feed.title }</Label>
                </Field>
                {
                    this.state.topics.length &&
                    <ToggleMenu
                        items={this.state.topics}
                        submit={this.submit}
                        submitText={'Add'}
                    />

                }
            </Box>
        );
    }
}
