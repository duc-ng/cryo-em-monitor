# Cryo-EM data monitor

Monitor for Cryo-EM data of the Max Planck Institute of Biochemistry.

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Latest update

- 16.11.20

  - API: minimal number of fetching
  - filter: client side -> server side
  - use compression
  - PlotMain: speed up
  - PlotMini: speed up + responsive
  - use minified plotly package
  - Fullscreen only calculated if opened
  - Mini histograms only calculated if opened
  - reduce fetch size 1/3 (no times.star)
  - set environment to "production"
  - aggregate values plotted, if too many
  - (remove data.star info text)
  - loading circle while fetching
  - Scroll to top at end of page
  - rebuild image display

- 08.11.20

  - fix table image still shown after changing page
  - remove header scroll
  - image loading parallelized + image error shown
  - added Test class
  - better structure in config
  - Test: 24.000 datapoints: ~7-8s

- 22.10.20

  - start time: 5-10s
  - fix bugs: image filter, live update, header label, reader
  - added Logger
  - rendering optimized
  - default: data of last 3h
  - reader improved
  - fix: Volume
  - fix: 24h format

- 11.10.20

  - removed websockets
  - replaced react-scrollspy-nav with react-scroll
  - added: API.js
  - reader improved
  - added microscope switching

- 17.9.20

  - added plot: images/hour
  - added zoom in/out in miniplots
  - seperate Memory class + dynamic heap allocation + FIFO
  - seperate Filewatcher class
  - robust reader + syncing
  - Test: 10.000 files ✓

## Requirements

To run this application, you have to install **[Node.js](https://nodejs.org/en/download/)**.

- E.g. Linux/ Ubuntu:

```bash
#install node and package manager
sudo apt install nodejs
sudo apt install npm

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

Get, build and run:

```bash
git clone https://github.com/duc-ng/web-monitoring.git
cd web-monitoring
npm install                   #install node modules
npm audit fix                 #fix modules
npm run build                 #build react app
node app.js                   #start server
```

- The application can be opened at: http://localhost:5000

## Configuration

1. Configure host, port, etc. `src/config.json`
2. Rebuild app: `npm run build`

#### **`app`**

| Name             | Type             | Default                   | Description                                          |
| ---------------- | ---------------- | ------------------------- | ---------------------------------------------------- |
| **api_host**     | String           | "localhost"               | Host                                                 |
| **api_port**     | Number           | 5000                      | Port                                                 |
| **rootDir**      | Path             | "data_test/data4Web"      | path to data directory (relative or absolute)        |
| dataNotOlderThan | Number           | 100                       | data won't be read, if older than x days             |
| refreshDataMs    | Number           | 5000                      | Refresh rate for data fetching in ms                 |
| noData.ms        | Number           | 5000                      | Notification after x ms, if no data has arrived      |
| noData.message   | String           | "No data for 10 seconds." | Notification message                                 |
| heapAllocation   | "auto" or Number | "auto"                    | max. heap size in Byte                               |
| avgDataPointSize | Number           | 1400                      | avg. size of 1 datapoint in Byte for heap allocation |

#### **`key`**

| Name | Type   | Default               | Description            |
| ---- | ------ | --------------------- | ---------------------- |
| key  | String | "\_mmsImageKey_Value" | key name of data point |

#### **`microscopes`**

...

#### **`times.star`**

...

#### **`data.star`**

...

#### **`images.star`**

...

## Development

Start react development server (+auto refresh after save) at: http://localhost:3000

```bash
npm run dev
```

Analyze app size:

```bash
npm run build
npm run analyze
```

Create test .star files:
(Note: only last four datapoints have images)

```bash
node test.js
```

Production:

- change `NODE_ENV=development` to `NODE_ENV=production` in `.env`

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

```

```
