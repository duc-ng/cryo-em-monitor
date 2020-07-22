# Cryo-EM data monitor 

Web monitor for cryo-em data of the MPIB.


These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

## Latest update
- 22.7.20
  - load test: added sorted array
  - realtime update fixed
  - config: color plots by value
  - add histograms
  - fix: hover on plot shows y-value
  - added fullscreen view
  - added notification, if no data has arrived for time x
  - images not in memory anymore => read with fetch request
  - fix: reading problems with star files

- Problems 
  - Two config sources
  - race condition at client when receiving high volume of datapoints
  - reading delay when folder is added is unsafe
  - live-update does not work on histograms
  - ping time-out -> wrong count


## Requirements

- **[Node.js](https://nodejs.org/en/download/)**


## Run

`cd` to root folder and run:

```bash
npm install   #install node modules
npm run test  #start server & client
```
- Client: http://localhost:3000

## Structure
    ├── app.js                  #server
    │   └── Reader.js         
    │                      
    └── App.js                  #client
        ├── #content
        │   ├── Status.js        
        │   ├── DataContainer.js 
        │   │   ├── Images.js
        │   │   └── Table.js
        │   └── PlotContainer.js     
        │       └── Plot.js           
        └── #more 
            ├── Header.js 
            ├── Footer.js   
            ├── Backdrop.js 
            ├── Card.js   
            └── TableOfContent.js

## Configure

Main configuration file:
```bash
./src/config.json
```
Edit host and port:
```bash
./.env
./src/config.json
```

## Built With

Frontend
* [React.js](https://reactjs.org/) - Frontend framework
* [Material-UI](https://material-ui.com/) - UI component library 
* [Plot.ly](https://plotly.com/javascript/) - Interactive plots

Backend
* [Node.js](https://nodejs.org/en/) - JavaScript runtime environemnt
* [Express.js](https://expressjs.com/) - Backend framework




## Author

* **[Duc Nguyen](https://github.com/duc-ng)**



