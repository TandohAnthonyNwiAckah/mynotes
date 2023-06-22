# MY NOTES  APP v1.0.0

## Capture, organize, and never forget a thought with My Note App – your ultimate digital notebook.

The ```My Note App``` is a comprehensive and user-friendly note-taking application that aims to enhance productivity and organization. With its ```intuitive interface, seamless synchronization across devices, advanced organization features```, and robust security measures, the app provides a convenient and secure platform for users to capture, manage, and access their notes. It offers a streamlined note-taking experience, allowing users to focus on their thoughts and ideas without distractions. The app's synchronization feature ensures that notes are always up-to-date and accessible across multiple devices, enabling users to seamlessly switch between devices while maintaining a consistent note-taking workflow. Advanced organization capabilities, such as ``tagging``, make it easy to categorize and search for specific information, ensuring efficient note retrieval. The app also prioritizes the security and privacy of user data, employing encryption techniques and secure communication protocols. 

Overall, the ```My Note App``` is designed to be a reliable and user-centric tool that empowers individuals to capture and organize their ideas effectively, thereby boosting productivity and facilitating seamless information management.

This project comes in Two-part namely the Frontend Part and the Backend Part.


The Backend was built using ```ASP.Net Core``` with ```SQL server``` and the Frontend was built using ```Quasar VueJS``` which gives us a lot of opportunities to deploy on multi-platforms.

Built this project currently for the Web using ```Single Page Application (SPA)```.
This project doesn’t need to reload the page during its use and works within a browser.

For this project to run perfectly, Both the Backend part (.NET Core) and Frontend Part(Quasar) should be running smoothly.

Backend runs on ```port 8006``` whilst the Frontend on ```port 8007``` when running it locally.




## ***PREVIEW***

| HOME PAGE | EXPORT |DETAILS PAGE|
|     ------------- | ------------- | ------------- |
| ![Main Page](screenshots/s0.png)| ![Main Page](screenshots/s1.png)|![Main Page](screenshots/s2.png)|




# FRONTEND PART
For the frontend to work perfectly, the following should be followed. Navigate to the ```frontend folder```
 first


## Install the dependencies
```bash
npm install
```


>Make sure  Quasar CLI is installed before running quasar

```
npm install -g @quasar/cli 
```


### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Build the app for production
```bash
quasar build
```

### Frontend Local URL
```bash
http://localhost:8007
```



### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).




# BACKEND PART

For the backend to work perfectly, the following should be followed. Make sure ```ASP.Net Core SDK``` is downloaded on your system.
Chnage the ConnectionStrings in the appsettings to match your own.


### Test the version of ASP.DOTNET CORE

```bash
dotnet --version
```
Navigate to the backend folder  and 
run the below command
```bash
dotnet run
```


### Backend Local API
```bash

http://localhost:8006

```



# Running on Docker

Change ConnectionStrings in the appsettings from


````
	"DefaultConnectionString": "Server=localhost,1433; Database=MYNOTES; User Id=SA; Password=yourStrong(!)Password;"
````

TO


````
	"DefaultConnectionString": "Server=host.docker.internal,1433; Database=MYNOTES; User Id=SA; Password=yourStrong(!)Password;"
````


Comments url  ```//.UseUrls("http://localhost:8006"); ``` in the Program.cs



Run the  command ````docker run -p 8080:80 tanacom/mynotes````  run the API.

you can Test the API in the browser http://localhost:8080/api/notes  using port 8080.


Connect the new API to the frontend Part.

 When running locally.
````
			API_URL: 'http://localhost:8006/',
			API_PATH: 'http://localhost:8006/api/'

````


When running in Docker.
````
			API_URL: 'http://localhost:8080/',
			API_PATH: 'http://localhost:8080/api/'

````


# TOOLS USED
- Docker
- GIT and GITHUB
- VS CODE
- POSTMAN
- MS SQL SERVER MANAGEMENT STUDIO
- Azure Data Studio (Mac User)






# TODO

- [x] Containerize Backend

- [x] Launch the project on a live server.

- [ ] Custom domain and ssl.


