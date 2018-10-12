import React from 'react';
import {
    Column,
    Columns,
} from 'bloomer';

import './Main.css';
import ModalWrapper from './ModalWrapper';
import Feed from './Feed';
import Sidebar from './Sidebar';


export default class Main extends React.Component {

    state = { form: null };

    _updateForm = form => this.setState({ form });

    render() {
        return (
            <div>
                <ModalWrapper
                    isActive={this.state.form !== null}
                    form={this.state.form}
                    close={() => this._updateForm(null)}
                />
                <Columns style={{margin: 0}}>
                    <Column className='is-fullheight has-background-grey is-one-fifth'>
                        <Sidebar
                            openModal={form => this._updateForm(form)}
                            closeModal={() => this._updateForm(null)}
                        />
                    </Column>
                    <Column className='is-fullheight is-four-fifths'>
                        <Feed/>
                    </Column>
                </Columns>
            </div>
        );
    }
}
