# Cryo-EM data monitor

Monitor for Cryo-EM data of the Max Planck Institute of Biochemistry.

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Latest update

- 17.9.20

  - added plot: images/hour
  - added zoom in/out in miniplots
  - seperate Memory class + dynamic heap allocation + FIFO
  - seperate Filewatcher class
  - robust reader + syncing
  - Test: 10.000 files ✓

- 7.9.20

  - header: scrollable Tabs, hides on scroll, github button
  - global state management (React context API)
  - global theming + darkmode
  - overall speed improvements (less rendering)
  - added sidebar
  - improved filter + datepicker
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
  - ping time-out -> wrong count

## Requirements

To run this application, you will have to install **[Node.js](https://nodejs.org/en/download/)**

- E.g. Linux/ Ubuntu:

```bash
#install node and package manager
sudo apt-get install nodejs
sudo apt-get install npm

#update node to latest version (restart shell first)
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
```

- E.g. Mac:

```bash
brew install node
```

## Run

Run the following commands:

```bash
git clone https://github.com/duc-ng/web-monitoring.git
cd web-monitoring
npm install   #update node modules
npm run build #build app
node app.js  #start server
open http://localhost:5000
```

## Configure

Edit host, port, etc:

```bash
./src/config.json
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

## Built With

- [React.js](https://reactjs.org/) - Frontend framework
- [Material-UI](https://material-ui.com/) - UI component library
- [Plot.ly](https://plotly.com/javascript/) - Interactive plots
- [Node.js](https://nodejs.org/en/) - JavaScript runtime environemnt
- [Express.js](https://expressjs.com/) - Backend framework

## Author

- **[Duc Nguyen](https://github.com/duc-ng)**
