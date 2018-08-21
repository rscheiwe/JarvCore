import React, {Component } from'react';
// import ReactDOM from 'react-dom';
import P5Wrapper from 'react-p5-wrapper';
import Sketch2 from './sketch2.js'
import './Home.css'
import MicrophoneViz from './MicrophoneViz.js'
import CreateImage from './CreateImage.js'
import ModalPage from './components/ModalPage.js'

// Import the Artyom library
import Artyom from 'artyom.js';
// Import the previously created class to handle the commands from another file
import ArtyomCommands, { ArtyomCommandsManager,
                          spokenword,
                          finalCommand
                         } from './ArtyomCommands.js';

import DeviceList from './components/DeviceList'
import NowPlaying from './components/NowPlaying'
import SearchBar from './components/SearchBar'
import ResultCardsContainer from './components/ResultCardsContainer'

// Create a "globally" accesible instance of Artyom
const Jarvis = new Artyom();
Jarvis.ArtyomVoicesIdentifiers["en-GB"] = ["Google UK English Female", "Google UK English Male", "en-GB", "en_GB"];

export default class Home extends Component {


  constructor (props, context){

    super(props, context);
    // Add `this` context to the handler functions
    this.startAssistant = this.startAssistant.bind(this);
    this.stopAssistant = this.stopAssistant.bind(this);
    // this.speakText = this.speakText.bind(this);
    // this.handleTextareaChange = this.handleTextareaChange.bind(this);

    // Prepare simple state
    this.state = {
        artyomActive: false,
        textareaValue: "",
        artyomIsReading: false,
        finalCommand: "",
        text: 'Richard',
        accessToken: null,
        devices: [],
        deviceId: null,
        currentTrack: null,
        searchResults: [],
        playList: null
        };

    // Load some commands to Artyom using the commands manager
    let CommandsManager = new ArtyomCommandsManager(Jarvis);
    CommandsManager.loadCommands();
    // setInterval(() => console.log(spokenword), 1000)
    // console.log(CommandsManager.loadCommands().spokenword)
}

  // loadVoices = (msg) => {
  //   let timer = setInterval(() => {
  //     let voices = speechSynthesis.getVoices();
  //     // console.log(voices);
  //     if (voices.length !== 0) {
  //       let message = new SpeechSynthesisUtterance(msg);
  //       message.voice = voices[49];
  //       speechSynthesis.speak(message);
  //       clearInterval(timer);
  //       }
  //   }, 20);
  // }

  loadVoices = () => {
    let timer = setInterval(() => {
      let voices = Jarvis.getVoices();
      // console.log(voices);
      if (voices.length !== 0) {
        // let message = new SpeechSynthesisUtterance(msg);
        Jarvis.voice = voices[49];
        // speechSynthesis.speak(message);
        clearInterval(timer);
        }
    }, 20);
  }

  componentDidMount(){
    // if (this.state.finalCommand !== prevState.finalCommand) return true
    document.querySelector("#talkButton").click();

    let accessToken = document.URL.split("token=")[1]

    this.setState({ accessToken }, () => {
      const headers = { 'Authorization': `Bearer ${this.state.accessToken}` }

      fetch('https://api.spotify.com/v1/me/player/devices', {
        method: "GET",
        headers: headers })
        .then(r => r.json())
        .then(({ devices }) => {
          if (!devices) return
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
              if (json === '204'){
                return
              } else if ( this.state.currentTrack === null || json.item.id !== this.state.currentTrack.id ){
                this.setState({ currentTrack: json.item })
              }
            })
          }, 2000)
        })
    })

    this.refreshPlayerStatus = setInterval(() => {
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
          if (json.context === null) {
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
    }, 5000)

    this.deviceRefresh = setInterval(this.refreshDevices, 2000)
  }

  componentWillUnmount() {
    clearInterval(this.trackRefresh)
    clearInterval(this.refreshPlayerStatus)
    clearInterval(this.deviceRefresh)
  }

  refreshDevices = () => {
    fetch('https://api.spotify.com/v1/me/player/devices', {
      method: "GET",
      headers: { 'Authorization': `Bearer ${this.state.accessToken}` }})
      .then(r => r.json())
      .then(({ devices }) => {
        this.setState({ devices })
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
        // Display loaded commands in the console

        console.log(Jarvis.getAvailableCommands());

        Jarvis.say("Hello. Please select your device");

        // Jarvis.say("How are you")

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
    const { devices, deviceId, accessToken, playList, currentTrack, searchResults } = this.state
    // console.log(Artyom.getVoices())
    // console.log(CreateImage.createImage()
		return (
			<div className="homeBody">


        <div style={{position: "absolute", marginLeft: "auto", marginRight: "auto", left: "0", right: "0", width:"900px", height:"200px"}}>

          <P5Wrapper sketch={Sketch2} />

          <CreateImage msg={["hello " + this.state.finalCommand]}/>

        </div>

        <div style={{position: "relative",zIndex: "99999999999"}}>
          <ModalPage devices={devices} accessToken={accessToken} setDeviceId={this.setDeviceId} />
          <div id="talkButton" onClick={this.startAssistant}/>
          <input type="button" value="Stop Artyom" disabled={!this.state.artyomActive} onClick={this.stopAssistant}/>
      </div>

        {/* {this.loadVoices("Hello. I am Jarvis.")} */}

      {spokenword === null ? null : <p>{spokenword}</p>}

       {/* { devices.length === 0 ? <div> Open Spotify on one of our devices to get started <br /> <button onClick={this.refreshDevices}>Refresh device list</button></div> : null }
       { !deviceId ? <DeviceList devices={devices} accessToken={accessToken} setDeviceId={this.setDeviceId} /> : null }
       { currentTrack ? <NowPlaying track={currentTrack}/> : null}
       <SearchBar search={this.search} />
       { searchResults.length !== 0 ? <ResultCardsContainer searchResults={searchResults} accessToken={accessToken} playList={playList} /> : null }
    */}

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
