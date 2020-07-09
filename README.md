# Cryo EM web monitor 

Web monitor for cryo-em data of the MPIB.


These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 


## Requirements

Installing Node.js
- https://nodejs.org/en/download/


## Run

Navigate to root folder and run:

```bash
npm install   #install node modules
npm run test  #start server & client
```

Links:
- Client: http://localhost:3000

## Configure

Add new data points:
```bash
./src/config.json
```
Edit host and port:
```bash
./.env
./src/config.json
```
## Problems to fix
- Two config sources

## Built With

* [React.js](https://reactjs.org/) - Frontend framework
* [Node.js](https://nodejs.org/en/) - JavaScript runtime environemnt
* [Express.js](https://expressjs.com/) - Backend framework
* [Plot.ly](https://plotly.com/javascript/) - Interactive plots
* [Material-UI](https://material-ui.com/) - UI component library 



## Author

* **[Duc Nguyen](https://github.com/duc-ng)**



