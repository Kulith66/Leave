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
          <Route path='/add/OneEmpLeave/:employeeId' element={ <OneEmpLeave/>}/>
          <Route path='/create' element={ <CreateLeave/>}/>
      </Routes>
    </>
  )
}

export default App
