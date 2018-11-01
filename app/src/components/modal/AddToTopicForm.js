import React from 'react';
import {
    Box,
    Button,
    Control,
    Field,
    Label,
} from 'bloomer';
import classNames from 'classnames/bind';

import './AddToTopicForm.css';
import { addToTopics, getTopics } from '../../utils/http';


export default class AddToTopicForm extends React.Component {
    state = {
        topics: [],
        addedTopicIds: []
    };

    componentDidMount() {
        getTopics(this.props.feed.id).then(({data}) => this.setState({ topics: data }));
    }

    toggleAddedTopicId = topicId => {
        if (this.state.addedTopicIds.includes(topicId)) {
            this.setState({
                addedTopicIds: this.state.addedTopicIds.filter(
                    addedId => addedId !== topicId
                )
            });
        } else {
            this.setState({ addedTopicIds: [topicId, ...this.state.addedTopicIds]});
        }
    };


    renderTopics = () =>
        this.state.topics.map(topic => {
            const classes = classNames(
                'topic-button',
                {'topic-selected': this.state.addedTopicIds.includes(topic.id)}
            );

            return (
                <Button
                    key={topic.id}
                    className={classes}
                    onClick={() => this.toggleAddedTopicId(topic.id)}
                >
                    { topic.name }
                </Button>
            );
        });

    submit = () =>
        addToTopics(this.state.addedTopicIds, this.props.feed.id)
            .then(() => this.props.close());

    render() {
        return (
            <Box>
                <Field>
                    <Label>Select topics for { this.props.feed.title }</Label>
                </Field>
                <Field>
                    <Control className={'topics'}>
                        <div>{ this.renderTopics() }</div>
                    </Control>
                </Field>
                <Field>
                    <Control className={'add-control'}>
                        <Button
                            className={'add-to-topics-button'}
                            disabled={!this.state.addedTopicIds.length}
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
