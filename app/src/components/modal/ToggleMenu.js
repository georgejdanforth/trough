import React from 'react';
import { Button, Control, Field } from 'bloomer';
import classNames from 'classnames/bind';

import './ToggleMenu.css';


export default class ToggleMenu extends React.Component {
    state = {
        addedItemIds: []
    };

    _with = (array, item) => [...array, item];

    _without = (array, item) => array.filter(member => member !== item);

    toggleItem = item => this.setState({
        addedItemIds: this.state.addedItemIds.includes(item.id)
            ? this._without(this.state.addedItemIds, item.id)
            : this._with(this.state.addedItemIds, item.id)
    });

    itemClassName = item =>
        classNames('item-button', {'item-selected': this.state.addedItemIds.includes(item.id)});

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
                            disabled={!this.state.addedItemIds.length}
                            onClick={() => this.props.submit(this.state.addedItemIds)}
                        >
                            { this.props.submitText }
                        </Button>
                    </Control>
                </Field>
            </div>
        );
    }
}
