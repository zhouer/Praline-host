const request = require('request')

var getUTXO = function(address, callback) {
    var url = 'https://blockchain.info/unspent?active=' + address
    request(url, (error, response, body) => {
        try {
            var utxos = JSON.parse(body)['unspent_outputs']
            callback(utxos)
        } catch (err) {
            callback([])
        }
    })
}

var getAllUTXO = function(addresses, callback) {
    var utxos = []
    var count = 0

    if (addresses.length === 0) {
        callback([])
        return
    }

    addresses.forEach((addr) => {
        getUTXO(addr, (outputs) => {
            outputs.forEach((out) => {
                utxos.push({
                    address: addr,
                    txid: out.tx_hash_big_endian,
                    vout: out.tx_output_n,
                    value: out.value,
                    script: out.script,
                    confirmations: out.confirmations
                })
            })
            if (++count === addresses.length) {
                callback(utxos)
            }
        })
    })
}

var getBalance = function(addresses, callback) {
    getAllUTXO(addresses, (utxos) => {
        var balance = 0
        utxos.forEach((utxo) => {
            balance += utxo.value
        })
        callback(balance)
    })
}

var pushTx = function(tx) {
    var url = 'https://blockchain.info/pushtx'
    request.post(url, {form: {tx: tx}}, (error, response, body) => {
        if (error) {
            console.err(body)
        }
    })
}

module.exports.getBalance = getBalance
module.exports.getAllUTXO = getAllUTXO
module.exports.pushTx = pushTx
