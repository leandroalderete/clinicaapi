const mysql = require('mysql');

// Crear un pool de conexiones
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'mysql.db.mdbgo.com',
    user: 'leandro_alderete_leandroalderete',
    password: 'Lean_cabj_12$',
    database: 'leandro_alderete_clinica',
    port: 3306
});

function ejecutarConsulta(query, callback) {
    pool.query(query, (err, resultado, filas) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return callback(err);
        }
        callback(null, resultado);
    });
}

exports.buscarPersonas = function (respuesta) {
    const query = "SELECT * FROM Usuario";
    ejecutarConsulta(query, (err, resultado) => {
        if (err) {
            return respuesta(err);
        }
        respuesta(resultado);
    });
}

exports.insertarPersona = function (usuario, retornar) {
    const sql = `INSERT INTO Afiliados (dni, nombre, apellido, email, telefono, contra, credencial) VALUES ('${usuario.dni}', '${usuario.nombre}', '${usuario.apellido}', '${usuario.email}', '${usuario.telefono}', '${usuario.contra}', '${usuario.credencial}')`;
    ejecutarConsulta(sql, (err, resultado) => {
        if (err) {
            return retornar(err);
        }
        retornar(resultado);
    });
}

exports.insertarPersonaMed = function (usuario, retornar) {
    const sql = `INSERT INTO Medicos (dni, nombre, apellido, email, telefono, contra, especialidad, matricula, habilitado) VALUES ('${usuario.dni}', '${usuario.nombre}', '${usuario.apellido}', '${usuario.email}', '${usuario.telefono}', '${usuario.contra}', '${usuario.especialidad}', '${usuario.matricula}', '${usuario.habilitado}')`;
    ejecutarConsulta(sql, (err, resultado) => {
        if (err) {
            return retornar(err);
        }
        retornar(resultado);
    });
}

exports.loginUsuario = function (usuario, retornar) {
    let sql = '';
    if (usuario.tipoUsuario === 'Afiliado') {
        sql = `SELECT dni, contra FROM Afiliados WHERE dni = '${usuario.dni}' AND contra = '${usuario.contra}'`;
    } else if (usuario.tipoUsuario === 'medico') {
        sql = `SELECT dni, contra FROM Medicos WHERE dni = '${usuario.dni}' AND contra = '${usuario.contra}'`;
    } else if (usuario.tipoUsuario === 'admin') {
        sql = `SELECT dni, contra FROM Admin WHERE dni = '${usuario.dni}' AND contra = '${usuario.contra}'`;
    }

    ejecutarConsulta(sql, (err, resultado) => {
        if (err) {
            return retornar(err);
        }
        retornar(resultado);
    });
}

exports.getMedico = function (usuario, retornar) {
    const query = 'SELECT * FROM Medicos';
    ejecutarConsulta(query, (err, resultado) => {
        if (err) {
            return retornar(err);
        }
        retornar(resultado);
    });
}

exports.estadoMedico = function (login, retornar) {
    const query = `UPDATE Medicos SET habilitado = '${login.habilitado}' WHERE matricula = '${login.matricula}'`;
    ejecutarConsulta(query, (err, resultado) => {
        if (err) {
            return retornar(err);
        }
        retornar(resultado);
    });
}

exports.getMedicoEspecialidad = function (req, retornar) {
    const query = `SELECT * FROM Medicos WHERE especialidad = '${req.especialidad}' AND estado = 'habilitado'`;
    ejecutarConsulta(query, (err, resultado) => {
        if (err) {
            return retornar(err);
        }
        retornar(resultado);
    });
}



exports.getDisponibilidadporEspecialidad = function (req, retornar) {
    const query = `SELECT * FROM Disponibilidad WHERE especialidad = '${req.especialidad}'`;
    console.log("hola;", req);
    ejecutarConsulta(query, (err, resultado) => {
        if (err) {
            return retornar(err);
        }
        console.log("prueba ",resultado)
        retornar(resultado);
    });


}

