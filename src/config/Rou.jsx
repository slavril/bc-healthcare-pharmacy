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
                <Route exact path="/Home" element={<Home />} />
                <Route exact path="/AddPatient" element={<AddPatient />} />
                <Route exact path="/AddDoctor" element={<AddDoctor />} />
            </Routes>
        </StoreProvider>
    )
}
export default Rou