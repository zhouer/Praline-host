const util = require('./util.js')

window.$ = window.jQuery = require('jquery')

var retry = (f, time) => {
    var r = setTimeout(() => {
        retry(f, time)
    }, time)

    f(() => {
        clearTimeout(r)
    })
}

util.autoConnect((comName) => {
    if (comName) {
        // retry until device ready (answer get version call)
        retry((callback) => {
            util.getVersion((version) => {
                $('#device').text(version + ' @ ' + comName)
                util.getBalance((balance) => {
                    $('#balance').text(balance)
                })
                $("button").prop('disabled', false)
                callback()
            })
        }, 1000)
    } else {
        $('#device').text('')
        $('#balance').text('')
        $("button").prop('disabled', true)
    }
})

$('#refresh').click(() => {
    util.getBalance((balance) => {
        $('#balance').text(balance)
    })
})

$('#send').click(() => {
    var toAddress = $('#address').val()
    var amount = parseInt($('#amount').val())
    var fee = parseInt($('#fee').val())
    util.send(toAddress, amount, fee, (signedTx) => {

    })
})

$('#generate').click(() => {
    util.getNewAddress((address) => {
        $('#receiving').text(address)
    })
})

$('#import').click(() => {
    util.importprivkey($('#privkey').val(), () => {

    })
    $('#privkey').val('')
})