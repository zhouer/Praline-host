const SerialPort = require('serialport')
var port, id = 0, callbacks = []

var findDevice = (callback) => {
  SerialPort.list((err, ports) => {
    var found = false

    if (err) {
      console.err(err.message)
      callback(null)
      return
    }

    if (ports.length === 0) {
      // console.log('No ports discovered')
      callback(null)
      return
    }

    ports.forEach(device => {
      if (device.vendorId && device.vendorId.substr(-4, 4).toLowerCase() === '0525' &&
          device.productId && device.productId.substr(-4, 4).toLowerCase() === 'a4a7') {
        found = true
        callback(device)
      }
    })

    if (!found) {
      callback(null)
      // console.log('No matched port')
    }
  })
}

var connect = (callback) => {
  findDevice((device) => {
    if (device) {
      port = new SerialPort(device.comName, {
        baudRate: 115200,
        parser: SerialPort.parsers.readline('\n')
      })
      port.on('open', () => {
        callback(device.comName)
      })
      port.on('close', () => {
        callback(null)
      })
      port.on('data', (data) => {
        var obj = JSON.parse(data)
        if (callbacks[obj.id]) {
          callbacks[obj.id](obj.result)
          callbacks[obj.id] = null
        }
      })
    } else {
      callback(null)
    }
  })
}

var send = (method, params, callback) => {
  var data = {
    method: method,
    params: params,
    id: id
  }

  callbacks[id] = callback

  port.write(JSON.stringify(data) + '\n', () => {
    // console.log('port write')
  })

  id++
}

module.exports.connect = connect
module.exports.send = send
