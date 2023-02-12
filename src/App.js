import {Component} from 'react'
import './App.css';
import React from 'react';
import Select from 'react-select'
import *as xlsx from 'xlsx';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  LabelList,
  ResponsiveContainer,
  PieChart, Pie, Cell, 
} from "recharts"



const chartType =[{label:'Bar Chart',value:'barchart'},
{label:'Pie Chart',value:'piechart'},
{label:'Donought  Chart',value:'donoughtchart'}]




class App extends Component {

  state ={location:'',year:'',chartType:'barchart',showGraphs:true,filteredData:[], locationOptions:[], yearOptions:[],colourOptions:[],option1:'Option1',option2:'Option2'}

  readExcel = async(e)=>{
   const file= e.target.files[0];
   const data= await file.arrayBuffer(file);
   const excelfile= xlsx.read(data);
   const excelsheet= excelfile.Sheets[excelfile.SheetNames[0]];
   const dummyData= xlsx.utils.sheet_to_json(excelsheet);
   console.log(dummyData);
  
  const locationOptions = []
  const finalLocationOptions = []
  dummyData.map(eachItem=> locationOptions.push(eachItem.location))
  locationOptions.push('All')
  locationOptions.sort()
  const formattedLocationOptions = [...new Set(locationOptions)]
  formattedLocationOptions.map(eachItem=> finalLocationOptions.push({label:eachItem, value:eachItem}))
  formattedLocationOptions.sort()

  const yearOptions = []
  const finalYearOptions = []
  dummyData.map(eachItem=> yearOptions.push(parseInt(eachItem.year)))
  yearOptions.sort()
  yearOptions.unshift('All')

  const formattedYearOptions = [...new Set(yearOptions)]
  formattedYearOptions.map(eachItem=> finalYearOptions.push({label:eachItem, value:eachItem}))

  const colourOptions = []
  dummyData.map(eachItem=> colourOptions.push(eachItem.color))
    console.log(colourOptions)

    Object.keys(dummyData)
    const option1 = Object.keys(dummyData[0])[1]
    const option2 = Object.keys(dummyData[0])[2]
    this.setState({filteredData:dummyData, locationOptions:finalLocationOptions, yearOptions:finalYearOptions,colourOptions, option1,option2})

  }

  getChangedLocationValue = (event)=>{
    // const {location}
    let locationValue=event.value
    // console.log(locationValue)


    this.setState({location:locationValue})
    // this.showGraphFunction()
  }

  getChangedYearValue = (event)=>{
    let yearValue=event.value
    // console.log(yearValue)
   
    this.setState({year:yearValue})
    // this.showGraphFunction()
  }

  getChangedChartTypeValue = (event) =>{
    
    let chartValue=event.value
    // console.log(chartValue)
    
    this.setState({chartType:chartValue})
    // this.showGraphFunction()
  }


  graphDisplayFunction = () =>{
    const {filteredData,chartType,location,year,colourOptions} = this.state
    let pushFilteredData=[]
    if (year==='All' && location!=='All'){
      pushFilteredData = filteredData.filter(eachItem=>(eachItem.location===location))
      console.log(pushFilteredData)
    }
    if (year!=='All' && location==='All'){
      pushFilteredData = filteredData.filter(eachItem=>(parseInt(eachItem.year)===parseInt(year)))
      console.log(pushFilteredData)
    }

    if (year==='All' && location==='All'){
      pushFilteredData = filteredData.filter(eachItem=>(eachItem.location===location && parseInt(eachItem.year)===parseInt(year)))
      console.log(pushFilteredData)
    }
    if (year!=='All' && location!=='All'){
      pushFilteredData = filteredData.filter(eachItem=>(eachItem.location===location && parseInt(eachItem.year)===parseInt(year)))
      console.log(pushFilteredData)
    }

    const lengthOfData= pushFilteredData.length || filteredData.length
    console.log(pushFilteredData)


    const barChartFunction = () =>{ 
      // console.log(props)
      const renderCustomizedLabel = (props) => {
        const {
          x, y, width, height, value,
        } = props;
        console.log('hello')
        let avatarItem
        if (pushFilteredData.length!==0){
          avatarItem = pushFilteredData.filter(eachItem=>eachItem.employee===value)
        }else {
          avatarItem = filteredData.filter(eachItem=>eachItem.employee===value)
        }
        
        console.log(avatarItem[0]['avatar'])
      const fireOffset = value.toString().length < 5;
      const offset = fireOffset ? -40 : 5;
        return (
          <g className='css-icon-image'>
            <text x={x+0.5*width} y={y+15} fill={fireOffset ? "#285A64" :"#fff" } textAnchor="middle" fontSize={10} fontWeight='bold'>
              {value}
            </text>
            <image href={avatarItem[0]['avatar']}  x={x+0.5*width} y={y-45}  height="20px" width="20px" textAnchor="middle"/>
            
            </g>
        );
      };

      return (
        <ResponsiveContainer width="100%" height={400} >
        <BarChart
          data={(pushFilteredData.length===0 && (location==='All' && year==='All'))?(filteredData):(pushFilteredData)}
          margin={{
            top: 100,
          }}
         
        >
          
         
          <Tooltip />
          <Bar dataKey="rank" name="rank" barSize="15%" label={{position:'top'}}>
          <LabelList dataKey="employee" content={renderCustomizedLabel} position="insideRight" style={{ fill: "white" }} />
          {filteredData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colourOptions[index % 20]} />
        ))}
          </Bar>

