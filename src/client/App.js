import React, { Component } from 'react'
import socketIOClient from "socket.io-client"; 
import Graphs from './Graphs'

export default class App extends Component {
  
  constructor (props){
    super(props)
    this.state = {
      config: require('./../config.json'),
      timesLoaded: false,
      dataLoaded: false,
      times: [],
      data: []
    }
  }


  componentDidMount(){
    const {config, times, data} = this.state;
    const socket = socketIOClient(config.app.host+":"+config.app.port); 
    
    //new times.star
    socket.on("newTimes", item => {
        this.setState({
          timesLoaded: true,
          times: times.push(item)
        });
    });

    //new data.star
    socket.on("newData", item => {
      this.setState({
        dataLoaded: true,
        data: data.push(item)
      });
    });

  }


  //filter data for graphs
  getXY = () => {
    const {data, times, config } = this.state;
    var starObject = config.files[Object.keys(config.files)[0]]
    var keyName = starObject[Object.keys(starObject)[0]]
    console.log(data)
    var result = {x:0,y:0}
    if (data.length !== 0 && times.length !== 0 ){

      // var abc = data.map ((x) => {
      //   return x
      // })
    }

    return result
  }


  
  render() {
    const {timesLoaded, dataLoaded } = this.state;
    this.getXY()
    if (!(timesLoaded && dataLoaded)) {
      return <div>Loading...</div>;
    } else {
      return (
        //<NavBar />
        //<Activity /> coord = {this.getXY()} 
        <Graphs /> 
        //<Table /> 
        //<div>Hello!!!It is {times._mmsdateAuqired_Value} </div>  
      );
    }
  }
}