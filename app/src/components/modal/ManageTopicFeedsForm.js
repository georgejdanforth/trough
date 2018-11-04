import React from 'react';
import { Box, Field, Label } from 'bloomer';

import ToggleMenu from './ToggleMenu';
import { manageTopicFeeds, getFeeds } from '../../utils/http';


export default class ManageTopicFeedsForm extends React.Component {
    state = {
        feeds: []
    };

    componentDidMount() {
        getFeeds(this.props.topic.id).then(({data}) => this.setState({ feeds: data }));
    }

    submit = ids => manageTopicFeeds(this.props.topic.id, ids).then(() => this.props.close());

    render() {
        return (
            <Box>
                <Field>
                    <Label>Select feeds for { this.props.topic.name }</Label>
                </Field>
                {
                    this.state.feeds.length &&
                    <ToggleMenu
                        items={this.state.feeds}
                        submit={this.submit}
                        submitText={'Submit'}
                    />

                }
            </Box>
        );
    }
}
