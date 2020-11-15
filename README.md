# quickstart
A collection of tools to run games for players new to rpgs.

Atm the module contains two tools:
a) Direct Login Page
b) Game setup steps

1) Direct Login Page

Send new users an URL to show them a nice intro page and let them enter the game with a single button click.

![Sample direct login page](https://github.com/luvolondon/quickstart/blob/main/screen1.jpg)


The URL has the syntax https://<i>hostname</i>/enter/ < first 4 digits of the user-id >< player access key >.
  
So if the id of a user is "69YYrJOEWAtB384C" and the FoundryVTT hostname is "myfoundry.example.com" the direct-login URL for this player is

https://myfoundry.example.com/enter/69YY

If the access key for the user is <i>gamenight</i>, the direct-login URL would be

https://myfoundry.example.com/enter/69YYgamenight

The image shown is an individual image per user, loaded from the "login/images" folder. Images get the filename identical to the 4 first digits ("69YY" in the example above) with the ".jpg" suffix.

This only works with a nginx reverse proxy setup like this:
```javascript
map $http_accept_language $lang {
        default en;
        ~de de;
}
server {
  location ~ ^/enter/(?<part>.+)$ {
    rewrite ^ /$lang/enter/$part permanent;
  }
  location ~ /../enter/.+$ {
    rewrite (.*) /modules/quickstart/login/index.html;
  }
}
  ``` 
The above also adds a language code to the URL so that the login page can be shown with localized text. 

2) Game setup steps
The component does control the ui of GM´s and player´s screens based on which step is active:
  "Intro": Shows an intro image, removes all unneeded UI and allows the GM to welcome the players in A/V chat
  "Slideshow": Present a fullscreen slideshow to help the GM introduce the players to the game world, will have teleprompter functionality for the GM
  "setting": tbd, use storycards to interactively generate the setting together with the players
  "characters": let each player choose a character from a setup of pregens suitable for the defined setting
  "tutorial": setup a short tutorial scene with rules and ui explanation
  "game": Move to the real game 

In GM view the GM can move from one step to another with a control window.
  

Change list:

v0.1.4:
Added initial logic for Game setup steps.

v0.1.3:
Moved login stuff to subfolder login. Add language detection and files. Add player access key.

v0.1:
Initial release
