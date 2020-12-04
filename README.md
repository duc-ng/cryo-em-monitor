# Cryo-EM data monitor

Monitoring application for Cryo-EM data of the Max Planck Institute of Biochemistry.

This application reads data from from multiple microscopic recordings, when saved in _.star_ files, from the filesystem without the need for a database and scales up to 100k and more files. A modern client optimized for desktop and mobile view will analyze and display the data and images in realtime.

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Latest update

- 25.11.20

  - replace moment.js (deprecated) with date-fns
  - loading circle: orange + more thick
  - node version in Readme
  - description in data.star -> config
  - checked compression level
  - minplots: display "x% plotted" for subsets
  - fix: missing plotdata after fullscreen mode
  - fix: image display bugs
  - add: pull to reload on mobile
  - fix: mobile and layout bugs
  - add: miniplot value filter
  - rewrite: FileWatcher
  - host,port,root -> .env
  - clean: exit handling
  - add: log debug
  - times.star now extendable
  - new colors

- 16.11.20

  - API: minimal number of fetching
  - filter: client side -> server side
  - use compression
  - PlotMain: speed up
  - PlotMini: speed up + responsive
  - use minified plotly package
  - Fullscreen only calculated if opened
  - Mini histograms only calculated if opened
  - reduce fetch size 1/3 (no images.star)
  - set environment to "production"
  - aggregate values plotted, if too many
  - (remove data.star info text)
  - loading circle while fetching
  - Scroll to top at end of page
  - rebuild image display
  - new Filewatcher: watchman

- 08.11.20

  - fix table image still shown after changing page
  - remove header scroll
  - image loading parallelized + image error shown
  - added Test class
  - better structure in config
  - Test: 24.000 datapoints: ~7-8s

## Requirements

