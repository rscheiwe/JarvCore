import React, { Component } from 'react'
import Device from './Device'

class DeviceList extends Component {

  mappedDevices = () => {
    const { toggle, setDeviceId, accessToken } = this.props
    return this.props.devices.map(device => (
      <Device key={device.id} device={device} setDeviceId={setDeviceId} accessToken={accessToken} toggle={toggle}/>)
    )
  }

  render() {
    return (
      <ul>
        {this.mappedDevices()}
      </ul>
    )
  }
}

export default DeviceList
