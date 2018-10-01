import React from 'react';
import {
    Column,
    Columns,
} from 'bloomer';

import './Main.css';
import Feed from './Feed';
import Sidebar from './Sidebar';


export default class Main extends React.Component {

    render() {
        return (
            <Columns style={{margin: 0}}>
                <Column className='is-fullheight has-background-grey is-one-fifth'>
                    <Sidebar/>
                </Column>
                <Column className='is-fullheight is-four-fifths'>
                    <Feed/>
                </Column>
            </Columns>
        );
    }
}
