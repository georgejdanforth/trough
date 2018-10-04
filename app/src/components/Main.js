import React from 'react';
import {
    Column,
    Columns,
} from 'bloomer';

import './Main.css';
import AddFeedModal from './AddFeedModal';
import Feed from './Feed';
import Sidebar from './Sidebar';


export default class Main extends React.Component {

    state = { isModalActive: false };

    _openModal = () => this.setState({ isModalActive: true });
    _closeModal = () => this.setState({ isModalActive: false });
    _refresh = () => this.forceUpdate();

    render() {
        return (
            <div>
                <AddFeedModal
                    isActive={this.state.isModalActive}
                    close={this._closeModal}
                    refresh={this._refresh}
                />
                <Columns style={{margin: 0}}>
                    <Column className='is-fullheight has-background-grey is-one-fifth'>
                        <Sidebar openModal={this._openModal}/>
                    </Column>
                    <Column className='is-fullheight is-four-fifths'>
                        <Feed/>
                    </Column>
                </Columns>
            </div>
        );
    }
}
