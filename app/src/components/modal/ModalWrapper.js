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
    ADD_TO_TOPIC,
    close
} from '../../actions/modal';
import AddFeedForm from './AddFeedForm';
import AddTopicForm from './AddTopicForm';
import AddToTopicForm from './AddToTopicForm';


const ModalWrapper = (props) => (
    <Modal isActive={props.modal.isActive}>
        <ModalBackground onClick={props.close}/>
        <ModalContent>
            {(() => {
                switch (props.modal.type) {
                    case ADD_FEED:
                        return <AddFeedForm close={props.close}/>;
                    case ADD_TOPIC:
                        return <AddTopicForm
                            close={props.close}
                            {...props.modal.formProps}
                        />;
                    case ADD_TO_TOPIC:
                        return <AddToTopicForm
                            close={props.close}
                            {...props.modal.formProps}
                        />;
                }
            })()}
        </ModalContent>
        <ModalClose onClick={props.close}/>
    </Modal>
);


const mapStateToProps = state => ({ modal: state.modal });


export default connect(mapStateToProps, { close })(ModalWrapper);
