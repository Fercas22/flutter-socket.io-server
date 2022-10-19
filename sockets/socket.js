const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Heroes del silencio'));
bands.addBand(new Band('Rammstein'));
bands.addBand(new Band('Enanitos verdes'));

// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => { 
        console.log('Cliente desconectado') 
    });

    client.on('mensaje', ( payload ) => {
        // console.log('Mensaje', payload);
        io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );
    });

    client.on('vote-band', (payload) => {
        // console.log(payload);
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    client.on('add-band', (payload) => {
        // console.log(payload);
        bands.addBand(new Band(payload.name));
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', (payload) => {
        // console.log(payload);
        bands.deleteBands(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    // client.on('emitir-mensaje', (payload) => {
    //     // io.emit('nuevo-mensaje', payload); // Esto emite a todos los clientes conectados
    //     client.broadcast.emit('nuevo-mensaje', payload); // Esto lo emite a todos menos al cliente que lo envío
    // });
});