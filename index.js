
var express = require('express');
var aplicacion = require('./aplicacion')
var cors = require('cors');
var app = express();
app.use(express.json());
app.use(cors());

/*const corsOptions = {
    origin: 'https://leandro_alderete-clinicaapi.mdbgo.io', // Reemplaza con el dominio permitido
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));*/

app.get('/prueba/', (req, res) => {
    
    res.send('hello world');
    
});

app.post('/login/', (req, res) => {
    
    var usuario = req.body;
    
   
   aplicacion.leer(usuario, res);
   
    
});


app.post('/insertar/', (req, res) => {  // registros de usuarios 
    
    var usuario = req.body;
    aplicacion.insertar(usuario, res);
    
});

app.post('/insertarMedic/', (req, res) => {  // registros de usuarios 
    
    var usuario = req.body;
    aplicacion.insertarMedic(usuario, res);
    
});

app.post('/loguear/', (req, res) => {  /// log de usuario 
    
    var login = req.body;
    console.log ("sadasd"+login.tipoUsuario);
    aplicacion.loguear(login, res); //paso la misma variable 
    
});

app.get('/medicos/', (req, res) => {
   var med=req.body;
    aplicacion.buscarMedic(med,res);
   
});


app.post('/estadoMedico/', (req, res) => {  /// log de usuario 
    
    var login = req.body;
    aplicacion.estadoMedico(login,res);  //paso la misma variable 

    
    
});

app.post('/medicosEspecialidad', (req, res) => {
    var med=req.body;
     aplicacion.buscarMedicoEspecialidad(med,res);
    
 });

 app.post('/turnosMedicos', (req, res) => {
    var med=req.body;
     aplicacion.buscarTurnosMedicos(med,res);
    
 });

 app.get('/disponibilidadPorEsp', (req, res) => {
    var med=req.query;
    
     aplicacion.DisponibilidadporEspecialidad(med,res);
    
 });

 // Obtener médicos por especialidad
app.get('/medico/especialidad', (req, res) => {
    const medico = req.query; // Almacenas el objeto de consulta
    aplicacion.getMedicoEspecialidad(medico, res);
});

// Obtener turnos de médicos
app.get('/turnos/medicos', (req, res) => {
    const medicoTurnos = req.query; 
    aplicacion.getTurnosMedicos(medicoTurnos, res);
});

app.post('/guardarTurno', (req, res) => {  
    var turno = req.body;
    console.log("datos que vienen :", turno);
    aplicacion.guardarTurno(turno, res);
});

app.get('/turnosTomados', (req, res) => {
    const medicoTurnos = req.query; 
    console.log("datos que entran : ", medicoTurnos);
    aplicacion.getTurnosMedicos(medicoTurnos, res);
});


app.get('/historialTurnos/:id_paciente', (req, res) => { 
    const pac = req.params.id_paciente; 
    const option = req.query.opcion
    console.log("id_paciente", pac);

    aplicacion.historialTurnos({ id_paciente: pac , opcion: option}, res);
});

app.post('/enviarCalificacion',(req, res) => { 
    const calificacion = req.body; 
    console.log("calificacion", calificacion);
    aplicacion.enviarCalificacion( calificacion , res);
});

app.get('/calificaciones', (req, res) => {
    const id_paciente = req.query.id_paciente;    
    console.log("datos que entran : ", id_paciente);
    aplicacion.getCalificaciones(id_paciente, res);
});

app.post('/guardarDisponibilidad', (req, res) => {
    var disponibilidad = req.body;
    console.log("Datos que vienen del cliente: ", disponibilidad);
    
    aplicacion.postGuardarDisponibilidad(disponibilidad, (error, resultado) => {
        if (error) {
            console.error("Error al guardar disponibilidad:", error);
            return res.status(500).json({ error: 'Error al guardar la disponibilidad' });
        }
        res.json({ message: 'Disponibilidad guardada exitosamente', resultado });
    });
});


app.get('/turnosTomadosCSV', (req, res) => {
    const medico = req.query; 
    console.log("TURNOS PARA CSV : ", medico);
    aplicacion.getTurnosTomadosCSV(medico.dni_medico, res);
});

app.get('/medicosById', (req, res) => {  //consulta mdeico en el back service 
    var med=req.query;
    
     aplicacion.medicosById(med,res);
    
 });

/*app.post('/probar/', (req, res) => {
    
    
    var token=req.headers.authorization;
    
    if ((!token) || token.indexOf("Bearer ") == -1) res.sendStatus(401);
    try {
        var usuario= jwt.verify(token.replace("Bearer ", ""), "superclave");
        res.json(JSON.stringify( usuario));
    } catch (error) {
         res.sendStatus(401);
    }
    
});*/


app.listen( process.env.PORT || 3000, () => {
    console.log('escuchando el puerto');
})

app.put('/updateTurno', (req, res) => {
    var updateTurno = req.query;
    console.log("Datos que vienen del cliente: ", updateTurno);
    
    aplicacion.updateTurno(updateTurno, (error, resultado) => {
        res.json({ message: 'Disponibilidad guardada exitosamente', resultado });
    });
});