import React, { Component } from 'react';
import { Container, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';

export default class HelpModal extends Component {

  state = {
    modal: false
  }

  toggle = () => {
    this.setState(prev => ({ modal: !prev.modal }))
  }

  render() {
    return (
      <Container>
        <Button style={{opacity: 0}} onClick={this.toggle} className="help-modal-button"></Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}></ModalHeader>
          <ModalBody>
            <h2>Say...</h2>
            <ul>
              <li>"Play" to resume playback</li>
              <li>"Pause" to pause playback</li>
              <li>"Play" to resume playback</li>
              <li>"Next" to skip to next track</li>
              <li>"Previous" to skip to previous trac</li>
              <li>"Turn shuffle on" to turn on shuffle</li>
              <li>"Turn shuffle off" to turn off shuffle </li>
              <li>"Search (artist name)" to find music by an artist</li>
              <li>"Close search" to close the search menu</li>
              <li>"Open manual search" to open search menu and search by typing</li>
              <li>"Open devices" to open the list of your active devices and choose one for playback</li>
              <li>"Close help" to close this menu</li>
            </ul>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>Close</Button>{' '}
          </ModalFooter>
        </Modal>
      </Container>
    );
  }
}
