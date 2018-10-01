import React from 'react';
import { connect } from 'react-redux';
import {
    Menu,
    MenuLabel,
    MenuLink,
    MenuList
} from 'bloomer';

import { getFeeds } from '../utils/http';
import { setFeedFilter } from '../actions/filters';


class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { feeds: [] };
    }

    componentDidMount = () =>
        getFeeds().then(({ data }) => this.setState({ feeds: data }));

    renderFeeds = () =>
        this.state.feeds.map(
            feed => (
                <li key={feed.id}>
                    <MenuLink
                        className={this.props.activeFeedId === feed.id ? 'is-active': ''}
                        onClick={() => this.props.setFeedFilter(feed.id)}
                    >
                        { feed.title }
                    </MenuLink>
                </li>
            )
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


const mapStateToProps = state => ({ activeFeedId: state.filters.feedId });


export default connect(mapStateToProps, { setFeedFilter })(Sidebar);