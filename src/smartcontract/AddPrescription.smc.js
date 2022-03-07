import BaseSmartContract from './BaseSmartcontract.smc'
import { chainService } from '../services/Blockchain.service'
import TransactionModel from '../models/Transaction.model'
import { socketService } from '../services/Socket.service'
import Prescription from '../models/Prescription.model.js'
import BlockModel from '../models/Block.model'

class AddPrescription extends BaseSmartContract {

    constructor() {
        super()
        this.creatorKey = 'FF'
        this.contractKey = 'AddPrescriptionSmartContract'
    }

    execute = (creatorKey, contractKey, param) => {
        if (!param || !param.prescription) { return }

        let block = new BlockModel()
        block.previousHash = chainService.lastBlock.computeHash
        block.transaction = param.prescription
        block.index = param.prescription.ID
        block.type = 'prescription'

        if (chainService.addBlockToChain(block)) {
            console.log('Added chain success, new chain', chainService.chains);
            const transaction = TransactionModel.init(param.socketId, {
                smcKey: 'AddPrescriptionSmartContract',
                prescription: Prescription.initFromJson(param)
            })

            socketService.sendSMCReturn(transaction.toJson())
            socketService.sendData(TransactionModel.init(null, block.toJson), 'newNodeAdded')
        }
    }

}

export let addPrescriptionSmartContract = Object.seal(new AddPrescription())