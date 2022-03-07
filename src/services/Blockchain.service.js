import BlockModel from '../models/Block.model.js'

class BlockChainService {

    isSyncing = false

    /**
     * @type {BlockModel[]} chains
     */
    chains = []

    constructor() {
        this.chains.push(BlockModel.createGenericBlock())
    }

    /**
     * @type {BlockModel}
     */
    get lastBlock() {
        return this.chains[this.chains.length - 1]
    }

    /**
     * 
     * @param {BlockModel} block 
     */
    addBlockToChain = (block) => {
        if (this.isBlockValid(block)) {
            this.chains.push(block)
            return true
        }

        return false
    }

    /**
    * 
    * @param {BlockModel} block 
    */
    isBlockValid = (block) => {
        if (block.previousHash != this.lastBlock.computeHash) {
            return false
        }

        if (JSON.stringify(block.transaction).length > 512) { 
            return false 
        }

        if (block.index === this.lastBlock.index) { 
            return false
        }

        return true
    }

    allChainToJson = () => {
        return this.chains.map(e => {
            return e.toJson
        })
    }

    /**
     * 
     * @param {Object[]} jsons 
     */
    syncChain = (jsons) => {
        this.chains = jsons.map(e => {
            return BlockModel.initFromJson(e)
        })

        this.isSyncing = false
        if (this.onChainSynced) this.onChainSynced()
    }

    onChainSynced = () => {}

}



export let chainService = Object.seal(new BlockChainService())