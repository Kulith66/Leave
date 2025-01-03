import React from 'react'
import { Route, Routes} from "react-router-dom"
import LeaveList from './pages/LeaveList'
import AddLeave from './pages/AddLeave'
import CreateType from './pages/CreateType'
import CreateDuration from './pages/CreateDuration'
import LeaveBalance from './pages/LeaveBalance'
import LeaveView from './pages/LeaveView'
import OneEmpLeave from './pages/OneEmpLeave'
import CreateLeave from './pages/CreateLeave'
import Working from './pages/Working'
import Charts from './pages/Charts'
import ChartView from './components/ChartView'
function App() {

  return (
    <>
    <Routes>
          <Route path='/' element={ <LeaveList/>}/>
          <Route path='/add' element={ <AddLeave/>}/>

          <Route path='/create-type' element={ <CreateType/>}/>
          <Route path='/create-period' element={ <CreateDuration/>}/>
          <Route path='/balance' element={ <LeaveBalance/>}/>
          <Route path='leaveView/:leaveId' element={ <LeaveView/>}/>
          <Route path='/OneEmpLeave/:employeeId' element={ <OneEmpLeave/>}/>
          <Route path='/create' element={ <CreateLeave/>}/>
          <Route path='/working/:employeeId' element={ <Working/>}/>
          <Route path='/charts' element={ <Charts/>}/>
          <Route path='/chartView/:employeeId' element={ <ChartView/>}/>


      </Routes>
    </>
  )
}

export default App
