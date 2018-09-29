import React from 'react';
import {
    Column,
    Columns,
    Container,
    Content,
    Menu,
    MenuLink,
    MenuList
} from 'bloomer';

import './Main.css';
import { getFeedItems } from '../utils/http';


const FeedItem = props => (
    <Content>
        <span>{ props.feedInfo.title } | { props.pubdate }</span>
        <h4><a href={props.url} target='_blank'>{ props.title }</a></h4>
        <p>{ props.description }</p>
    </Content>
);


export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = { feedItems: [] };
    }

    componentDidMount = () =>
        getFeedItems().then(({ data }) => this.setState({ feedItems: data }));

    testMenuItems = n => [...Array(n).keys()].map(
        () => (<li><MenuLink>Menu item</MenuLink></li>)
    );

    render() {
        return (
            <Columns style={{margin: 0}}>
                <Column isSize='1/4' className='is-fullheight has-background-grey'>
                    <Menu>
                        <MenuList>{ this.testMenuItems(50) }</MenuList>
                    </Menu>
                </Column>
                <Column isSize='3/4' className={'is-fullheight'}>
                    <Container>
                        { this.state.feedItems.map(feedItem => <FeedItem {...feedItem}/>) }
                    </Container>
                </Column>
            </Columns>
        );
    }
}
