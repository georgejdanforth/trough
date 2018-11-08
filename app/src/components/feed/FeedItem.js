import React from 'react';
import { Content } from 'bloomer';
import { mdiBookmark, mdiBookmarkOutline, mdiRss } from '@mdi/js';
import { Icon } from '@mdi/react';
import moment from 'moment';

import './FeedItem.css';
import { saveFeedItem, unsaveFeedItem } from '../../utils/http';

const MAX_WORDS = 100;

export default class FeedItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = { isSaved: this.props.isSaved };
    }

    trimWords = text => {
        if (!text) return text;

        const words = text.split(/\s+/).filter(word => !!word);
        return words.length > MAX_WORDS
            ? words.slice(0, MAX_WORDS).join(' ') + ' […]'
            : words.join(' ');
    };

    save = () => saveFeedItem(this.props.id).then(() => this.setState({ isSaved: true }));

    unsave = () => unsaveFeedItem(this.props.id).then(() => this.setState({ isSaved: false }));

    render() {
        return (
            <Content>
                <div className={'item-actions'}>
                    <span
                        className={'action tooltip'}
                        data-tooltip={this.state.isSaved ? 'Unsave': 'Save'}
                    >
                        <Icon
                            onClick={this.state.isSaved ? this.unsave : this.save}
                            path={this.state.isSaved ? mdiBookmark : mdiBookmarkOutline}
                            size={0.8}
                            color={'gray'}
                        />
                    </span>
                </div>
                <div className={'feed-item'}>
                    <span className={'feed-name-and-date'}>
                        { this.props.feedInfo.title } | { moment(this.props.pubdate).fromNow() }
                    </span>
                    <div>
                        <span className={'item-title'}>
                            <a
                                href={this.props.url}
                                target={'_blank'}
                            >
                                { this.props.title }
                            </a>
                        </span>
                    </div>
                    <p>{ this.trimWords(this.props.description) }</p>
                </div>
            </Content>
        );
    }
}