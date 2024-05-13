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

