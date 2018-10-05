import React from 'react';
import { Content } from 'bloomer';
import moment from 'moment';

import './FeedItem.css';

const MAX_WORDS = 100;

export default class FeedItem extends React.Component {

    trimWords = text => {
        if (!text) return text;

        const words = text.split(/\s+/).filter(word => !!word);
        return words.length > MAX_WORDS
            ? words.slice(0, MAX_WORDS).join(' ') + ' […]'
            : words.join(' ');
    };

    render() {
        return (
            <Content className={'feed-item'}>
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
            </Content>
        );
    }
}