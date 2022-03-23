import BaseSmartContract from './BaseSmartcontract.smc'
import { chainService } from '../services/Blockchain.service'
import TransactionModel from '../models/Transaction.model'
import { socketService } from '../services/Socket.service'
import PatientModel from '../models/patient.model'
import BlockModel from '../models/Block.model'

import { patientDetailSmartContract } from './PatientDetail.smc'
import { encrypt, decrypt } from '../utils/Encryptor'
import { editPatientSmartContract } from './EditPatient.smc'

class ChangePatientPassword extends BaseSmartContract {

    constructor() {
        super()
        this.creatorKey = 'FF'
        this.contractKey = 'ChangePatientPasswordSmartContract'
    }

    execute = (creatorKey, contractKey, param) => {
        if (!param || !param.userId) { return }
        if (!param || !param.oldPassword) { return }
        if (!param || !param.newPassword) { return }

        let patient = patientDetailSmartContract.getDetail(param.userId, param.oldPassword)
        if (patient) {
            patient.setPassword(param.newPassword)
            const block = editPatientSmartContract.editValue(param.userId, patient)
            if (block !== false) {
                const transaction = TransactionModel.init(null, {
                    smcKey: this.contractKey,
                    patient: param.patient,
                    block: block
                })

                socketService.sendSMCReturn(transaction.toJson())
                return;
            }
        }

        const transaction = TransactionModel.init(null, {
            smcKey: this.contractKey,
            error: 'Wrong information'
        })

        socketService.sendSMCReturn(transaction.toJson())
    }

}

export let changePatientPasswordSmartContract = Object.seal(new ChangePatientPassword())