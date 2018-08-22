import React, { Component } from 'react';
import { Container, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';
import DeviceList from "./DeviceList.js"

class ModalPage extends Component {

  state = {
    modal: false
  }

  toggle = () => {
    this.setState( prev => ({ modal: !prev.modal }) );
  }

  render() {
    const { devices, accessToken, setDeviceId } = this.props
    return (
      <Container>
        <Button color="secondary" className="modal-toggle" onClick={this.toggle}>Devices</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}></ModalHeader>
          <ModalBody>
            <center><img src="https://cdn.freebiesupply.com/logos/large/2x/spotify-2-logo-png-transparent.png" alt="computer" width="200px" /></center>

            <DeviceList devices={devices} accessToken={accessToken} setDeviceId={setDeviceId} toggle={this.toggle}/>

          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>Close</Button>{' '}
          </ModalFooter>
        </Modal>
      </Container>
    );
  }
}

export default ModalPage;
