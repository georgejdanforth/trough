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
    DELETE_ITEM,
    MANAGE_FEED_TOPICS,
    MANAGE_TOPIC_FEEDS,
    close
} from '../../actions/modal';

import AddFeedForm from './AddFeedForm';
import AddTopicForm from './AddTopicForm';
import DeleteItemForm from './DeleteItemForm';
import ManageFeedTopicsForm from './ManageFeedTopicsForm';
import ManageTopicFeedsForm from './ManageTopicFeedsForm';


const ModalWrapper = (props) => {

    const close = () => props.close(props.modal.type);
    const formProps = { close, ...props.modal.formProps };

    return (
        <Modal isActive={props.modal.isActive}>
            <ModalBackground onClick={close}/>
            <ModalContent>
                {(() => {
                    switch (props.modal.type) {
                        case ADD_FEED:
                            return <AddFeedForm {...formProps}/>;
                        case ADD_TOPIC:
                            return <AddTopicForm {...formProps}/>;
                        case DELETE_ITEM:
                            return <DeleteItemForm {...formProps}/>;
                        case MANAGE_FEED_TOPICS:
                            return <ManageFeedTopicsForm {...formProps}/>;
                        case MANAGE_TOPIC_FEEDS:
                            return <ManageTopicFeedsForm {...formProps}/>;
                    }
                })()}
            </ModalContent>
            <ModalClose onClick={close}/>
        </Modal>
    );
};


const mapStateToProps = state => ({ modal: state.modal });


export default connect(mapStateToProps, { close })(ModalWrapper);
