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
    MANAGE_FEED_TOPICS,
    MANAGE_TOPIC_FEEDS,
    close
} from '../../actions/modal';

import AddFeedForm from './AddFeedForm';
import AddTopicForm from './AddTopicForm';
import ManageFeedTopicsForm from './ManageFeedTopicsForm';
import ManageTopicFeedsForm from './ManageTopicFeedsForm';


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
                    case MANAGE_FEED_TOPICS:
                        return <ManageFeedTopicsForm
                            close={props.close}
                            {...props.modal.formProps}
                        />;
                    case MANAGE_TOPIC_FEEDS:
                        return <ManageTopicFeedsForm
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
