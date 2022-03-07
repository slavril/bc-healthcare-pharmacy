import { TimeUtil } from '../utils/Time.util'
import { encrypt } from '../utils/Encryptor'

export default class Doctor {

    ID = null
    name = null;
    username = null;
    password = null;

    constructor() {
        this.ID = TimeUtil.currentUTCTimestamp()
    }

    get toJson() {
        return {
            username: this.username,
            name: this.name,
            password: encrypt(this.password, this.password)
        }
    }

    get toJsonString() {
        return JSON.stringify(this.toJson)
    }

    static initFromJson = (json) => {
        let doctor = new Doctor()
        doctor.username = json.username
        doctor.name = json.name
        doctor.password = json.password
        return doctor
    }

}