import BaseSmartContract from './BaseSmartcontract.smc'
import { chainService } from '../services/Blockchain.service'
import TransactionModel from '../models/Transaction.model'
import { socketService } from '../services/Socket.service'
import DoctorModel from '../models/Doctor.model'

class GetAllDoctorSmartContract extends BaseSmartContract {

    constructor() {
        super()
        this.creatorKey = 'FF'
        this.contractKey = 'GetAllDoctorSmartContract'
    }

    execute = (creatorKey, contractKey, param) => {
        if (!param || !param.socketId) { return }
        
        const result = this.getAllDoctor()
        console.log('Send sync to', result);
        const transaction = TransactionModel.init(param.socketId, {
            smcKey: 'GetAllDoctorSmartContract',
            doctors: result
        })

        socketService.sendSMCReturn(transaction.toJson())
    }

    /**
     * 
     * @returns {DoctorModel[]}
     */
    getAllDoctor = () => {
        let doctors = chainService.chains.filter(e => {
            return (e.type === 'doctor')
        })

        const result = doctors.map(e => { return DoctorModel.initFromJson(e.transaction).toJson })

        return result
    }

}

export let getAllDoctorSmartContract = Object.seal(new GetAllDoctorSmartContract())