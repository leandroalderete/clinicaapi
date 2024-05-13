
var express = require('express');
var aplicacion = require('./aplicacion')

var app = express();
app.use(express.json());

app.get('/prueba/', (req, res) => {
    
    res.send('hello world');
    
});

app.post('/login/', (req, res) => {
    
    var usuario = req.body;
   
   aplicacion.leer(usuario, res);
   
    
});


app.post('/insertar/', (req, res) => {
    
    var usuario = req.body;
    aplicacion.insertar(usuario, res);
    
});

app.listen( process.env.PORT || 3000, () => {
    console.log('escuchando el puerto');
})