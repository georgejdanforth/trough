import React from 'react';
import { Box, Control, Field, Button } from 'bloomer';

import './DeleteItemForm.css';
import { deleteTopic, unfollowFeed } from '../../utils/http';


export default class DeleteItemForm extends React.Component {

    deleteText = () => ({
        'feed': 'unfollow',
        'topic': 'delete'
    }[this.props.itemType]);

    delete = () => ({
        'feed': unfollowFeed,
        'topic': deleteTopic
    }[this.props.itemType](this.props.item.id).then(() => this.props.close()));

    render() {
        return (
            <Box>
                <div className={'delete-text'}>
                    Are you sure you want to { this.deleteText() } { this.props.item.name || this.props.item.title }?
                </div>
                <Field>
                    <Control className={'delete-control'}>
                        <Button
                            className={'cancel-button'}
                            onClick={this.props.close}
                        >
                            Cancel
                        </Button>
                        <Button
                            className={'delete-button'}
                            onClick={this.delete}
                        >
                            { this.deleteText().charAt(0).toUpperCase() + this.deleteText().slice(1) }
                        </Button>
                    </Control>
                </Field>
            </Box>
        );
    }
}
