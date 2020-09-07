# Cryo-EM data monitor 

Monitor for Cryo-EM data of the Max Planck Institute of Biochemistry.

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

## Latest update
- 7.9.20
  - header: scrollable Tabs, hides on scroll, github button
  - global state management (React context API)
  - global theming + darkmode
  - overall speed improvements (less rendering)
  - added sidebar
  - improved filter
  - code splitting + clean src structure
  - image preview in one row + extension possible
  - image gallery (lazy load) + play button
  - navigation in sidebar
  - update on latest entries in sidebar
  - export (selected) data to .xlsx files
  - display date format in text


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

Run the following commands:

```bash
git clone https://github.com/duc-ng/web-monitoring.git
cd web-monitoring
npm install   #update node modules
npm run test  #start server & client
open http://localhost:3000
```

## App structure
    ├── app.js                  #server
    │   └── Reader.js         
    │                      
    └── App.js                  #client
        ├── site
        │   ├── Header.js        
        │   ├── Footer.js 
        │   └── Sidebar.js   
        │       ├── Navigation.js
        │       ├── Filter.js
        │       └── Updates.js    
        │       
        ├── global 
        │   ├── Data.js 
        │   └── Theme.js  
        │ 
        ├── content
        │   ├── status        
        │   │   └── Status.js
        │   │        
        │   ├── images
        │   │   └── ImageContainer.js
        │   │       └── ImageSelector.js
        │   │           └── imageGallery.css     
        │   ├── table   
        │   │   └── TableContainer.js
        │   │       └── Table.js
        │   │           ├── TableToolbar.js 
        │   │           │   └── TableExport.js     
        │   │           ├── TableHeader.js  
        │   │           └── TableRowSingle.js  
        │   └── plots   
        │       └── PlotContainer.js
        │           ├── PlotsFullscreen.js
        │           └── Plot.js
        │
        ├── utils
        │   └── SmallDivider.js
        │
        └── assets
            └── logo.jpeg
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



