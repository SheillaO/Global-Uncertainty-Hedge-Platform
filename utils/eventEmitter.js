import EventEmitter, {eventEmitter} from 'node:events'

const customerDetails = {
    fullName: 'Olly Olly',
    email: 'nairobiolga@gmail.com'
}

const emailRequestEmitter = new EventEmitter()

function generateEmail (customer)

console.log('Email generated for ${customer. email}')
}
emailRequestEmitter.on('emailRequest', generateEmail)
emailRequestEmitter.on('emailRequest', ()=> console.log('task assigned'))
emailRequestEmitter.on('emailRequest', ()=> console.log('email logged'))

setTimeout(())=>{
    emailRequestEmitter.emit('emailRequest', customerDetails}, 3000)
}

