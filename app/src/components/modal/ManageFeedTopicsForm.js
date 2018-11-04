import React from 'react';
import { Box, Field, Label } from 'bloomer';

import ToggleMenu from './ToggleMenu';
import { manageFeedTopics, getTopics } from '../../utils/http';


export default class ManageFeedTopicsForm extends React.Component {
    state = {
        topics: [],
    };

    componentDidMount() {
        getTopics(this.props.feed.id).then(({data}) => this.setState({ topics: data }));
    }

    submit = ids => manageFeedTopics(this.props.feed.id, ids).then(() => this.props.close());

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
