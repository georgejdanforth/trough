import React from 'react';
import { connect } from 'react-redux';
import { Menu, MenuLink, MenuList } from 'bloomer';
import Icon from '@mdi/react';
import { mdiPencil, mdiPlusCircleOutline } from '@mdi/js';

import './Sidebar.css';

import AddFeedForm from './AddFeedForm';
import AddTopicForm from './AddTopicForm';
import MenuItem from './MenuItem';
import { getFeeds, getTopics } from '../utils/http';
import {
    clearFilters,
    setFeedFilter,
    setSavedFilter,
    setTopicFilter,
} from '../actions/filters';


class Sidebar extends React.Component {
    state = {
        feeds: [],
        topics: []
    };

    componentDidMount() {
        getTopics().then(({data}) => this.setState({ topics: data }));
        getFeeds().then(({data}) => this.setState({ feeds: data }));
    }

    renderFeeds = () =>
        this.state.feeds.map(feed => (
            <MenuItem
                key={feed.id}
                active={this.props.filters.feedId === feed.id}
                filterFn={this.props.setFeedFilter}
                {...feed}
            />
        ));

    renderTopics = () =>
        this.state.topics.map(topic => (
            <MenuItem
                key={topic.id}
                active={this.props.filters.topicId === topic.id}
                filterFn={this.props.setTopicFilter}
                {...topic}
            />
        ));

    render() {
        return (
            <Menu>
                <MenuList>
                    <li>
                        <MenuLink
                            className={!Object.keys(this.props.filters).length ? 'is-active': ''}
                            onClick={this.props.clearFilters}
                        >
                            All
                        </MenuLink>
                    </li>
                    <li>
                        <MenuLink
                            className={this.props.filters.saved ? 'is-active': ''}
                            onClick={this.props.setSavedFilter}
                        >
                            Saved
                        </MenuLink>
                    </li>
                    <div className={'menu-list-header'}>
                        <span className={'menu-label'}>Topics</span>
                        <button
                            className={'add-button'}
                            onClick={() =>
                                this.props.openModal(
                                    <AddTopicForm
                                        close={this.props.closeModal}
                                        topics={this.state.topics}
                                    />
                                )
                            }
                        >
                            <Icon path={mdiPlusCircleOutline} size={0.65}/>
                        </button>
                    </div>
                    { this.renderTopics() }
                    <div className={'menu-list-header'}>
                        <span className={'menu-label'}>Feeds</span>
                        <button
                            className={'add-button'}
                            onClick={() =>
                                this.props.openModal(
                                    <AddFeedForm
                                        close={this.props.closeModal}
                                    />
                                )
                            }
                        >
                            <Icon path={mdiPlusCircleOutline} size={0.65}/>
                        </button>
                    </div>
                    { this.renderFeeds() }
                </MenuList>
            </Menu>
        );
    }
}


const mapStateToProps = state => ({ filters: state.filters });


export default connect(
    mapStateToProps,
    { setFeedFilter, setSavedFilter, setTopicFilter, clearFilters }
)(Sidebar);