import React from 'react';
import { Button, Control, Field, Icon as FormIcon } from 'bloomer';
import _ from 'lodash';
import { Icon } from '@mdi/react';
import {
    mdiCheckboxBlankCircleOutline,
    mdiCheckboxMarkedCircleOutline
} from '@mdi/js';

import './ToggleMenu.css';


export default class ToggleMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inclusions: props.items.reduce((obj, item) => (obj[item.id] = item.added, obj), {})
        };
    }

    toggleItem = item => this.setState({
        inclusions: {
            [item.id]: !this.state.inclusions[item.id],
            ..._.omit(this.state.inclusions, item.id)}
    });

    renderItems = () =>
        this.props.items.map(item => (
            <Control className={'item-control'} hasIcons={'left'}>
                <Button
                    key={item.id}
                    className={'item-button'}
                    onClick={() => this.toggleItem(item)}
                >
                    <FormIcon
                        isAlign={'left'}
                        isSize={'small'}
                    >
                        <Icon
                            className={'item-icon'}
                            size={0.8}
                            color={'gray'}
                            path={
                                this.state.inclusions[item.id]
                                    ? mdiCheckboxMarkedCircleOutline
                                    : mdiCheckboxBlankCircleOutline
                            }
                        />
                    </FormIcon>
                    <span>{ item.title || item.name }</span>
                </Button>
            </Control>
        ));

    render() {
        return (
            <div>
                <Field>
                    <Control className={'items'}>
                        <div>{ this.renderItems() }</div>
                    </Control>
                </Field>
                <Field>
                    <Control className={'submit-control'}>
                        <Button
                            className={'submit-button'}
                            onClick={() => this.props.submit(this.state.inclusions)}
                        >
                            { this.props.submitText }
                        </Button>
                    </Control>
                </Field>
            </div>
        );
    }
}
