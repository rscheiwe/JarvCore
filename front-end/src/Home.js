import React, {Component } from'react';
// import ReactDOM from 'react-dom';
import P5Wrapper from 'react-p5-wrapper';
import Sketch2 from './sketch2.js'
import './Home.css'
import MicrophoneViz from './MicrophoneViz.js'
import CreateImage from './CreateImage.js'
import SpotifyController from './components/SpotifyController'

// Import the Artyom library
import Artyom from 'artyom.js';

import DeviceList from './components/DeviceList'
import NowPlaying from './components/NowPlaying'
import SearchBar from './components/SearchBar'
import ResultCardsContainer from './components/ResultCardsContainer'

// Create a "globally" accesible instance of Artyom
const Jarvis = new Artyom();
Jarvis.ArtyomVoicesIdentifiers["en-GB"] = ["Google UK English Female", "Google UK English Male", "en-GB", "en_GB"];
let finalCommand;
let spokenword;


export default class Home extends Component {

    state = {
      currentTrack: null,
      accessToken: null,
      artyomActive: false,
      textareaValue: "",
      artyomIsReading: false,
      finalCommand: null,
      text: 'Richard'
    };

  commands = () => {
    return [
      {
        indexes: ["search *"],
        smart: true,
        action: (i, query) => {
          Jarvis.say("Okay! Here's some music by " + query)
          let searchInput = document.querySelector('.search-input-field')

          if (!searchInput) {
            document.querySelector('.search-modal-button').click()
            searchInput = document.querySelector('.search-input-field')
          }

          searchInput.value = query
          document.querySelector('.search-form-button').click()
        }
      },
      {
        indexes: ["close search"],
        action: () => {
          document.querySelector('.search-modal-button').click()
        }
      },
      {
        indexes: ["open manual search"],
        action: () => {
          Jarvis.say('Okay, if you insist')
          document.querySelector('.search-modal-button').click()
        }
      },
      {
        indexes: ["help"],
        action: () => {
          Jarvis.say('Here are some words I understand')
          document.querySelector('.help-modal-button').click()
        }
      },
      {
        indexes: ["close menu"],
        action: () => {
          document.querySelector('.help-modal-button').click()
        }
      },
      {
        indexes: ["play"],
        action: () => {
          Jarvis.say("Okay. let's get this party started")
          fetch('https://api.spotify.com/v1/me/player/play', {
            method: 'PUT',
            headers: this.headers()
          })
        }
      },
      {
        indexes: ["pause"],
        action: () => {
          Jarvis.say("Okay. letss take a break")
          fetch('https://api.spotify.com/v1/me/player/pause', {
            method: 'PUT',
            headers: this.headers()
          })
        }
      },
      {
        indexes: ["next"],
        action: () => {
          Jarvis.say('Okay. skipping ahead')
          fetch('https://api.spotify.com/v1/me/player/next', {
            method: 'POST',
            headers: this.headers()
          })
        }
      },
      {
        indexes: ["previous"],
        action: () => {
          Jarvis.say("You're right, that one was a banger")
          fetch('https://api.spotify.com/v1/me/player/previous', {
            method: 'POST',
            headers: this.headers()
          })
        }
      },
      {
        indexes: ["turn shuffle off"],
        action: () => {
          Jarvis.say('Okay. bye bye shuffle')
          fetch(`https://api.spotify.com/v1/me/player/shuffle?state=false`, {
            method: 'PUT',
            headers: this.headers()
          })
        }
      },
      {
        indexes: ["turn shuffle on"],
        action: () => {
          Jarvis.say('Okay. shuffle time')
          fetch(`https://api.spotify.com/v1/me/player/shuffle?state=true`, {
            method: 'PUT',
            headers: this.headers()
          })
        }
      },
      {
        indexes: ["open devices"],
        action: () => {
          Jarvis.say('Select the device you want to control')
          document.querySelector('.devices-modal-button').click()
        }
      }
    ]
  }

  componentDidMount() {
    document.querySelector("#talkButton").click();
    Jarvis.addCommands(this.commands());

    this.refreshJarvis = setInterval(() => {
      Jarvis.obey()
    }, 20000)
  }

  componentWillUnmount() {
    clearInterval(this.refreshJarvis)
  }

  headers = () => {
    return {
      'Authorization': `Bearer ${this.state.accessToken}`,
      'Content-Type': 'application/json'
    }
  }

  setAccessToken = (accessToken) => {
    this.setState({ accessToken })
  }

  setCurrentTrack = (currentTrack) => {
    this.setState({ currentTrack })
  }

  startAssistant = () => {
    console.log("Artyom succesfully started !");

    Jarvis.initialize({
        lang: "en-GB",
        debug: true,
        continuous: true,
        soundex: true,
        listen: true

    }).then(() => {
        Jarvis.say("Hello. Open Spotify on one of your devices and select it.");

        this.setState({
            artyomActive: true
        });
    }).catch((err) => {
        console.error("Oopsy daisy, this shouldn't happen !", err);
    });
  }


	render () {
		return (
			<div className="homeBody">
        <div style={{position: "absolute", marginLeft: "auto", marginRight: "auto", left: "0", right: "0"}}>
          <p style={{color: 'white', marginLeft: '20px', marginTop: '5px', float: 'left'}}>Say "help" to see list of available voice commands</p>
          <P5Wrapper sketch={Sketch2} />
        </div>

        <SpotifyController accessToken={this.state.accessToken} setAccessToken={this.setAccessToken} currentTrack={this.state.currentTrack} setCurrentTrack={this.setCurrentTrack}/>

        <div style={{position: "relative",zIndex: "99999999999"}}>
          <div id="talkButton" onClick={this.startAssistant}/>
        </div>

        <div className="parent">

          {this.state.currentTrack ? <CreateImage msg={[`${this.state.currentTrack.name}`]}/> : <CreateImage msg={["hello"]}/>}

          <MicrophoneViz />

          <svg preserveAspectRatio="none" id="visualizer" version="1.1" >
            <defs>
              <mask id="mask">
                  <g id="maskGroup">
                </g>
              </mask>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor:'#ff0a0a',stopOpacity:'.75'}} />
                <stop offset="20%" style={{stopColor:'#f1ff0a',stopOpacity:'.75'}} />
                <stop offset="90%" style={{stopColor:'#d923b9',stopOpacity:'.75'}} />
                <stop offset="100%" style={{stopColor:'#050d61',stopOpacity:'.75'}} />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#gradient)" mask="url(#mask)"></rect>
          </svg>

        </div>
			</div>
		);
	}
}
