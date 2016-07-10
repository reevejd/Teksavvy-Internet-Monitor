var socket = io()

socket.on('test', function(data) {
    console.log('received data from server')
    console.log(data)
})

