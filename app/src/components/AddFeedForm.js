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
import { mdiLoading } from '@mdi/js';
import { Icon } from '@mdi/react';
import { isWebUri } from 'valid-url';

import { addFeed, validateFeed } from '../utils/http';


export default class AddFeedForm extends React.Component {
    state = {
        feedUrl: null,
        isValidFeedUrl: false,
        loading: false
    };

    updateFeedUrl = ({ target }) => {
        this.setState({ feedUrl: target.value }, () => {
            if (isWebUri(this.state.feedUrl)) {
                this.setState({ loading: true }, () => {
                    validateFeed(this.state.feedUrl)
                        .then(({ data }) => this.setState({
                            loading: false,
                            isValidFeedUrl: data.isValid
                        }));
                });
            } else {
                this.setState({ isValidFeedUrl: false });
            }
        });
    };

    submit = () => addFeed(this.state.feedUrl).then(() => this.props.close());

    render() {
        return (
            <Box>
                <Field>
                    <Label>Add a new feed</Label>
                </Field>
                <Field hasAddons={'right'}>
                    <Control hasIcons={'right'} className={'is-expanded'}>
                        <Input
                            className={'is-fullwidth'}
                            onChange={this.updateFeedUrl}
                            placeholder={'RSS or Atom feed URL...'}
                        />
                        <FormIcon
                            isHidden={!this.state.loading}
                            isAlign={'right'}
                            isSize={'small'}
                        >
                            <Icon
                                path={mdiLoading}
                                spin={1}
                                size={1}
                                color={'lightgray'}
                            />
                        </FormIcon>
                    </Control>
                    <Control>
                        <Button
                            disabled={!this.state.isValidFeedUrl}
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