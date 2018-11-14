import React from 'react';
import { connect } from 'react-redux';
import { Menu, MenuLink, MenuList } from 'bloomer';
import Icon from '@mdi/react';
import { mdiPlusCircleOutline } from '@mdi/js';

import './Sidebar.css';

import MenuItem from './MenuItem';
import Spinner from '../shared/Spinner';
import { getFeeds, getTopics } from '../../utils/http';
import {
    clearFilters,
    setFeedFilter,
    setSavedFilter,
    setTopicFilter,
} from '../../actions/filters';
import {
    addFeed,
    addTopic,
    deleteItem,
    manageFeedTopics,
    manageTopicFeeds
} from '../../actions/modal';
import { finishUpdateSidebar } from '../../actions/updates';


class Sidebar extends React.Component {
    state = {
        feeds: [],
        topics: []
    };

    static getDerivedStateFromProps(props, state) {
        if (props.updates.updateSidebar) {
            return {
                feeds: null,
                topics: null
            };
        }

        return null;
    }

    componentDidMount() {
        this.updateTopicsAndFeeds();
    }

    componentDidUpdate() {
        if (this.props.updates.updateSidebar) {
            this.updateTopicsAndFeeds();
        }
    }

    updateTopicsAndFeeds = () => {
        this.props.finishUpdateSidebar();
        getTopics().then(({data}) => this.setState({ topics: data }));
        getFeeds().then(({data}) => this.setState({ feeds: data }));
    };

    renderFeeds = () =>
        this.state.feeds === null
            ? <Spinner size={1} color={'lightgray'}/>
            : this.state.feeds.map(feed => (
                <MenuItem
                    key={feed.id}
                    type={'feed'}
                    manageFeedTopics={() => this.props.manageFeedTopics(feed)}
                    deleteItem={() => this.props.deleteItem('feed', feed)}
                    isActive={this.props.filters.feedId === feed.id}
                    filterFn={this.props.setFeedFilter}
                    {...feed}
                />
            ));

    renderTopics = () =>
        this.state.topics === null
            ? <Spinner size={1} color={'lightgray'}/>
            : this.state.topics.map(topic => (
                <MenuItem
                    key={topic.id}
                    type={'topic'}
                    manageTopicFeeds={() => this.props.manageTopicFeeds(topic)}
                    deleteItem={() => this.props.deleteItem('topic', topic)}
                    isActive={this.props.filters.topicId === topic.id}
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
                            className={Object.keys(this.props.filters).length <= 1 ? 'is-active': ''}
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
                            onClick={() => this.props.addTopic(this.state.topics)}
                        >
                            <Icon path={mdiPlusCircleOutline} size={0.65}/>
                        </button>
                    </div>
                    { this.renderTopics() }
                    <div className={'menu-list-header'}>
                        <span className={'menu-label'}>Feeds</span>
                        <button
                            className={'add-button'}
                            onClick={this.props.addFeed}
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


const mapStateToProps = state => ({ filters: state.filters, updates: state.updates });


export default connect(
    mapStateToProps,
    {
        addFeed,
        addTopic,
        deleteItem,
        manageFeedTopics,
        manageTopicFeeds,
        setFeedFilter,
        setSavedFilter,
        setTopicFilter,
        clearFilters,
        finishUpdateSidebar
    }
)(Sidebar);