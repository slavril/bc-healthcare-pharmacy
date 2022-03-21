import BaseSmartContract from './BaseSmartcontract.smc'
import { chainService } from '../services/Blockchain.service'
import TransactionModel from '../models/Transaction.model'
import { socketService } from '../services/Socket.service'
import PatientModel from '../models/patient.model'
import BlockModel from '../models/Block.model'
import DoctorModel from '../models/Doctor.model'

import { patientDetailSmartContract } from './PatientDetail.smc'
import { getDoctorDetailSmartContract } from './GetDoctorDetail.smc'

class EditDoctor extends BaseSmartContract {

    constructor() {
        super()
        this.creatorKey = 'FF'
        this.contractKey = 'EditDoctorSmartContract'
    }

    execute = (creatorKey, contractKey, param) => {
        if (!param || !param.userId) { return }
        if (!param || !param.doctor) { return }

        const block = this.editValue(param.userId, DoctorModel.initFromJson(param.doctor))
        if (block !== false) {
            const transaction = TransactionModel.init(null, {
                smcKey: 'EditDoctorSmartContract',
                doctor: param.doctor,
                block: block
            })

            socketService.sendSMCReturn(transaction.toJson())
        }
    }

    /**
     * 
     * @param {*} ID 
     * @param {DoctorModel} newData
     */
    editValue = (ID, newData) => {
        let oldBlock = getDoctorDetailSmartContract.getDetailBlock(ID)

        if (oldBlock) {
            let block = new BlockModel()
            block.previousHash = chainService.lastBlock.computeHash
            block.transaction = newData.toJson
            block.type = 'edited-doctor'

            if (chainService.addBlockToChain(block)) {
                console.log('Added chain success, edit doctor');
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

export let editDoctorSmartContract = Object.seal(new EditDoctor())