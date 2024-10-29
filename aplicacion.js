var db = require('./DB')

exports.leer = function (usuario, res) {

    db.buscarPersonas(datos => {
        res.json(validarusuario(datos, usuario))
    });
}

function validarusuario(datos, usuario) {
    for (i = 0; i < datos.length; i++) {
        element = datos[i];
        if (element.Usuario == usuario.usuario && element.Password == usuario.password)
            return element;

    };

    return null;

}





exports.insertar = function (usuario, res) {

    db.insertarPersona(usuario, datos => { res.json(datos) });

}

exports.insertarMedic = function (usuario, res) {

    db.insertarPersonaMed(usuario, datos => { res.json(datos) });

}

exports.loguear = function (login, res) {

    db.loginUsuario(login, datos => { res.json(datos) });

}
exports.buscarMedic = function (usuario, res) {

    db.getMedico(usuario, datos => { res.json(datos) });

}

exports.estadoMedico = function (login, res) {

    db.estadoMedico(login, datos => { res.json(datos) });

}


exports.buscarMedicoEspecialidad = function (usuario, res) {

    db.getMedicoEspecialidad(usuario, datos => { res.json(datos) });

}

exports.buscarTurnosMedicos = function (usuario, res) {

    db.getTurnosMedicos(usuario, datos => { res.json(datos) });

}
exports.DisponibilidadporEspecialidad = function (usuario, res) {

    db.getDisponibilidadporEspecialidad(usuario, datos => { res.json(datos) });

}


exports.getMedicoEspecialidad = function (usuario, res) {
    db.getMedicoEspecialidad(usuario, datos => {
        res.json(datos);
    });
}

exports.getTurnosMedicos = function (usuario, res) {
    db.getTurnosMedicos(usuario, datos => {
        res.json(datos);
    });
}

exports.guardarTurno = function(turno, res) {
    // Llama a la función para guardar el turno en la base de datos
    db.postGuardarTurno(turno, (datos) => {
        res.json(datos);
    });
};

exports.getTurnosMedicos = function(req, res) {
    db.getTurnosTomados(req, (datos) => {
    res.json( datos );
    });
};

exports.historialTurnos = function(req, res) {
    console.log("desde controlador : " , req);
    db.getHistorialTurnos(req, (datos) => {
    res.json( datos );
    });
};

exports.enviarCalificacion = function(req, res) {
    console.log("desde controlador : " , req);
    db.sendCalificacion(req, (datos) => {
    res.json( datos );
    });
};

exports.getCalificaciones = function(req, res) {
    console.log("desde controlador : " , req);
    db.getCalificaionesXidPaciente(req, (datos) => {
    res.json( datos );
    });
};


exports.postGuardarDisponibilidad = function(disponibilidad, callback) {
    // Llama a la función de la base de datos para guardar la disponibilidad
    db.postGuardarDisponibilidad(disponibilidad, (error, datos) => {
        if (error) {
            return callback(error);  // Llamar callback con error si ocurre
        }
        callback(null, datos);  // Llamar callback con los datos si todo fue exitoso
    });
};


exports.getTurnosTomadosCSV = function (usuario, res) {
    db.getTurnosTomadosCSV(usuario, datos => {
        res.json(datos);
    });
}

exports.medicosById = function (usuario, res) {

    db.getBuscarMedicoDni(usuario, datos => { res.json(datos) });

}

exports.updateTurno = function(req, res) {
    // Llama a la función de la base de datos para guardar la disponibilidad
    db.putUpdateTurno(req, (error, datos) => {
        if (error) {
            return res(error);  // Llamar callback con error si ocurre
        }
        res(null, datos);  // Llamar callback con los datos si todo fue exitoso
    });
};
