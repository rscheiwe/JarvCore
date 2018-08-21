import React, { Component } from 'react';
import { Container, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';
import DeviceList from "./DeviceList.js"

class ModalPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    // console.log(this.props)
    const { devices, accessToken, setDeviceId } = this.props
    return (
      <Container>
        <Button color="danger" onClick={this.toggle}>Modal</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}></ModalHeader>
          <ModalBody>
            <center><img src="https://hemochromatosishelp.com/wp-content/uploads/2017/08/Computer-Icon.png" alt="computer" width="200px" /></center>

            <DeviceList devices={devices} accessToken={accessToken} setDeviceId={setDeviceId} />

          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>Close</Button>{' '}
            <Button color="primary">Save changes</Button>
          </ModalFooter>
        </Modal>
      </Container>
    );
  }
}

export default ModalPage;
