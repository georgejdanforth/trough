import React from 'react';
import { Button, Control, Field } from 'bloomer';
import classNames from 'classnames/bind';
import _ from 'lodash';

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

    itemClassName = item =>
        classNames('item-button', {'item-selected': this.state.inclusions[item.id]});

    renderItems = () =>
        this.props.items.map(item => (
            <Button
                key={item.id}
                className={this.itemClassName(item)}
                onClick={() => this.toggleItem(item)}
            >
                { item.title || item.name }
            </Button>
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
