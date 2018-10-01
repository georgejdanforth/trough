import React from 'react';
import {
    Menu,
    MenuLabel,
    MenuLink,
    MenuList
} from 'bloomer';

import { getFeeds } from '../utils/http';


export default class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { feeds: [] };
    }

    componentDidMount = () =>
        getFeeds().then(({ data }) => this.setState({ feeds: data }));

    renderFeeds = () =>
        this.state.feeds.map(
            feed => <li key={feed.id}><MenuLink>{ feed.title }</MenuLink></li>
        );

    render() {
        return (
            <Menu>
                <MenuList>
                    <MenuLabel>Feeds</MenuLabel>
                    { this.renderFeeds() }
                </MenuList>
            </Menu>
        );
    }
}