import { io } from "socket.io-client";
import { chainService } from './Blockchain.service'

import TransactionModel from '../models/Transaction.model'
import BlockModel from '../models/Block.model'
import { smartcontractService } from './SmartContractControl.service'

const host = "https://ancient-meadow-63310.herokuapp.com";

const socket_observe_key = {
    // receive
    connected: 'connection',
    getSocketId: 'getId',
    disconnect: 'disconnect',

    getAddNewPatient: 'addNewPatient',
    getSyncData: 'getSyncData',
    //send
    sendNewPatientCreated: 'newPatientCreated',
    sendSyncData: 'syncData',

    getAddNewPrescription: 'addNewPrescription',
    newPrescriptionCreated: 'newPrescriptionCreated',
    newDoctorAdded: 'newDoctorAdded',

    patientList: 'patientList',
    newNodeAdded: 'newNodeAdded',
    updateNode: 'newNodeAdded-directionUpdate'
}

export class SocketService {

    socketIo = undefined
    myId = undefined

    /**
     * 
     * @param {String} data 
     * @param {String} socketId
     */
    sendData = (data, command, socketId = undefined) => {
        if (socketId) {
            this.socketIo.to(socketId).emit(command, data);
        }
        else {
            this.socketIo.emit(command, data);
        }
    }

    sendSMCReturn = (data) => {
        console.log('Send smc data', data);
        this.socketIo.emit('smc_return', data);
    }

    sendSyncData = (who = null) => {
        console.log('Need synd data', who, this.myId);
        if (who == this.myId) {
            chainService.isSyncing = false
            this.onSyncTheChain(chainService.chains)
            return
        }

        console.log('Someone need your chains');
        let transaction = TransactionModel.init(who, chainService.allChainToJson())

        this.sendData(
            transaction.toJson(),
            socket_observe_key.sendSyncData
        )
    }

    needSynchronizeChains = () => {
        console.log('Get sync data');
        chainService.isSyncing = true
        this.socketIo.emit(socket_observe_key.getSyncData)
    }

    /**
     * 
     * @param {TransactionModel} transaction 
     */
    addTransactionToChain = (transaction, finish) => {
        const block = BlockModel.initFromJson(transaction.data)

        if (chainService.addBlockToChain(block)) {
            if (finish) finish(block)
        }
        else {
            console.log('Block is invalid');
            console.log('Block: ', block);
            console.log('Last block: ', chainService.lastBlock);
        }
    }

    /**
     * 
     * @param {BlockModel} block 
     */
    buildSendTransaction = (block) => {
        let sendTrans = TransactionModel.init('miner', block.toJson)
        sendTrans.socketId = 'server'
        sendTrans.data = block.toJson
        return sendTrans
    }

    /**
     * 
     * @param {String} who 
     * @param {TransactionModel} transaction 
     */
    sendPatientsList = (transaction) => {
        this.sendSMCReturn(
            transaction.toJson()
        )
    }

    onSyncTheChain = (data) => {

    }

    onReceiveSmartContract = (param) => { }

    start = () => {
        console.log('Start ...');
        this.socketIo = io(host, {
            withCredentials: true,
            extraHeaders: {
                "hc-header": "abcd"
            }
        })

        this.socketIo.on("connect", () => {
            console.log('Connected');
        });

        this.socketIo.on('getId', data => {
            console.log('get my ID', data);
            this.myId = data
            this.sendData(data, 'miner')
        })

        this.socketIo.on('getChains', socketid => {
            this.sendSyncData(socketid)
        })

        this.socketIo.on("disconnect", (reason) => {
            if (reason === "io server disconnect") {
                // the disconnection was initiated by the server, you need to reconnect manually
                this.socketIo.connect();
            }
            // else the socket will automatically try to reconnect
        });

        this.socketIo.on(socket_observe_key.sendSyncData, data => {
            console.log('Sync chain ', data); // test
            chainService.syncChain(data.data)
            this.onSyncTheChain(chainService.chains)
        })

        this.socketIo.on(socket_observe_key.getAddNewPatient, json => {
            this.addTransactionToChain(TransactionModel.initFromJson(json), block => {
                this.sendData(this.buildSendTransaction(block).toJson(), socket_observe_key.sendNewPatientCreated)
                this.onSyncTheChain(chainService.chains)
            })
        })

        this.socketIo.on('getMaxChain', socketId => {
            console.log('Someone need your valid chain');
            console.log(TransactionModel.init(this.myId, { max: chainService.chains.length }));
            this.socketIo.emit('getMaxChain', TransactionModel.init(this.myId, { max: chainService.chains.length }))
        })

        this.socketIo.on(socket_observe_key.getAddNewPrescription, json => {
            this.addTransactionToChain(TransactionModel.initFromJson(json), block => {
                this.sendData(this.buildSendTransaction(block).toJson(), socket_observe_key.newPrescriptionCreated)
            })
        })

        this.socketIo.on('smc', json => {
            console.log('Receive smart contract request', json);
            smartcontractService.execute(json.creatorKey, json.smcKey, json)
        })

        this.socketIo.on(socket_observe_key.newNodeAdded, json => {
            console.log('New node added', json);
            chainService.addBlockToChain(BlockModel.initFromJson(json.data))
        })

        this.socketIo.on(socket_observe_key.updateNode, json => {
            console.log('New node added', json);
            chainService.addBlockToChain(BlockModel.initFromJson(json.data.block))
            chainService.updateBlockDirection(json.data.direction, json.data.block.index)
            if (chainService.onChainSynced) {
                chainService.onChainSynced()
            }
            
        })

    }

}


export let socketService = Object.seal(new SocketService())