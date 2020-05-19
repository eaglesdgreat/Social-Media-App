# Social Media App
This is the code repository for [Social Media App](https://www.packtpub.com/web-development/full-stack-react-projects?utm_source=github&utm_medium=repository&utm_campaign=9781788835534), published on github by [Okponobi Emmanuel](https://github.com/eaglesdgreat). It contains all the app supporting code files necessary to work through the project from start to finish and the final production and deployment app.

## About the Application
The Social Media App is a great app inspired by existing social media platforms and can render some great and basic feature a socil media app should have. It's still in for more development and expansion of features and at the moment it has features like:

* User authentication and authorization
* List of available signup users,
* User Profile page
* Home/ Landing page
* Add post in feed
* view list of post on user feed
* Add followers and following
* Like/Unlike a post and Comment/Uncomment on a post
* Signup/ Signin pages
* Edit and Delete a user account
* Add Profile Picture
* Can find list of people not following

The above listed are the frontend features of the application built with React, also there are the backend feature using CRUD method and built in Node which you can use to query the database and get all data of a user and their posts, commnets and likes. The database used is MongoDB with mongoose for the models and express is used for building the APIs' routing and controll.

There is also a server side rendering which render the application including the css and react routing from the backend and sent to the frontend which take over the rendering and display the requested view, the server side rendering also help in sending data needed by a perticular component and help in refreshing of page on the browser.

There are other configuration like webpack, babel that build the app and bundle to dist folder and also check for javascript ES2015 and above. The webpack is divided into 3 paart the server config file and 2 client config files for the client files one is for production environment and the other is for development environment. To run the production environment you need to comment out the two lines of code below on the server.js file
```
import devBundle from './devBundle'
devBundle.compile(app)
```
## Instructions on Folders
All of the code is organized into folders. Each folder specify the part the code below whether is the client app which are in the client folder or the server app which are in the server folder or the bundled app in the dist folder. There are also other folders like the config which contain some of the configuration needed for the app, view for the html template to render the app on the browser and the style which contain the basic style sheared by the client and server app.
