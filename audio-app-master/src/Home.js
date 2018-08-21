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
// Import the previously created class to handle the commands from another file
// import ArtyomCommands, { ArtyomCommandsManager,
//                           spokenword,
//                           finalCommand
//                          } from './ArtyomCommands.js';
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

  constructor (props, context){
    super(props, context);
    // Add `this` context to the handler functions
    this.startAssistant = this.startAssistant.bind(this);
    this.stopAssistant = this.stopAssistant.bind(this);

    // Prepare simple state
    this.state = {
      accessToken: null,
      artyomActive: false,
      textareaValue: "",
      artyomIsReading: false,
      finalCommand: "",
      text: 'Richard'
    };

    // Load some commands to Artyom using the commands manager
    // let CommandsManager = new ArtyomCommandsManager(Jarvis);
    // console.log(props)
    // CommandsManager.loadCommands();
  }

//   finalCommander () {
//     // console.log("HIT")
//     ( () => {
//       return this.setState({finalCommand: finalCommand})
//   })()
// }

  // loadVoices = () => {
  //   let timer = setInterval(() => {
  //     let voices = Jarvis.getVoices()
  //     if (voices.length !== 0) {
  //       Jarvis.voice = voices[49];
  //       clearInterval(timer);
  //       }
  //   }, 20);
  // }

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
        indexes: ["pause track"],
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
          document.querySelector('.devices-modal-button').click()
        }
      }
    ]
  }

  componentDidMount(){
    document.querySelector("#talkButton").click();
    Jarvis.addCommands(this.commands());
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

  startAssistant() {
    let _this = this;

    console.log("Artyom succesfully started !");

    Jarvis.initialize({
        lang: "en-GB",
        debug: true,
        continuous: true,
        soundex: true,
        listen: true

    }).then(() => {
        Jarvis.say("Hello. Open Spotify on one of your devices and select it.");

        _this.setState({
            artyomActive: true
        });
    }).catch((err) => {
        console.error("Oopsy daisy, this shouldn't happen !", err);
    });
  }

  stopAssistant() {
    let _this = this;

    Jarvis.fatality().then(() => {
        console.log("Jarvis has been succesfully stopped");

        _this.setState({
            artyomActive: false,
            finalCommand: finalCommand
        });

    }).catch((err) => {
        console.error("Oopsy daisy, this shouldn't happen neither!", err);

        _this.setState({
            artyomActive: false
      });

    });
  }

	render () {
    console.log(this.state.finalCommand)
		return (
			<div className="homeBody">
        <SpotifyController accessToken={this.state.accessToken} setAccessToken={this.setAccessToken} />

        <div style={{position: "absolute", marginLeft: "auto", marginRight: "auto", left: "0", right: "0", width:"900px", height:"200px"}}>
          <P5Wrapper sketch={Sketch2} />
        </div>

        <div style={{position: "relative",zIndex: "99999999999"}}>
          <div id="talkButton" onClick={this.startAssistant}/>
          {/* <input type="button" value="Stop Artyom" disabled={!this.state.artyomActive} onClick={this.stopAssistant}/> */}
        </div>

        {/* {this.loadVoices("Hello. I am Jarvis.")} */}

        {/*{spokenword === null ? null : <p>{spokenword}</p>} */}

       {/* { devices.length === 0 ? <div> Open Spotify on one of our devices to get started <br /> <button onClick={this.refreshDevices}>Refresh device list</button></div> : null }
       { !deviceId ? <DeviceList devices={devices} accessToken={accessToken} setDeviceId={this.setDeviceId} /> : null } */}
       {/* { currentTrack ? <NowPlaying track={currentTrack}/> : null} */}

        <CreateImage msg={["hello " + this.state.finalCommand]}/>
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

        <h1>In <a href="https://codepen.io/zapplebee/full/gbNbZE/">Full Page view</a>, please allow the use of your microphone</h1>
			</div>
		);
	}
}
