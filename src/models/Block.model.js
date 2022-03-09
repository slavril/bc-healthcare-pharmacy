import { StringUtil } from '../utils/String.util.js'
import { TimeUtil } from '../utils/Time.util.js'

export const TRANSACTION_TYPE = {
    patient: 'patient',
    prescription: 'prescription',
    doctor: 'doctor'
}

export default class Block {

    index = null //ID
    transaction = null //Data
    timestamp = null
    previousHash = null
    genericBlock = false
    hash = null
    type = null

    direction = null

    get computeHash() {
        if (this.hash) return this.hash
        
        const json = {
            index: this.index,
            transaction: this.transaction,
            timestamp: this.timestamp,
            type: this.type
        }

        this.hash = StringUtil.hash(JSON.stringify(json));
        return this.hash
    }

    constructor() {
        this.timestamp = TimeUtil.currentUTCTimestamp()
        this.index = TimeUtil.currentUTCTimestamp()
    }

    regenerateHash = () => {
        this.hash = null
        this.hash = this.computeHash
    }

    static init = (index, transaction, previousHash, generic = false, createdTime = null, type = null) => {
        let block = new Block()
        block.index = index
        block.transaction = transaction
        block.genericBlock = generic
        block.type = type

        if (!generic) {
            block.previousHash = previousHash
        }

        if (createdTime) {
            block.timestamp = createdTime
        } else {
            block.timestamp = TimeUtil.currentUTCTimestamp()
        }

        return block
    }

    static createGenericBlock = () => {
        return Block.init(0, 'Hello world', null, true)
    }

    static initFromJson = (json) => {
        let block = new Block()

        block.index = json.index
        block.transaction = json.transaction
        block.genericBlock = json.genericBlock
        block.type = json.type
        block.hash = json.hash
        block.direction = json.direction

        if (!json.genericBlock) {
            block.previousHash = json.previousHash
        }

        block.timestamp = json.timestamp

        return block
    }

    get toJson() {
        return {
            index: this.index, //ID
            transaction: this.transaction, //Data
            timestamp: this.timestamp,
            previousHash: this.previousHash,
            genericBlock: this.genericBlock,
            hash: this.computeHash,
            type: this.type,
            direction: this.direction
        }
    }

    get base64Transaction() {
        return JSON.stringify(this.transaction)
        //return btoa(JSON.stringify(this.transaction))
    }

}