To run this application, you will have to install **[Node.js](https://nodejs.org/en/download/)** ^13.12.

- e.g. Linux/ Ubuntu:

```bash
#install node and package manager
sudo apt install nodejs
sudo apt install npm

#update node to latest version (restart shell first)
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
```

- e.g. Mac:

```bash
brew install node
```

## Run

Get, build and run:

```bash
#get and build
git clone https://github.com/duc-ng/web-monitoring.git
cd web-monitoring
npm install
npm run build

#start
node app.js

#or start as daemon
npm start
npm stop
```

- The application can be opened at: http://localhost:5000

## Directory structure

This application reads data directly from the filesystem into memory given a fixed folder and file structure.

```bash
~/ROOT_DATA/microscope/YYYY-MM-DD/key/file
```

e.g.

```bash
./data/Titan3/2020-12-04/91436631163808500/data.star

––– data                                  #root data directory
    ├── Titan1                            #one folder for each microscope
    ├── Titan2
    └── Titan3
        ├── 2020-11-17                    #one directory for each day
        ├── 2020-11-30
        ├── 2020-12-03
        └── 2020-12-04
            ├── 41801567764988104         #one directory per recording
            └── 91436631163808500
                ├── data.star             #contains all data values
                ├── times.star            #contains all recording time values
                ├── images.star           #contains names and descriptions of image files (below)
                ├── ctfdiag.png
                ├── driftplot.png
                ├── motionCorrAvg.png
                ├── pick.png
                ├── psMotionCorrAvg.png
                ├── psRawAvg.png
                └── rawAvg.png
```

## Configuration

1. Configure local environment variables in `./.env`
2. Configure app variables in `./src/config.json`
3. Rebuild app: `npm run build`

### **`.env`**

| Name           | Type   | Default     | Description                                                                                                                                                  |
| -------------- | ------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| NODE_ENV       | String | development | _development_ / _production_: Sets environment in which app is running. Production mode improves performance by e.g. suppressing console logs, caching, etc. |
| REACT_APP_HOST | String | localhost   | Host                                                                                                                                                         |
| REACT_APP_PORT | Number | 5000        | Port                                                                                                                                                         |
| ROOT_DATA      | Path   | "data/"     | path to **data** directory (relative or absolute)                                                                                                            |

### **`config.json`**

#### **`app`**

| Name                   | Type              | Default                  | Description                                                                    |
| ---------------------- | ----------------- | ------------------------ | ------------------------------------------------------------------------------ |
| maxDays                | Integer           | 7                        | Data won't be read, if older than \_ days                                      |
| pollServerMs           | Integer           | 10000                    | Server polling interval in ms                                                  |
| pollClientMs           | Integer           | 20000                    | Client polling interval in ms                                                  |
| notification.ms        | Integer           | 300000                   | Notification: if no data has arrived after \_ ms,                              |
| notification.message   | String            | "No data for 5 minutes." | Notification: message, if no data has arrived                                  |
| heapAllocation         | "auto" or Integer | "auto"                   | "auto" / max. heap size in Byte : oldest data will be deleted, if heap is full |
| autodelete.isOn        | Boolean           | true                     | Turn on/off auto delete of data on hard drive                                  |
| autodelete.maxLogDays  | Integer           | 14                       | Keep last \_ days of logfiles                                                  |
| autodelete.maxDataSize | Integer           | 50000                    | Delete oldest data on hard drive, if total size \_ in MB is reached            |

#### **`test`**

| Name      | Type    | Default  | Description                                                        |
| --------- | ------- | -------- | ------------------------------------------------------------------ |
| loopMs    | Integer | 10       | Interval in ms, when generating test data                          |
| folder    | String  | "Titan1" | Directory of microscope, where test data is generated              |
| partial   | Boolean | true     | wether all test data should contain test images (to save up space) |
| partialNr | Integer | 10       | only last \_ data points generated will contain test images        |

#### **`microscopes`**

| Name   | Type   | Description                  |
| ------ | ------ | ---------------------------- |
| label  | String | Name of microscope displayed |
| folder | String | Directory of microscope      |

_This configuration is expandable._

#### **`key`**

| Name | Type   | Default               | Description        |
| ---- | ------ | --------------------- | ------------------ |
| key  | String | "\_mmsImageKey_Value" | key in .star files |

#### **`times.star`**

| Name  | Type   | Description              |
| ----- | ------ | ------------------------ |
| label | String | Label displayed          |
| value | String | Value name in .star file |

_This configuration is expandable. First value is main value and has to be set._

#### **`data.star`**

| Name        | Type   | Description                  |
| ----------- | ------ | ---------------------------- |
| label       | String | Title displayed              |
| description | String | Subtitle displayed           |
| value       | String | Value name in .star file     |
| maxOptimum  | Number | max. value for optimal range |
| minOptimum  | Number | min. value for optimal range |

_This configuration is expandable._

#### **`images.star`**

| Name  | Type   | Description              |
| ----- | ------ | ------------------------ |
| label | String | Label displayed          |
| value | String | Value name in .star file |
| info  | String | Info name in .star file  |

_This configuration is expandable._

## Development

Start react development server at: http://localhost:3000
(easier development with auto refresh after save and no need of building app after changes)

```bash
npm run dev                  #server & client (+auto refresh)

  #or

npm run devclient            #client (+auto refresh)
npm run devserver            #server (+auto refresh)
```

Analyze app size:

```bash
npm run build
npm run analyze
```

Create test .star files:

```bash
node test.js
```

Production:

- build app with `npm run build`
- set `NODE_ENV` to `production` in `.env`

## Logical application structure

    ├── app.js                  #server
    │   ├── FileWatcher.js
    │   ├── Memory.js
    │   ├── Reader.js
    │   ├── Logger.js
    │   └── AutoDelete.js
    │
    └── App.js                  #client
        ├── site
        │   ├── Header.js
        │   ├── Footer.js
        │   ├── API.js
        │   └── Sidebar.js
        │       ├── Navigation.js
        │       ├── Filter.js
        │       ├── Sidebar.js
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
        │   │
        │   ├── table
        │   │   └── TableContainer.js
        │   │       └── Table.js
        │   │           ├── TableToolbar.js
        │   │           │   └── TableExport.js
        │   │           ├── TableHeader.js
        │   │           └── TableRowSingle.js
        │   │
        │   ├── plotMain
        │   │   └── PlotMain.js
        │   │
        │   └── plotsMini
        │       └── PlotsMini.js
        │           └── PlotsFullscreen.js
        │
        ├── utils
        │   ├── ContentContainer.js
        │   ├── FormatDate.js
        │   ├── ImageDisplay.js
        │   ├── ImageFullscreen.js
        │   ├── PullAndRefresh.js
        │   ├── ScrollToTop.js
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
- and more..

## Author

- **[Duc Nguyen](https://github.com/duc-ng)** (Max Planck Institute of Biochemistry)
