# quickstart
A collection of tools to run games for players new to rpgs.

Atm the module contains two tools:
a) Direct Login Page
b) Game setup steps

# This is currently on-hold. The slideshow functionality has been moved into an extra module "slideshow". This code will be adapted shortly.

# a) Direct Login Page

Send new users an URL to show them a nice intro page and let them enter the game with a single button click.

![Sample direct login page](https://github.com/luvolondon/quickstart/blob/main/screens/screen1.jpg)


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


# b) Game setup steps (still work-in-progress)

The GM has a little control window to step through some initial game stages. The user interface of the players is synced to these stages:
 - "Welcome Screen": Shows an intro image, removes all unneeded UI and allows the GM to welcome the players in A/V chat
 - "Slideshow": Present a fullscreen slideshow to help the GM introduce the players to the game world, will have teleprompter functionality for the GM ("Notes")
 - "Setting": tbd, use storycards to interactively generate the setting together with the players
 - "Characters": let each player choose a character from a setup of pregens suitable for the defined setting
 - "Tutorial": setup a short tutorial scene with rules and ui explanation
 - "Game": Move to the real game 

  
![Step control for GM](https://github.com/luvolondon/quickstart/blob/main/screens/screen2.jpg)


## b.1) Setup for "Welcome Screen"
Create a JournalEntry with an image. Under "module settings" select this JournalEntry for "Welcome Screen".

## b.2) Setup for "Slideshow"
Create a master JournalEntry with a text entry containing the list of sections for the slideshow. Select this JournalEntry in the module settings for "Slideshow".
The syntax of the list of sections is taken from the RevealJS library, it is best to copy the html code into the JournalEntry in Source code mode. Example:
```
<section data-audio-src="Slideshow" data-journalentry="The Galaxy">
<h1>The Galaxy</h1>
</section>
<section data-audio-src="Slideshow" data-journalentry="The Senat">
<h1>The Senat</h1>
</section>
<section data-audio-src="Slideshow2" data-journalentry="The Sith Empire">
<h1>The Sith Empire</h1>
</section>
```
"data-audio-src" attribute references the name of a playlist-entry.
"data-journalentry" attribute references the name of the JournalEntry containing an image for this slideshow section. You can also add text to the JournalEntry, it will be shown in the "Notes" popup for the GM when running the slideshow.

![Slideshow Controls](https://github.com/luvolondon/quickstart/blob/main/screens/screen3.jpg)


Change list:

v0.1.7:
Steps "Welcome Screen" and "Slideshow" now working and part of module settings. 

v0.1.6:
Bug fixes. Remove Slideshow controls for non-GM players

v0.1.5: 
Added revealjs library for slideshows. Test slideshow in step "Slideshow".

v0.1.4:
Added initial logic for Game setup steps.

v0.1.3:
Moved login stuff to subfolder login. Add language detection and files. Add player access key.

v0.1:
Initial release
