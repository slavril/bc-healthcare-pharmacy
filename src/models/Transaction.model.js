import { StringUtil } from '../utils/String.util.js'
import { TimeUtil } from '../utils/Time.util.js'

export default class Transaction {

    socketId = null
    timestamp = null
    /**
     * @type {Object} data
     */
    data = null

    constructor() {
        this.timestamp = TimeUtil.currentUTCTimestamp()
    }

    /**
     * 
     * @param {String} jsonString 
     * @returns {Transaction}
     */
    static initFromJson = (json) => {
        let transaction = new Transaction()
        transaction.socketId = json.socketId
        transaction.timestamp = json.timestamp
        transaction.data = json.data

        return transaction
    }

    toJsonString = () => {
        const json = {
            socketId: this.socketId,
            timestamp: this.timestamp,
            data: this.data
        }

        return JSON.stringify(json)
    }

    static init = (socketId, data) => {
        let transaction = new Transaction()
        transaction.socketId = socketId
        transaction.data = data
        return transaction;
    }

    toJson = () => {
        return {
            socketId: this.socketId,
            timestamp: this.timestamp,
            data: this.data
        }
    }

}