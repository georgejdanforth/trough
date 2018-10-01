import React from 'react';
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


export default class Feed extends React.Component {
    constructor(props) {
        super(props);
        this.state = { feedItems: [] };
    }

    componentDidMount = () =>
        getFeedItems().then(({ data }) => this.setState({ feedItems: data }));

    renderFeedItems = () =>
        this.state.feedItems.map(
            feedItem => <FeedItem key={feedItem.id} {...feedItem}/>
        );

    render() {
        return (<Container>{ this.renderFeedItems() }</Container>);
    }
}
