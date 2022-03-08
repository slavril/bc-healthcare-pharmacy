import React from 'react'
import Home from "../pages/Home"
import AddPatient from "../pages/AddPatient"
import AddDoctor from "../pages/AddDoctor"
import { Route, Routes } from 'react-router-dom'
import StoreProvider from '../context/StoreContext'

function Rou() {
    return (
        <StoreProvider>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/home" element={<Home />} />
                <Route exact path="/add-patient" element={<AddPatient />} />
                <Route exact path="/edit-patient" element={<AddPatient />} />
                <Route exact path="/add-doctor" element={<AddDoctor />} />
            </Routes>
        </StoreProvider>
    )
}
export default Rou