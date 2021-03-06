import React, { Component } from 'react'

export default class ResultCard extends Component {

  state = {
    added: false
  }

  addToCurrentPlayList = (e) => {
    const { accessToken, playList } = this.props
    const { id } = this.props.result

    this.setState({ added: true })

    fetch(`https://api.spotify.com/v1/albums/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).then(r => r.json())
    .then(j => {
      let uris = j.tracks.items.map(track => track.uri)
      let headers = { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' }
      if (playList){
        fetch(`https://api.spotify.com/v1/playlists/${playList}/tracks`, {
          method: 'POST',
          mode: 'cors',
          headers: headers,
          body: JSON.stringify({
            "uris": uris
          })
        })
      } else {
        fetch(`https://api.spotify.com/v1/me/albums?ids=${j.id}`, {
          method: 'PUT',
          headers: headers
        })
      }
    })

  }

  render() {
    const { name, artists } = this.props.result
    return (
      <div className="item">
        <button onClick={this.addToCurrentPlayList}>
          { this.state.added ? "Added!" : "Add to library" }
        </button>
        <div className={ (name + artists[0].name).length > 50 ? "scroll-left" : null }>
          <p> {name} - {artists[0].name} </p>
        </div>
      </div>
    )
  }
}
