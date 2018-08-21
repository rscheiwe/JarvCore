import React, { Component } from 'react'
import ModalPage from './ModalPage'

export default class SpotifyController extends Component {

  state = {
    accessToken: null,
    devices: [],
    deviceId: null,
    currentTrack: null,
    playList: null,
    tokenExpires: null,
    refreshToken: null
  }

  componentDidMount() {
    let splitUrl = document.URL.split("&token=")
    let accessToken = splitUrl[1]
    let splitOnExpires = splitUrl[0].split('&expires=')
    let tokenExpires = splitOnExpires[1]
    let refreshToken = splitOnExpires[0].split('refresh=')[1]

    this.setState({ accessToken, tokenExpires, refreshToken }, () => {
      const headers = { 'Authorization': `Bearer ${this.state.accessToken}` }

      fetch('https://api.spotify.com/v1/me/player/devices', {
        method: "GET",
        headers: headers })
        .then(r => r.json())
        .then(({ devices }) => {
          if (!devices || devices === this.state.devices) return
          this.setState({ devices }, () => document.querySelector(".Ripple-parent").click())
        })
        .then(() => {
          this.trackRefresh = setInterval(() => {
            fetch('https://api.spotify.com/v1/me/player', {
              method: 'GET',
              headers: headers })
            .then(r => {
              if(r.status === 204) {
                return '204'
              } else {
                return r.json()
              }
            })
            .then(json => {
              if (json === '204' || !json.item) {
                return
              } else if ( this.state.currentTrack === null || json.item.id !== this.state.currentTrack.id ){
                this.setState({ currentTrack: json.item })
              }
            })
          }, 2000)
        })
    })

    this.refreshPlayer = setInterval(this.refreshPlayerStatus, 5000)
    this.deviceRefresh = setInterval(this.refreshDevices, 2000)
    this.refreshTokens = setInterval(this.refreshAccessToken, 300000)
  }

  componentWillUnmount() {
    clearInterval(this.trackRefresh)
    clearInterval(this.refreshPlayer)
    clearInterval(this.deviceRefresh)
    clearInterval(this.refreshTokens)
  }

  refreshAccessToken = () => {
    let currentTime = parseInt(Date.now().toString().slice(0, 10), 10)
    if(this.state.tokenExpires - 500 < currentTime) {
      fetch('http://localhost:3000/refresh', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accepts': 'application/json'},
        body: JSON.stringify({refresh_token: this.state.refreshToken})
      })
      .then(r => r.json())
      .then(j => {
        this.setState({ accessToken: j.access_token, tokenExpires: j.expires })
      })
    }
  }

  refreshDevices = () => {
    fetch('https://api.spotify.com/v1/me/player/devices', {
      method: "GET",
      headers: { 'Authorization': `Bearer ${this.state.accessToken}` }})
      .then(r => r.json())
      .then(({ devices }) => {
        let ids = devices.map(device => device.id).join('')
        let stateIds = this.state.devices.map(device => device.id).join('')
        if (ids === stateIds) return

        this.setState({ devices })
      })
  }

  refreshPlayerStatus = () => {
    fetch('https://api.spotify.com/v1/me/player', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.state.accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    .then(r => {
      return (r.status === 204 ? '204' : r.json())
    })
    .then(json => {
      if (json === '204'){
        return
      } else {
        if (!json.context && this.state.playList !== null) {
          this.setState({ playList: null })
        } else {
          let listArray = json.context.href.split('/')
          let listId = listArray[listArray.length - 1]

          if(this.state.playList !== listId){
            this.setState({ playList: listId })
          }
        }
      }
    })
  }

  setDeviceId = (deviceId) => {
    this.setState({ deviceId })
  }

  render() {
    const { devices, accessToken } = this.state
    return (
      <div>
        <ModalPage devices={devices} accessToken={accessToken} setDeviceId={this.setDeviceId} />
      </div>
    )
  }
}
