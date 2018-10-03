import React from 'react';
import {
    Box,
    Modal,
    ModalBackground,
    ModalContent,
    ModalClose
} from 'bloomer';


export default class AddFeedModal extends React.Component {
    render() {
        return (
            <Modal isActive={this.props.isActive}>
                <ModalBackground onClick={this.props.close}/>
                <ModalContent>
                    <Box>TESTESTESTEST</Box>
                </ModalContent>
                <ModalClose onClick={this.props.close}/>
            </Modal>
        );
    }
}