        </BarChart>
        
        </ResponsiveContainer>
 )
}

    const pieChartFunction = () =>{
      let renderLabel = function(entry) {
        return ([entry.employee,entry.rank]);
    }
   
    return (
      <ResponsiveContainer width="100%" height={500}>
      <PieChart>
        <Pie
          data={(pushFilteredData.length===0 && (location==='All' && year==='All'))?(filteredData):(pushFilteredData)}
          startAngle={0}
          endAngle={360}
          dataKey="rank"
          label={renderLabel} 
        >
          {filteredData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colourOptions[index % 20]} />
        ))}
       
        </Pie>
        
      </PieChart>
    </ResponsiveContainer>
    )
  } 

  const donoughtChartFunction = () =>{
    let renderLabel = function(entry) {
      return ([entry.employee,entry.rank]);
  }
 
  return (
    <ResponsiveContainer width="100%" height={500}>
    <PieChart>
      <Pie
        data={(pushFilteredData.length===0 && (location==='All' && year==='All'))?(filteredData):(pushFilteredData)}
        startAngle={0}
        endAngle={360}
        innerRadius="40%"
        outerRadius="70%"
        dataKey="rank"
        label={renderLabel} 
      >
       {filteredData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colourOptions[index % 20]} />
        ))}
      </Pie>
       
    </PieChart>
  </ResponsiveContainer>
  )
} 

      return (
        <div className="css-charts-container">
        {(pushFilteredData.length===0 && (location!=='All' && year!=='All')) && <h1>No Data Matched</h1>}
        {(chartType==='barchart' && pushFilteredData.length!==0) ? (barChartFunction()):((chartType==='barchart' && (location==='All' && year==='All')) && barChartFunction())}
        {(chartType==='piechart' && pushFilteredData.length!==0) ? (pieChartFunction()):((chartType==='piechart' && (location==='All' && year==='All')) && pieChartFunction())}
        {(chartType==='donoughtchart' && pushFilteredData.length!==0) ? (donoughtChartFunction()):((chartType==='donoughtchart' && (location==='All' && year==='All')) && donoughtChartFunction())}
        </div>
      )
  }


  render(){
    const { filteredData,locationOptions, yearOptions,option1,option2} = this.state

    return (
      <div className="css-bg-container"> 
      <div className='css-select-ccontainer'>
      <div className='css-input-container'>
        <input type="file" className="css-input-itself" onChange={ (e)=>this.readExcel(e)}  />
        </div>
        <div className='css-year-container'>
          <h3>{option1}</h3>
        <Select options={yearOptions} onChange={this.getChangedYearValue} className="css-select-width"/>
        </div>
        <div className='css-location-container'>
        <h3>{option2}</h3>
          <Select options={locationOptions} onChange={this.getChangedLocationValue} className="css-select-width"/>
          </div>
        <div className='css-chartType-container'>
        <h3>Chart Type</h3>
          <Select options={chartType} onChange={this.getChangedChartTypeValue} defaultValue={chartType[0]} className="css-select-width"/>
          </div>
          
      </div>
      {this.graphDisplayFunction()}
    </div>
    )
  }
}


export default App;
