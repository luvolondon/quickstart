
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
            quickstart_intro = new Quickstart_Intro();
            quickstart_intro.render(true);
        } else {
            if (quickstart_intro) {
                quickstart_intro.close();
            }
        } 
        if (s === "slideshow") {
            quickstart_slideshow = new Quickstart_Slideshow();
            quickstart_slideshow.render(true);
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
      quickstart = new Quickstart();

  });

Hooks.on("ready", () => {
    
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
  