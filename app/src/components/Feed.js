import React from 'react';
import { connect } from 'react-redux';
import {
    Container,
    Content,
} from 'bloomer';

import { getFeedItems } from '../utils/http';


const FeedItem = props => (
    <Content>
        <span>{ props.feedInfo.title } | { props.pubdate }</span>
        <h4><a href={props.url} target='_blank'>{ props.title }</a></h4>
        <p>{ props.description }</p>
    </Content>
);


class Feed extends React.Component {

    state = { feedItems: null };

    static getDerivedStateFromProps(props, state) {
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
        this._asyncRequest = getFeedItems(filters).then(
            ({ data }) => {
                this._asyncRequest = null;
                this.setState({ feedItems: data });
            }
        );
    }

    renderFeedItems = () =>
        this.state.feedItems === null
            ? []
            : this.state.feedItems.map(feedItem => <FeedItem key={feedItem.id} {...feedItem}/>);

    render() {
        return (
            <Container>
                { this.state.feedItems === null ? 'Loading...' : this.renderFeedItems() }
            </Container>
        );
    }
}


const mapStateToProps = state => ({ filters: state.filters });


export default connect(mapStateToProps)(Feed);
