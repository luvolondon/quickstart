# quickstart
A collection of tools to run games for players new to rpgs.
For a start this only is a poc to have a direct login page. Later additions will help to speed up initial character and game selection with story cards and more.

1) Direct Login Page

Send new users an URL to show them a nice intro page and let them enter the game with a single button click.

![Sample direct login page](https://github.com/luvolondon/quickstart/blob/main/screen1.jpg)


The URL has the syntax https://<i>hostname</i>/enter/<first 4 digits of the user-id><player access key>.
  
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

Change list:

v0.1.2:
Moved login stuff to subfolder login. Add language detection and files. Add password.

v0.1:
Initial release
