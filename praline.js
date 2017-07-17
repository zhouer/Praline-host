#!/usr/bin/env node

const child_process = require('child_process')
child_process.exec(__dirname + '/node_modules/.bin/electron ' + __dirname, (error) => {
    if (error) {
        console.error(error)
    }
})
