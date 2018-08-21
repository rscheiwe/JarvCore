import React, { Component } from 'react';
import { Container, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';
import DeviceList from "./DeviceList.js"

class DevicesModal extends Component {

  state = {
    modal: false
  }

  toggle = () => {
    this.setState(prev => ({ modal: !prev.modal }))
  }

  render() {
    const { devices, accessToken, setDeviceId } = this.props

    return (
      <Container>
        <Button color="secondary" onClick={this.toggle} className="devices-modal-button">Devices</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}></ModalHeader>
          <ModalBody>
            <center><img src="https://hemochromatosishelp.com/wp-content/uploads/2017/08/Computer-Icon.png" alt="computer" width="200px" /></center>

            <DeviceList devices={devices} accessToken={accessToken} setDeviceId={setDeviceId} toggle={this.toggle} />

          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>Close</Button>{' '}
          </ModalFooter>
        </Modal>
      </Container>
    );
  }
}

export default DevicesModal;
