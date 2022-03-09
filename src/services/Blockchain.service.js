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
        if (!block) return false
        
        block.regenerateHash()
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

    updateBlockDirection = (index, value) => {
        let oldIndex = this.chains.findIndex(e => e.index == index)
        if (oldIndex >= 0) {
            this.chains[oldIndex].direction = value
            return true
        }

        return false
    }

    getShadowOf = (index) => {
        return this.chains.find(e => {
            return e.index == index
        })
    }

}



export let chainService = Object.seal(new BlockChainService())