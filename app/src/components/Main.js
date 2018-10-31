import React from 'react';
import { connect } from 'react-redux';
import {
    Column,
    Columns,
} from 'bloomer';

import './Main.css';
import ModalWrapper from './ModalWrapper';
import Feed from './Feed';
import Sidebar from './Sidebar';


const Main = () => (
    <div>
        <ModalWrapper/>
        <Columns style={{margin: 0}}>
            <Column className='is-fullheight has-background-grey is-one-fifth'>
                <Sidebar/>
            </Column>
            <Column className='is-fullheight is-four-fifths'>
                <Feed/>
            </Column>
        </Columns>
    </div>
);

export default Main;
