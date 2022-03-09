import BaseSmartContract from './BaseSmartcontract.smc'
import { chainService } from '../services/Blockchain.service'
import TransactionModel from '../models/Transaction.model'
import { socketService } from '../services/Socket.service'
import PatientModel from '../models/patient.model'
import BlockModel from '../models/Block.model'

import { patientDetailSmartContract } from './PatientDetail.smc'

class EditPatient extends BaseSmartContract {

    constructor() {
        super()
        this.creatorKey = 'FF'
        this.contractKey = 'EditPatientSmartContract'
    }

    execute = (creatorKey, contractKey, param) => {
        if (!param || !param.userId) { return }
        if (!param || !param.patient) { return }

        const block = this.editValue(param.userId, PatientModel.initFromJson(param.patient))
        if (block !== false) {
            const transaction = TransactionModel.init(null, {
                smcKey: 'EditPatientSmartContract',
                patient: param.patient,
                block: block
            })

            socketService.sendSMCReturn(transaction.toJson())
        }
    }

    /**
     * 
     * @param {*} ID 
     * @param {PatientModel} newData
     */
    editValue = (ID, newData) => {
        let oldBlock = patientDetailSmartContract.getDetailBlock(ID, null)
        if (oldBlock) {
            let block = new BlockModel()
            block.previousHash = chainService.lastBlock.computeHash
            block.transaction = newData.toJson
            block.type = 'edited-patient'

            if (chainService.addBlockToChain(block)) {
                console.log('Added chain success');
                chainService.updateBlockDirection(oldBlock.index, block.index)

                return {
                    block: block.toJson,
                    direction: oldBlock.index
                }
            }
        }

        return false
    }

}

export let editPatientSmartContract = Object.seal(new EditPatient())