import React from 'react';
import { connect } from 'react-redux';
import {
    Modal,
    ModalBackground,
    ModalContent,
    ModalClose
} from 'bloomer';

import {
    ADD_FEED,
    ADD_TOPIC,
    close
} from '../../actions/modal';
import AddFeedForm from './AddFeedForm';
import AddTopicForm from './AddTopicForm';


const ModalWrapper = (props) => (
    <Modal isActive={props.modal.isActive}>
        <ModalBackground onClick={props.close}/>
        <ModalContent>
            {(() => {
                switch (props.modal.type) {
                    case ADD_FEED:
                        return <AddFeedForm/>;
                    case ADD_TOPIC:
                        return <AddTopicForm {...props.modal.formProps}/>;
                }
            })()}
        </ModalContent>
        <ModalClose onClick={props.close}/>
    </Modal>
);


const mapStateToProps = state => ({ modal: state.modal });


export default connect(
    mapStateToProps,
    { close }
)(ModalWrapper);
