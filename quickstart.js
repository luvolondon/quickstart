
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

class Quickstart_Slideshow_Notes extends Application {
    constructor( options) {
      super( options);
      this.show = null;
    }
    static get defaultOptions() {

        return mergeObject(super.defaultOptions, {
            id: "quickstart_slideshow_notes",
          template: "modules/quickstart/templates/slideshow_notes.html",
          popOut: true,
          resizable: true,
          width: 600,
          height: 300,
          title: 'Slideshow Notes (Hit "O" to toggle Overview mode)'
          
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
          width: 150,
          title: "GM"        
          
      });
   }
}

class Quickstart {
    constructor() {
        
        this.step = null;       
        this.setStep(game.settings.get("quickstart", "step"));

      }
      getJournalEntries() {
          let ret = {};
          ret[ "#" ] = "Choose Template";
          game.journal.forEach( function(e) { ret[ e.data._id] = e.data.name; });
          return ret;
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
                Hooks.on("renderQuickstart_Intro", (app) => {
                    const intro_template = game.settings.get("quickstart", "welcomescreen"); 
                    const journal = game.journal;        
                    if (intro_template != "#") {
                        const intro = journal.get(intro_template);
                        if (intro != null) {
                            const intro_img = intro.data.img;
                            $("#quickstart_intro").css('background-image', 'url(' + intro_img + ')');
                        }
                    }
                });
                
            }
        } else {
            if (quickstart_intro) {
                quickstart_intro.close();
                quickstart_intro = null;
            }
        } 

        if (s === "slideshow") {
            if (quickstart_slideshow == null) {
                quickstart_slideshow = new Quickstart_Slideshow();
                quickstart_slideshow.render(true);                

            }
            if (game.user.isGM) {
                if (quickstart_slideshow_notes == null) {
                    quickstart_slideshow_notes = new Quickstart_Slideshow_Notes();
                    quickstart_slideshow_notes.render(true);
                    
                }
            }
            Hooks.on("renderQuickstart_Slideshow_Notes", (app) => {

                window.RevealAudioSlideshow.updateNotes(quickstart_slideshow.show);
                $('#quickstart_slideshow_notes .controls .left').off("click");
                $('#quickstart_slideshow_notes .controls .right').off("click");

                $('#quickstart_slideshow_notes .controls .left').click( function() {                    
                    quickstart_slideshow.show.prev(); 
                });
                $('#quickstart_slideshow_notes .controls .right').click( function() {                    
                    quickstart_slideshow.show.next(); 
                });
            });
            Hooks.on("renderQuickstart_Slideshow", (app) => {
                const slideshow_template = game.settings.get("quickstart", "slideshow"); 
                const journal = game.journal;        
                if (slideshow_template != "#") {
                    const sections = journal.get(slideshow_template);
                    if (sections != null) {
                        const sections_content = sections.data.content;
                        $("#quickstart_slideshow .reveal .slides").html(sections_content);
                    }
                }
                
                if (journal != null) {
                    $("#quickstart_slideshow section").each( function(index) {                            
                        const note = journal.getName($(this).attr('data-journalentry'));                                    
                        if ( note != null ) {                            
                            const img = note.data.img;
                            if (img != null) {
                                $(this).attr('data-background-image',img);
                            }
                        }
                    });
                }    
                let options = {
                    embedded: true,
                    controls: false,    
                    plugins: [ RevealAudioSlideshow]
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
                        touch: false,
                        plugins: [ RevealAudioSlideshow]
                    }                
                };    
                if (app.show == null)  {
                    
                    app.show = new Reveal( document.querySelector( '.reveal' ), options);
                    app.show.initialize({
                        audio: {
                            defaultAudios:false,
                            autoplay:true
                        }
                    });
                    if (game.user.isGM) { 
                        app.show.on( 'slidechanged', event => {
                            game.settings.set("quickstart", "substep",event.indexh);                            
                        } );
                    } 
                    let indexh = game.settings.get("quickstart", "substep");
                    
                    if (indexh > 0) {
                        if (app.show != null)
                            setTimeout( function() { app.show.slide(indexh,1,1) }.bind(app,indexh), 100); 
                    }
                    
                }
                
            });
            

			
        } else {
            if (quickstart_slideshow) {
                window.RevealAudioSlideshow.stop(quickstart_slideshow.show);
                $('.reveal').remove();
                quickstart_slideshow.close();
                quickstart_slideshow = null;
            }
            if (quickstart_slideshow_notes) {
                quickstart_slideshow_notes.close();
                quickstart_slideshow_notes = null;
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
            
            if (quickstart_slideshow.show != null)
                quickstart_slideshow.show.slide(indexh,1,1);
        }
    }
}

let quickstart = null;
let quickstart_intro = null;
let quickstart_slideshow = null;
let quickstart_slideshow_notes = null;
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
            "intro": "Welcome Screen",
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
    game.settings.register("quickstart", "welcomescreen", {
        name: "Welcome Screen Image",
        hint: "Reference to a JournalEntry containing the image for the Welcome Screen",
        scope: "world",
        config: true,
        default: "#",
        type: String,
        choices: quickstart.getJournalEntries(),
        onChange: () => function() {},
      });
      game.settings.register("quickstart", "slideshow", {
        name: "Slideshow Template",
        hint: "Reference to a JournalEntry containing the template for the slideshow",
        scope: "world",
        config: true,
        default: "#",
        type: String,
        choices: quickstart.getJournalEntries(),
        onChange: () => function() {},
      });
      
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
  