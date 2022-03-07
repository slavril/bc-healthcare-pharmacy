import React, { useState } from "react";
export const StoreContext = React.createContext(null);

export default ({ children }) => {

  const [sharing, setSharing] = useState();
  const [username, setUsername] = useState();
  const [idPrescription, setIdPrescription] = useState();
  const [listPrescription, setListPrescription] = useState();
  const [patient, setPatient] = useState();

  const sharingData = async (data) => {
    setSharing(data)
  }
  const getUsername = async (data) => {
    setUsername(data)
  }
  const getIdPrescription = async (data) => {
    setIdPrescription(data)
  }
  const getListPrescription = async (data) => {
    setListPrescription(data)
  }
  const getPatient = async (data) => {
    setPatient(data)
  }
  const store = { sharing, sharingData, getUsername, username, getIdPrescription, idPrescription, getListPrescription, listPrescription, patient, getPatient }

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};