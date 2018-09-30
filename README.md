# JarvCore
#### Inspired by Amazon's Alexa

(JarvCore--aka Jarvify--may be found live [here](http://jarvify.herokuapp.com). To take full advantage of its functionality, a premium membership to Spotify is necessary due to Spotify's new SDK.)

A demo may be found [here](http://richardscheiwe.com/demos).

## Getting Started

If you wish to utilize the voice-controlled, frontend capacities, then it is recommended that you move to JarvCore's frontend, which can be found [here](https://github.com/rscheiwe/JarvCore/tree/master/front-end). The frontend is set-up with a customized build of [Artyom](https://github.com/sdkcarlos/artyom.js/), the speech recognition package used in JarvCore.

JarvCore's [backend](https://github.com/rscheiwe/JarvCore/tree/master/back-end) is currently functioning with Spotify Connect Web Api ([here](https://developer.spotify.com/documentation/web-api/guides/using-connect-web-api/)), which requires a Premium Spotify account for full advantages. However, by simply altering the frontend fetch requests, any API could be used, theoretically.

### Prerequisites

A number of dependencies require installation. Besides [Artyom](https://github.com/sdkcarlos/artyom.js/), a [p5.js wrapper](https://github.com/NeroCor/react-p5-wrapper) is also required for the visualizations.

To build locally, run:

```
npm install
npm start
```
