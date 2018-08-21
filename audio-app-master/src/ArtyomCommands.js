
let spokenword;
let finalCommand;
let accessToken = document.URL.split('token=')[1]
const headers = {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
}

class ArtyomCommandsManager {

    // The ArtyomCommandsManager class expects as argument in the constructor
    // an already declared instance of Artyom.js
    constructor (ArtyomInstance) {
      

        this._artyom = ArtyomInstance;

        this.setSomeVariable = this.setSomeVariable.bind(this);
    }

    setSomeVariable(spokenword) {
      return spokenword
    }

    // Execute the loadCommands method to inject the methods to the instance of Artyom
    loadCommands(){
        let Artyom = this._artyom;
        // Here you can load all the commands that you want to Artyom
        return Artyom.addCommands([
            {
                indexes: ["Hello"],
                action: () => {
                    Artyom.say("Hello, how are you?");
                }
            },
            {
              indexes: ["Number One", "number Two"],
              action: (i) => {
                if (i === 0) {
                  Artyom.say("You would like the first device?")
                } else if (i === 1) {
                  Artyom.say("You would like the second device?")
                }
              }
            },
            {
                indexes: ["say hi"],
                action: () => {
                    Artyom.say("Hi justine");
                }
            },
            {
                indexes: ["good?"],
                action: () => {
                    Artyom.say("I'm great");
                }
            },
            {
              indexes: ["I want *", "Not *"],
              smart: true,
              action: (i, wildcard) => {
                if (i === 0) {
                  Artyom.say("You want" + wildcard)
                  spokenword = wildcard
                } else if (i === 1) {
                  Artyom.say("Ok, sorry. Please tell me again")
                }
              }
            },
            {
                indexes: ["Yes"],
                action: () => {
                    Artyom.say("great! Searching" + spokenword);
                    // this.setSomeVariable(spokenword)
                    finalCommand = spokenword
                }
            },
            {
                indexes: ["Generate reports of * of this year"],
                smart: true,
                action: (i, month) => {
                    let year = new Date().getFullYear();

                    Artyom.say(`Generating reports of ${month} ${year} `);

                    Artyom.say("Ready ! What were you expecting? write some code you lazy bear !");
                }
            },
            {
              indexes: ["play"],
              action: () => {
                Artyom.say("Okay. let's get this party started")
                fetch('https://api.spotify.com/v1/me/player/play', {
                  method: 'PUT',
                  headers: headers
                })
              }
            },
            {
              indexes: ["pause track"],
              action: () => {
                Artyom.say("Okay. letss take a break")
                fetch('https://api.spotify.com/v1/me/player/pause', {
                  method: 'PUT',
                  headers: headers
                })
              }
            },
            {
              indexes: ["next"],
              action: () => {
                Artyom.say('Okay. skipping ahead')
                fetch('https://api.spotify.com/v1/me/player/next', {
                  method: 'POST',
                  headers: headers
                })
              }
            },
            {
              indexes: ["previous"],
              action: () => {
                Artyom.say("You're right, that one was a banger")
                fetch('https://api.spotify.com/v1/me/player/previous', {
                  method: 'POST',
                  headers: headers
                })
              }
            },
            {
              indexes: ["turn shuffle off"],
              action: () => {
                Artyom.say('Okay. bye bye shuffle')
                fetch(`https://api.spotify.com/v1/me/player/shuffle?state=false`, {
                  method: 'PUT',
                  headers: headers
                })
              }
            },
            {
              indexes: ["turn shuffle on"],
              action: () => {
                Artyom.say('Okay. shuffle time')
                fetch(`https://api.spotify.com/v1/me/player/shuffle?state=true`, {
                  method: 'PUT',
                  headers: headers
                })
              }
            },
        ]);
    }
}

export {
  ArtyomCommandsManager,
  spokenword,
  finalCommand
}