exports.postGuardarTurno = function (req, res) {
    console.log("req: ", req)
    const { dni_paciente, dni_medico, fechaturno, hora } = req;

    const observaciones = "no aplica";
    const estado = "confirmado";
    const calificacion = "a confirmar";
    const activo = 1;

    // Modifica 'dia' a 'fecha' para que coincida con la estructura de tu base de datos
    const query = `INSERT INTO Turnos (dni_paciente, dni_medico, fechaturno, hora, observaciones, estado, calificacion, activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    console.log("query : ", query);
    pool.query(query, [dni_paciente, dni_medico, fechaturno, hora, observaciones, estado, calificacion, activo], ( results) => {
        console.log("resultado", results);
        res(results);
    });
};

exports.getTurnosTomados = function (req, res) {
    console.log("entrante : ", req);
    const {medicoId,dia} = req;

    const query = `
        SELECT hora 
        FROM Turnos
        WHERE dni_medico = ? 
        AND fechaturno= ?
    `;

    console.log("datos entrantes : ", medicoId + "  " + dia);
    pool.query(query,[medicoId, dia], (err, resultado) => {
        if (err) {
            console.error('Error al obtener disponibilidad:', err);
            return res(null);
        }
        console.log("Consulta a ejecutar:", query);
        console.log("horarios encontrados:", resultado);
        return res(resultado);
    });
}

exports.getHistorialTurnos = function (req, retornar) {
    const { id_paciente, opcion} = req;

    console.log("id paciente: ", id_paciente)
    console.log("opcion: " + opcion);

    if(opcion == 1){
        const query = `SELECT * FROM Turnos WHERE dni_paciente = ?`;
        pool.query(query,[id_paciente], function(err, resultado) {
            if (err) {
                console.error('Error al obtener turnos:', err);
                return retornar(null);
            }
            console.log("Turnos obtenidos:", resultado);
            retornar(resultado);
        });
    }else if( opcion == 2){
        const query = `SELECT * FROM Turnos WHERE dni_paciente = ? AND estado = "confirmado"`;
        pool.query(query,[id_paciente], function(err, resultado) {
            if (err) {
                console.error('Error al obtener turnos:', err);
                return retornar(null);
            }
            console.log("Turnos obtenidos:", resultado);
            retornar(resultado);
        });
    }

}

exports.sendCalificacion = function ( req , res){
    const { calificacion, id } = req;
    console.log(" desde bd : ", calificacion);
    console.log(" desde bd : ", id);
    const query = `UPDATE Turnos SET calificacion = ? WHERE id_turno = ?`;

    pool.query(query,[calificacion,id], function(err, resultado) {
        if (err) {
            console.error('Error al obtener turnos:', err);
            return res(null);
        }
        res(resultado);
    });
}

exports.getCalificaionesXidPaciente = function ( req , res ){
    const id_paciente = req;
    const query = `SELECT T.*,M.nombre, M.apellido FROM Turnos as T INNER JOIN Medicos AS M ON M.dni = T.dni_medico WHERE dni_paciente = ? AND calificacion <> 'a confirmar'`;
    console.log("req que entra : ", req);
    console.log("Consulta SQL:", query, " - Parámetro:", id_paciente);

    pool.query(query,[id_paciente], function(err, resultado) {
        if (err) {
            console.error('Error al obtener turnos:', err);
            return res(null);
        }
        console.log(resultado);
        res(resultado);
    });

}


exports.postGuardarDisponibilidad = function (disponibilidad, callback) {
    console.log("Disponibilidad recibida para guardar: ", disponibilidad);

    const { dni_medico, especialidad, horaDesde, horaHasta, dias } = disponibilidad;

   

    // Verificar si 'dias' es un array antes de convertirlo en una cadena separada por comas
    const diasFormatted = Array.isArray(dias) ? dias.join(',') : dias;

    const query = `INSERT INTO Disponibilidad (dni_medico, especialidad, horadesde, horahasta, dias) VALUES (?, ?, ?, ?, ?)`;

    console.log("Query a ejecutar: ", query);

    pool.query(query, [dni_medico, especialidad, horaDesde, horaHasta, diasFormatted], (error, results) => {
        if (error) {
            console.error("Error al insertar disponibilidad:", error);
            return callback(error);  // Llamar callback con error
        }
        console.log("Disponibilidad guardada exitosamente:", results);
        callback(null, results);  // Llamar callback con los resultados
    });

    
};


exports.getTurnosTomadosCSV = function (req, retornar) {
    const query = `SELECT T.*, 
        CONCAT(A.nombre, ' ', A.apellido) AS Afiliado, 
        A.dni AS 'DNI Afiliado', 
        CONCAT(M.nombre, ' ', M.apellido) AS Medico
        FROM Turnos T 
        INNER JOIN Afiliados A ON A.dni = T.dni_paciente
        INNER JOIN Medicos M ON M.dni = T.dni_medico
        WHERE T.dni_medico = '${req}'`;
        
        console.log("consulta: ", query);            
    ejecutarConsulta(query, (err, resultado) => {
        if (err) {
            return retornar(err);
        }
        retornar(resultado);
    });
}

exports.getBuscarMedicoDni = function ( req , res ){
    console.log("req ", req);
    const id_medico = req.id_medico;
    const query = `SELECT * FROM Medicos WHERE dni = ? `  ;
    

    pool.query(query,[id_medico], function(err, resultado) {
        if (err) {
            console.error('Error al obtener turnos:', err);
            return res(null);
        }
        res(resultado);
    });

}

exports.putUpdateTurno = function ( req , res ){
    console.log("req ", req);
    const {id,option}= req;
    const query = `UPDATE Turnos SET estado = ? WHERE id_turno = ? `;
    

    pool.query(query,[option,id], function(err, resultado) {
        if (err) {
            console.error('Error al obtener turnos:', err);
            return res(null);
        }
        res(resultado);
    });

}