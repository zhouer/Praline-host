const serial = require('./serial.js')
const blockchain = require('./blockchain.js')

var autoConnect = (callback) => {
    serial.connect((comName) => {
        callback(comName)
        // connect again when connect failed or disconnect
        if (!comName) {
            console.log('Reconnect serial port in 3 seconds')
            setTimeout(() => {
                autoConnect(callback)
            }, 3000)
        }
    })
}

var getVersion = (callback) => {
    serial.send('version', [], (data) => {
        callback(data)
    })
}

var send = (toAddress, amount, fee, callback) => {
    serial.send("listaddress", [], (addresses) => {
        blockchain.getAllUTXO(addresses, (utxos) => {
            serial.send("send", [toAddress, amount, fee, utxos], (signedTx) => {
                if (signedTx.length > 0) {
                    blockchain.pushTx(signedTx)
                } else {
                    console.log('Abort')
                }
                callback(signedTx)
            })
        })
    })
}

var getNewAddress = (callback) => {
    serial.send('newaddress', [], (address) => {
        callback(address)
    })
}

var getBalance = (callback) => {
    serial.send("listaddress", [], (addresses) => {
        blockchain.getBalance(addresses, (balance) => {
            callback(balance)
        })
    })
}

var importPrivKey = (privkey, callback) => {
    serial.send("importprivkey", [], (data) => {
        callback(data)
    })
}

module.exports.autoConnect = autoConnect
module.exports.getVersion = getVersion
module.exports.getNewAddress = getNewAddress
module.exports.getBalance = getBalance
module.exports.send = send
module.exports.import = importPrivKey