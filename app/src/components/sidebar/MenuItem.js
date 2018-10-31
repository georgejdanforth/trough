import React from 'react';
import {
    Dropdown,
    DropdownContent,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    MenuLink,
} from 'bloomer';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';

import './MenuItem.css';


class MenuItem extends React.Component {
    render() {
        return (
            <li key={this.props.id}>
                <div className={'menu-item'}>
                    <MenuLink
                        className={this.props.isActive ? 'is-active': ''}
                        onClick={() => this.props.filterFn(this.props.id)}
                    >
                        { this.props.title || this.props.name }
                    </MenuLink>
                    <Dropdown isAlign={'right'} isHoverable={true}>
                        <DropdownTrigger>
                            <button
                                className={'edit-button'}
                                aria-haspopup={'true'}
                                aria-controls={'dropdown-menu'}
                            >
                                <Icon path={mdiPencil} size={0.65}/>
                            </button>
                        </DropdownTrigger>
                        <DropdownMenu>
                            <DropdownContent>
                                <DropdownItem>Add to topic</DropdownItem>
                                <DropdownItem>Delete</DropdownItem>
                            </DropdownContent>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </li>
        );
    }
}

export default MenuItem;
