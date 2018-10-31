import React from 'react';
import {
    Column,
    Columns,
} from 'bloomer';

import './Main.css';
import ModalWrapper from './modal/ModalWrapper';
import Feed from './feed/Feed';
import Sidebar from './sidebar/Sidebar';


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
