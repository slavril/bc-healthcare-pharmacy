import TransactionModel from '../models/Transaction.model'

export default class BaseSmartContract {

    constructor() { }

    creatorKey = null // key owner created
    contractKey = null // ID of smart contract
    input = null

    /**
     * 
     * @param {String} creatorKey 
     * @param {String} contractKey 
     * @param {Object} inputParams 
     * @return {TransactionModel} result 
     */
    execute = (creatorKey, contractKey, inputParams) => { }

}