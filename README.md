# Cryo-EM data monitor

Monitoring application for Cryo-EM data of the Max Planck Institute of Biochemistry.

This application reads data from from multiple microscopic recordings, when saved in _.star_ files, from the filesystem without the need for a database and scales up to 100k and more files. A modern client optimized for desktop and mobile view analyzes and displays the data and images in realtime.

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Latest update

- 08.01.

  - add: AutoDelete (hard drive)
  - various bug fixes
  - test: Windows ✓ 
  - test: Edge ✓ 
  - test: IE ×
  - test: CentOS ✓ 

- 22.12.

  - fix Main plot: points/h
  - fix fullscreen mode

- 14.12.

  - Logging files: rotating days
  - fix webgl not showing plotdata
  - notification, if webgl is not supported
  - ANGLE flag -> readme
  - fix: safari compatibility
  - test on new linux copy
  - plot main: count/h

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

To run this application, you will need to install **[Node.js](https://nodejs.org/en/download/)** (^14.0).

- e.g. Ubuntu:

```bash
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
```

- e.g. CentOs

```bash
dnf module install nodejs:14
```

- e.g. Mac:

```bash
brew install node
```

- e.g. Windows
  
  &rarr; use pre-built _Windows Installer_
  

## Run

Get, build and run:

```bash
#get and configure
git clone https://github.com/duc-ng/cryo-em-monitor.git
cd cryo-em-monitor
vim .env            #set ROOT_DATA to your data folder

#build
npm install
npm run build

#create test files
node test.js        #enter a number and exit with ctrl+c

#start
node app.js         #exit with ctrl+c

#or start with process manager (forever)
npm start
npm stop
```

&rarr; The application can be opened at: http://localhost:5000

## Data directory

This application reads data directly from the filesystem into memory given this fixed folder and file structure:

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
                ├── images.star           #contains names and descriptions of image files
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

| Name           | Type   | Default     | Description                                                                                                                                                   |
| -------------- | ------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NODE_ENV       | String | development | _development_ / _production_: Sets environment in which app is running. Production mode improves performance, e.g. by suppressing console logs, caching, etc. |
| REACT_APP_HOST | String | localhost   | Host                                                                                                                                                          |
| REACT_APP_PORT | Number | 5000        | Port                                                                                                                                                          |
| ROOT_DATA      | Path   | "/Users/duc/cryo-em-monitor/data"     | path to **data** directory (absolute)                                                                                                             |

### **`config.json`**

#### **`app`**

| Name                      | Type              | Default                  | Description                                                                    |
| ------------------------- | ----------------- | ------------------------ | ------------------------------------------------------------------------------ |
| maxDays                   | Integer           | 7                        | Data won't be read, if older than \_ days                                      |
| pollServerMs              | Integer           | 10000                    | Server polling interval in ms                                                  |
| pollClientMs              | Integer           | 30000                    | Client polling interval in ms                                                  |
| notification.ms           | Integer           | 300000                   | Notification: if no data has arrived after \_ ms,                              |
| notification.message      | String            | "No data for 5 minutes." | Notification: message, if no data has arrived                                  |
| autodelete.heapAllocation | "auto" or Integer | "auto"                   | "auto" / max. heap size in Byte : oldest data will be deleted, if heap is full |
| autodelete.isOn           | Boolean           | true                     | Turn on/off auto delete of data on hard drive                                  |
| autodelete.maxFiles       | Integer           | 180                      | Number of last log- and data directories to keep (in Days)                     |

#### **`test`**

| Name      | Type    | Default  | Description                                                                   |
| --------- | ------- | -------- | ----------------------------------------------------------------------------- |
| loopMs    | Integer | 10000    | Interval in ms, when generating test data                                     |
| folder    | String  | "Titan1" | Directory of microscope, where test data is generated                         |
| partial   | Boolean | true     | If true, not all data points will contain images |
| partialProb | Float | 0.7       | % of data points with images         |

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

&rarr; _This configuration is expandable. First value has to be set._

E.g. content of _times.star_:

```bash
data_procTimes

loop_

_mmsImageKey_Value
_mmsdateAuqired_Value
_mmsdateImported_Value
_mmsdateProcessed_Value
_mmsdateExported_Value
_mmsdateError_Value

 22401610646102390	2021-01-08-00:03:11	2021-01-08-00:03:11	2021-01-08-00:03:11	2021-01-08-00:03:11	0
```

#### **`data.star`**

| Name        | Type   | Description                  |
| ----------- | ------ | ---------------------------- |
| label       | String | Title displayed              |
| description | String | Subtitle displayed           |
| value       | String | Value name in .star file     |
| maxOptimum  | Number | max. value for optimal range |
| minOptimum  | Number | min. value for optimal range |

&rarr; _This configuration is expandable._

E.g. content of _data.star_:

```bash
data_measure

loop_
_mmsImageKey_Value
_mmsmean_Value
_mmsdrift_Value
_mmsiciness_Value
_mmsdefocus_Value
_mmsresolution_Value
_mmsccOfCtfFit_Value
_mmsastigmatism_Value
_mmnumberOfParticles_Value

22401610646102390	0.19179381962081998	0.5578357710359079	0.3937294311401236	0.7571168150011385	0.3104739088494066	0.7018363759899893	0.6121199579849954	10
```

#### **`images.star`**

| Name  | Type   | Description              |
| ----- | ------ | ------------------------ |
| label | String | Label displayed          |
| value | String | Value name in .star file |
| info  | String | Info name in .star file  |

&rarr; _This configuration is expandable._

E.g. content of _images.star_:

```bash
data_images

loop_

_mmsImageKey_Value
_mmsrawAvg_Name
_mmsrawAvg_Info
_mmspsRawAvg_Name
_mmspsRawAvg_Info
_mmsmotionCorrAvg_Name
_mmsmotionCorrAvg_Info
_mmspsMotionCorrAvg_Name
_mmspsMotionCorrAvg_Info
_mmsdriftplot_Name
_mmsdriftplot_Info
_mmsctfdiag_Name
_mmsctfdiag_Info
_mmspick_Name
_mmspick_Info

 22401610646102390	rawAvg.png	"Raw Average"	psRawAvg.png	"PowerSpectrum of Raw Average"	motionCorrAvg.png	"MotionCorr Average"	psMotionCorrAvg.png	"PowerSpectrum of Motincorr Average"	driftplot.png	"Driftplot"	ctfdiag.png	"CtfFit Diagnostic"	pick.png	"Particle Positions"
```

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

## Logical app structure

    ├── app.js                  #server
    │   ├── FileWatcher.js
    │   │   ├── Memory.js
    │   │   └── Reader.js
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
        │   ├── Status.js
        │   │
        │   ├── ImageContainer.js
        │   │
        │   ├── TableContainer.js
        │   │   └── Table.js
        │   │       ├── TableToolbar.js
        │   │       │   └── TableExport.js
        │   │       ├── TableHeader.js
        │   │       └── TableRowSingle.js
        │   │
        │   ├── PlotMain.js
        │   │
        │   └── PlotsMini.js
        │       └── PlotsFullscreen.js
        │
        ├── utils
        │   ├── ContentContainer.js
        │   ├── FormatDate.js
        │   ├── ImageDisplay.js
        │   ├── ImageFullscreen.js
        │   ├── PullAndRefresh.js
        │   ├── ScrollToTop.js
        │   ├── DetectWebGL.js
        │   └── SmallDivider.js
        │
        └── assets
            └── logo.jpeg

## Troubleshooting

- **Data won't show up in plots (client).**

  Some components rely on the [WebGL API](https://en.wikipedia.org/wiki/WebGL), which is mostly supported in modern browsers. Simply update your browser to the latest version, which supports WebGL. On older operating systems you may need to set your browser's _ANGLE flag_ to support native OpenGL instead of WebGL.

- **Application gets stuck in "npm run build".**

  Add more RAM to your server environment.

## Built With

- [Node.js](https://nodejs.org/en/) - JavaScript runtime environemnt
- [React.js](https://reactjs.org/) - Frontend framework
- [Express.js](https://expressjs.com/) - Backend framework
- [Material-UI](https://material-ui.com/) - UI component library
- [Plot.ly](https://plotly.com/javascript/) - Interactive plots

## Author

- **[Duc Nguyen](https://github.com/duc-ng)** (Max Planck Institute of Biochemistry)
