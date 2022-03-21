import BaseSmartContract from './BaseSmartcontract.smc'
import TransactionModel from '../models/Transaction.model'
import { socketService } from '../services/Socket.service'
import { getDoctorDetailSmartContract } from './GetDoctorDetail.smc'
import { editDoctorSmartContract } from './EditDoctor.smc'
import { encryptDR } from '../utils/Encryptor'

class ChangeDoctorPassword extends BaseSmartContract {

    constructor() {
        super()
        this.creatorKey = 'FF'
        this.contractKey = 'ChangeDoctorPasswordSmartContract'
    }

    execute = (creatorKey, contractKey, param) => {
        if (!param || !param.userId) { return }
        if (!param || !param.oldPassword) { return }
        if (!param || !param.newPassword) { return }

        let doctor = getDoctorDetailSmartContract.getDetail(param.userId, param.oldPassword)
        if (doctor) {
            doctor.password = encryptDR(param.newPassword)
            const block = editDoctorSmartContract.editValue(param.userId, doctor)
            
            if (block !== false) {
                const transaction = TransactionModel.init(null, {
                    smcKey: 'ChangeDoctorPasswordSmartContract',
                    doctor: param.doctor,
                    block: block
                })

                socketService.sendSMCReturn(transaction.toJson())
            }
            else {
                const transaction = TransactionModel.init(null, {
                    smcKey: 'ChangeDoctorPasswordSmartContract',
                    error: 'Can not get dr information'
                })

                socketService.sendSMCReturn(transaction.toJson())
            }
        }

    }

}

export let changeDoctorPasswordSmartContract = Object.seal(new ChangeDoctorPassword())