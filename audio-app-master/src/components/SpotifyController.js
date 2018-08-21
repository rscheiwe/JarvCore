import React, { Component } from 'react'
import DevicesModal from './DevicesModal'
import SearchModal from './SearchModal'

export default class SpotifyController extends Component {

  state = {
    devices: [],
    deviceId: null,
    currentTrack: null,
    playList: null,
    tokenExpires: null,
    refreshToken: null,
    searchResults: []
  }

  componentDidMount() {
    let splitUrl = document.URL.split("&token=")
    let accessToken = splitUrl[1]
    let splitOnExpires = splitUrl[0].split('&expires=')
    let tokenExpires = splitOnExpires[1]
    let refreshToken = splitOnExpires[0].split('refresh=')[1]

    this.props.setAccessToken(accessToken)
    this.setState({ tokenExpires, refreshToken }, () => {
      const headers = { 'Authorization': `Bearer ${this.props.accessToken}` }

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

    this.refreshPlayer = setInterval(this.refreshPlayerStatus, 8000)
    this.deviceRefresh = setInterval(this.refreshDevices, 8000)
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
      headers: { 'Authorization': `Bearer ${this.props.accessToken}` }})
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
        'Authorization': `Bearer ${this.props.accessToken}`,
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

  search = (query) => {
    const formatQuery = query.replace(' ', '%20')

    fetch(`http://localhost:3000/albums/${formatQuery}`, {
      method: 'GET',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}
    }).then(r => r.json())
    .then(searchResults => this.setState({ searchResults }))
  }

  setDeviceId = (deviceId) => {
    this.setState({ deviceId })
  }

  render() {
    const { devices, searchResults, playList } = this.state
    const { accessToken } = this.props

    return (
      <div>
        <DevicesModal devices={devices} accessToken={accessToken} setDeviceId={this.setDeviceId} />
        <SearchModal search={this.search} searchResults={searchResults} accessToken={accessToken} playList={playList} />
      </div>
    )
  }
}
