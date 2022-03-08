import BaseSmartContract from './BaseSmartcontract.smc'
import { chainService } from '../services/Blockchain.service'
import TransactionModel from '../models/Transaction.model'
import { socketService } from '../services/Socket.service'
import PatientModel from '../models/patient.model'
import BlockModel from '../models/Block.model'

class EditPatient extends BaseSmartContract {

    constructor() {
        super()
        this.creatorKey = 'FF'
        this.contractKey = 'EditPatientSmartContract'
    }

    execute = (creatorKey, contractKey, param) => {
        if (!param || !param.patient) { return }

        let block = new BlockModel()
        block.previousHash = chainService.lastBlock.computeHash
        block.transaction = param.patient
        block.index = param.patient.ID
        block.type = 'patient'

        if (chainService.addBlockToChain(block)) {
            console.log('Added chain success, new chain', chainService.chains);
            const transaction = TransactionModel.init(null, {
                smcKey: 'EditPatientSmartContract',
                patient: PatientModel.initFromJson(param)
            })

            socketService.sendSMCReturn(transaction.toJson())
            socketService.sendData(TransactionModel.init(null, block.toJson), 'newNodeAdded')
        }
    }

}

export let editPatientSmartContract = Object.seal(new EditPatient())