import React from 'react';
import { connect } from 'react-redux';
import { Button, Container } from 'bloomer';
import { Icon } from '@mdi/react';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';

import './Feed.css';

import FeedItem from './FeedItem';
import { decrementPage, incrementPage } from '../../actions/filters';
import { updateFeed, finishUpdateFeed } from '../../actions/updates';
import { getFeedItems } from '../../utils/http';


class Feed extends React.Component {

    state = { feedItems: null };

    static getDerivedStateFromProps(props, state) {
        if (props.updates.updateFeed) {
            return {
                feedItems: null,
                previousFilters: state.previousFilters
            };
        }

        if (props.filters !== state.previousFilters) {
            return {
                feedItems: null,
                previousFilters: props.filters
            };
        }

        return null;
    }

    componentDidMount() {
        this._updateFeedItems(this.props.filters);
    }

    componentDidUpdate(previousProps, previousState) {
        if (this.state.feedItems === null) {
            this._updateFeedItems(this.props.filters);
        }
    }

    componentWillUnmount() {
        if (this._asyncRequest) {
            this._asyncRequest.cancel();
        }
    }

    _updateFeedItems(filters) {
        this._asyncRequest = getFeedItems(filters)
            .then(({ data }) => {
                if (this.props.updates.updateFeed) {
                    this.props.finishUpdateFeed();
                }

                this._asyncRequest = null;
                this.setState({ feedItems: data });
            });
    }

    renderFeedItems = () =>
        this.state.feedItems === null
            ? []
            : this.state.feedItems.map(feedItem => <FeedItem key={feedItem.id} {...feedItem}/>);

    render() {
        return (
            <Container className='feed-container'>
                { this.state.feedItems === null ? 'Loading...' : this.renderFeedItems() }
                <div className={'page-buttons'}>
                    <Button
                        className={'page-button'}
                        disabled={this.props.filters.page <= 1}
                        onClick={() => this.props.decrementPage(this.props.filters)}
                    >
                        <Icon path={mdiChevronLeft} size={0.8}/>
                        Previous page
                    </Button>
                    <Button
                        className={'page-button'}
                        onClick={() => this.props.incrementPage(this.props.filters)}
                    >
                        Next page
                        <Icon path={mdiChevronRight} size={0.8}/>
                    </Button>
                </div>
            </Container>
        );
    }
}


const mapStateToProps = state => ({ filters: state.filters, updates: state.updates });


export default connect(
    mapStateToProps,
    {
        decrementPage,
        incrementPage,
        updateFeed,
        finishUpdateFeed
    }
)(Feed);
