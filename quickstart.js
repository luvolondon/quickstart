
class Quickstart_Intro extends Application {
    constructor( options) {
      super( options);
      
    }
    static get defaultOptions() {

        return mergeObject(super.defaultOptions, {
            id: "quickstart_intro",
          template: "modules/quickstart/templates/intro.html",
          popOut: false,
          title: "Intro"
          
      });
   }
}

class Quickstart_Slideshow extends Application {
    constructor( options) {
      super( options);
      this.show = null;
    }
    static get defaultOptions() {

        return mergeObject(super.defaultOptions, {
            id: "quickstart_slideshow",
          template: "modules/quickstart/templates/slideshow.html",
          popOut: false,
          title: "Slideshow"
          
      });
   }
}

class Quickstart_GM extends Application {
    constructor( options) {
      super( options);
      
    }
    static get defaultOptions() {

        return mergeObject(super.defaultOptions, {
            id: "quickstart_gm",
          template: "modules/quickstart/templates/gm.html",
          popOut: true,
          title: "GM"        
          
      });
   }
}

class Quickstart {
    constructor() {
        
        this.step = null;       
        this.setStep(game.settings.get("quickstart", "step"));

      }
    setStep(s) {
        if (this.step != null) {
            $('body').removeClass("quickstart_" + this.step);
        }
        this.step = s;
        if (s === "intro") {
            if (quickstart_intro == null) {
                quickstart_intro = new Quickstart_Intro();
                quickstart_intro.render(true);
            }
        } else {
            if (quickstart_intro) {
                quickstart_intro.close();
            }
        } 
        if (s === "slideshow") {
            if (quickstart_slideshow == null) {
                quickstart_slideshow = new Quickstart_Slideshow();
                quickstart_slideshow.render(true);
            }

            Hooks.on("renderQuickstart_Slideshow", (app) => {
                let options = {
                    embedded: true
                };
                if (!game.user.isGM) {
                    options =
                    {
                        embedded: true,
                        controls: false,                  
                        controlsTutorial: false,
                        progress: false,                  
                        keyboard: false,              
                        overview: false,
                        touch: false
                    }                
                };    
                app.show = new Reveal( document.querySelector( '.reveal' ), options);
                app.show.initialize();
                if (game.user.isGM) { 
                    app.show.on( 'slidechanged', event => {
                        game.settings.set("quickstart", "substep",event.indexh);
                        console.log("INDEX SEND:",event.indexh);
                        // event.previousSlide, event.currentSlide, event.indexh, event.indexv
                    } );
                }
            });
            

			
        } else {
            if (quickstart_slideshow) {
                quickstart_slideshow.close();
            }
        } 
        $('body').addClass("quickstart_" + this.step);
    }
    stepChanged() {
        const cmd = game.settings.get("quickstart", "step");
        this.setStep(cmd);
    }
    substepChanged() {
        if (!game.user.isGM) { 
            let indexh = game.settings.get("quickstart", "substep");
            console.log("INDEX",indexh);
            if (quickstart_slideshow.show != null)
                quickstart_slideshow.show.slide(indexh,1,1);
        }
    }
}

let quickstart = null;
let quickstart_intro = null;
let quickstart_slideshow = null;
/* -------------------------------------------- */
/*  Hook calls                                  */
/* -------------------------------------------- */
Hooks.on("init", () => {

    Hooks.on("renderPlayerConfig", (app) => {
        setTimeout( function() { app.close(); }.bind(app), 100);        
    });     
  
    game.settings.register("quickstart", "step", {
        name: "Current step",
        hint: "Current step during game setup",
        scope: "world",
        config: true,
        default: "intro",
        type: String,
        choices: {
            "intro": "Intro",
            "slideshow": "Slideshow",
            "setting": "Setting",
            "characters": "Characters",
            "tutorial": "Tutorial",
            "game": "Game"
          },
        onChange: () => quickstart.stepChanged(),
      });
      game.settings.register("quickstart", "substep", {
        name: "Current substep",
        hint: "Current substep in current step",
        scope: "world",
        config: false,
        default: 1,
        type: Number,
        
        onChange: () => quickstart.substepChanged(),
      });
      
  });

Hooks.on("ready", () => {
    if (quickstart == null) {
        quickstart = new Quickstart();

    }

    if (game.user.isGM) {
        //$('body').addClass("quickstart_play");
        const quickstart_gm = new Quickstart_GM();
        quickstart_gm.render(true);

        Hooks.on("renderQuickstart_GM", (app) => {
            $('#quickstart_gm .dialog-button').click( (e) => {
                const cmd = $(e.currentTarget).data("button");                
                game.settings.set("quickstart", "step", cmd);
                
            });
        });
    } else {
        ui.sidebar.collapse();
    }    

    quickstart.stepChanged();

  });
  