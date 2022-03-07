import BaseSmartContract from './BaseSmartcontract.smc'
import { chainService } from '../services/Blockchain.service'
import TransactionModel from '../models/Transaction.model'
import { socketService } from '../services/Socket.service'
import PatientModel from '../models/patient.model'

class AllPatientSmartContract extends BaseSmartContract {

    constructor() {
        super()
        this.creatorKey = 'FF'
        this.contractKey = 'AllPatientsSmartContract'
    }

    execute = (creatorKey, contractKey, param) => {
        if (!param || !param.socketId) { return }

        const result = this.getAllPatients()

        console.log('Send sync to', result);
        const transaction = TransactionModel.init(param.socketId, {
            smcKey: 'AllPatientsSmartContract',
            patients: result
        })

        socketService.sendSMCReturn(transaction.toJson())
    }

        /**
     * 
     * @returns {PatientModel[]}
     */
         getAllPatients = () => {
            let patients = chainService.chains.filter(e => {
                return (e.type === 'patient')
            })
    
            const result = patients.map(e => { return PatientModel.initFromJson(e.transaction).toJson })
    
            return result
        }

}

export let allPatientSmartContract = Object.seal(new AllPatientSmartContract())