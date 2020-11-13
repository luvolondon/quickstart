# quickstart
A collection of tools to run games for players new to rpgs.
For a start this only is a poc to have a direct login page. Later additions will help to speed up initial character and game selection with story cards and more.

1) Direct Login Page

Send new users an URL to show them a nice intro page and let them enter the game with a single button click.

![Sample direct login page](https://github.com/luvolondon/quickstart/blob/main/screen1.jpg)


The URL has the syntax https://<hostname>/enter?<first 4 digits of the user-id>
  
So if the id of a user is "69YYrJOEWAtB384C" and the FoundryVTT hostname is "myfoundry.example.com" the direct-login URL for this player is

https://myfoundry.example.com/enter?69YY

The image shown is an individual image per user, loaded from the "images" folder. Images get the filename identical to the 4 first digits ("69YY" in the example above).

This only works with a nginx reverse proxy setup like this:
```javascript
location /enter {
      root <absolute path to foundry data>/Data/modules/quickstart;
      try_files $uri  /modules/quickstart/index.html;
}
location /enter/index.html {
     expires 30s;
}
  ``` 
