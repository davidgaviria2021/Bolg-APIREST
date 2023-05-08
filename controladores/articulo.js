const fs = require("fs");
const path = require("path");
const { validarArticulo } = require("../helpers/validar");
const Articulo = require("../modelos/Articulo");

const prueba = (req, res) => {
  return res.status(200).json({
    mensaje: "Soy una accion de prueba en mi controlador de articulos",
  });
};

const curso = (req, res) => {
  console.log("Se ha ejecutado el endpoint probando");
  return res.status(200).json([
    {
      curso: "Master en react",
      autor: "omar gaviria",
      url: "victorroblesweb.es",
    },
    {
      curso: "Master en react",
      autor: "omar gaviria",
      url: "victorroblesweb.es",
    },
  ]);
};

const crear = async (req, res) => {
  //Recoger parametros por post a guardar
  let parametros = req.body;

  //Validar datos
  try {
    validarArticulo(parametros);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Faltan datos por enviar",
    });
  }
  // Crear el objeto a guardar
  const articulo = new Articulo(parametros);

  // Asignar valores a objeto basado en el modelo (manual o automatico)
  //articulo.titulo = parametros.titulo;

  // Guardar el articulo en la base de datos
  /*   articulo.save((error, articuloGuardado) => {
    if (error || !articuloGuardado) {
      return res.status(400).json({
        status: "error",
        mensaje: "No se ha guardado el artículo",
      });
    }

    // Devolver resultado
    return res.status(200).json({
      status: "success",
      articulo: articuloGuardado,
      mensaje: "Articulo creado con exito!!",
    });
  }); */

  try {
    await articulo.save();
    res.status(200).json({
      status: "success",
      articulo,
      message: "Articulo creado con éxito!!",
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "No se ha guardado el articulo",
    });
  }
};
//EFECTO CARGANDO
const listar = (req, res) => {
  setTimeout(async () => {
    try {
      let consulta = Articulo.find({});

      if (req.params.ultimos) {
        consulta = consulta.limit(3);
      }

      const articulos = await consulta.sort({ fecha: -1 }).lean();

      if (!articulos || articulos.length === 0) {
        return res.status(404).json({
          status: "error",
          mensaje: "No se han encontrado artículos!!",
        });
      }

      return res.status(200).send({
        status: "success",
        contador: articulos.length,
        articulos,
      });
    } catch (error) {
      console.error(`Error al buscar artículos: ${error}`);
      return res.status(500).json({
        status: "error",
        mensaje: "Error interno del servidor",
      });
    }
  }, 1200);
};

/* let consulta = Articulo.find({}).exec((error, articulos) => {
    if (error || !articulos) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se han encontrado articulos",
      });
    }
    return res.status(200).send({
      status: "sucess",
      articulos,
    });
  }); */

/* try {
    
    let articulos = await Articulo.find({}).limit(3).sort({ fecha: -1 }).lean();

    if (!articulos || articulos.length === 0) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se han encontrado articulos",
      });
    }
    return res.status(200).send({
      status: "sucess",
      contador: articulos.length,
      articulos,
    });
  } catch (error) {
    console.error(`Error al buscar articulos: ${error}`);
    return res.status(500).json({
      status: "error",
      mensaje: "Error interno del servidor",
    });
  } */

/* const uno = (req, res) => {
  //Recoger un id por la url
  let id = req.params.id;

  // buscar el articulo
  Articulo.findById(id, (error, articulo) => {
    // si no existe devolver error

    if (!articulo || articulo.length === 0) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se han encontrado el artículo!!",
      });
    }

    //devolver resultado
    return res.status(200).json({
      status: "success",
      articulo,
    });
  });
}; */

const uno = async (req, res) => {
  try {
    // Recoger un id por la url
    let id = req.params.id;

    // Buscar el articulo
    let articulo = await Articulo.findById(id);

    // Si no existe devolver error
    if (!articulo) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se ha encontrado el artículo",
      });
    }

    // Devolver resultado
    return res.status(200).json({
      status: "success",
      articulo,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      mensaje: "Error en el servidor",
    });
  }
};

const borrar = async (req, res) => {
  try {
    let articuloId = req.params.id;
    let articuloBorrado = await Articulo.findOneAndDelete({ _id: articuloId });

    if (!articuloBorrado) {
      return res.status(404).json({
        status: "error",
        mensaje: "Error al borrar el artículo",
      });
    }

    return res.status(200).json({
      status: "sucsess",
      articulo: articuloBorrado,
      mensaje: "Metodo de borrar",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      mensaje: "Error en el servidor",
    });
  }
};

const editar = async (req, res) => {
  //Recoger id articulo a editar
  let articuloId = req.params.id;

  //Recoger datos del body
  let parametros = req.body;
  //Validar datos
  try {
    validarArticulo(parametros);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Faltan datos por enviar",
    });
  }

  //buscar y actualizar articulos

  try {
    let articuloEditado = await Articulo.findOneAndUpdate(
      { _id: articuloId },
      req.body,
      { new: true }
    );

    if (!articuloEditado) {
      return res.status(404).json({
        status: "error",
        mensaje: "Error al actualizar",
      });
    }

    //Devolver una respuesta
    return res.status(200).json({
      status: "sucsess",
      articulo: articuloEditado,
      mensaje: "Metodo de borrar",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      mensaje: "Error en el servidor",
    });
  }
};

const subir = async (req, res) => {
  //Configurar multer
  //Recoger el fichero de imagen subido
  if (!req.file && !req.files) {
    return res.status(404).json({
      status: "error",
      mensaje: "Petición invalida",
    });
  }

  //Nombre del archivo
  let archivo = req.file.originalname;

  //Extension del archivo
  let archivo_split = archivo.split(".");
  let extension = archivo_split[1];

  //Comprobar extension correcta
  if (
    extension != "png" &&
    extension != "jpg" &&
    extension != "jpeg" &&
    extension != "gif"
  ) {
    // Borrar archivo y dar respuesta
    fs.unlink(req.file.path, (error) => {
      return res.status(400).json({
        status: "error",
        mensaje: "Imagen invalida",
      });
    });
  } else {
    //Si todo va bien , actualizar el articulo

    //Recoger id articulo a editar
    let articuloId = req.params.id;

    //buscar y actualizar articulos

    try {
      let articuloEditado = await Articulo.findOneAndUpdate(
        { _id: articuloId },
        { imagen: req.file.filename },
        { new: true }
      );

      if (!articuloEditado) {
        return res.status(404).json({
          status: "error",
          mensaje: "Error al actualizar",
        });
      }

      //Devolver una respuesta
      return res.status(200).json({
        status: "sucsess",
        articulo: articuloEditado,
        fichero: req.file,
        mensaje: "Metodo de borrar",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        mensaje: "Error en el servidor",
      });
    }

    //Devolver respuesta

    /*  return res.status(200).json({
      status: "success",

      fichero: req.file,
    }); */
  }
};

const imagen = (req, res) => {
  let fichero = req.params.fichero;
  let ruta_fisica = "./imagenes/articulos/" + fichero;

  fs.stat(ruta_fisica, (error, existe) => {
    if (existe) {
      return res.sendFile(path.resolve(ruta_fisica));
    } else {
      return res.status(404).json({
        status: "error",
        mensaje: "La imagen no existe",
        existe,
        fichero,
        ruta_fisica,
      });
    }
  });
};

const buscador = async (req, res) => {
  try {
    let busqueda = req.params.busqueda;

    let consulta = Articulo.find({
      $or: [
        { titulo: { $regex: busqueda, $options: "i" } },
        { contenido: { $regex: busqueda, $options: "i" } },
      ],
    });

    const articulos = await consulta.sort({ fecha: -1 }).lean();

    if (!articulos || articulos.length === 0) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se han encontrado artículos!!",
      });
    }

    return res.status(200).send({
      status: "success",
      contador: articulos.length,
      articulos,
    });
  } catch (error) {
    console.error(`Error al buscar artículos: ${error}`);
    return res.status(500).json({
      status: "error",
      mensaje: "Error interno del servidor",
    });
  }
};

/*  // Sacar el string de busqueda
  let busqueda = req.params.busqueda;

  // Find OR
  Articulo.find({
    $or: [
      { titulo: { $regex: busqueda, $options: "i" } },
      { contenido: { $regex: busqueda, $options: "i" } },
    ],
  })
    .sort({ fecha: -1 })
    .exec((error, articulosEncontrados) => {
      if (error || !articulosEncontrados || articulosEncontrados.length <= 0) {
        return res.status(404).json({
          status: "error",
          mensaje: "No se han encontrado artículos",
        });
      }

      return res.status(200).json({
        status: "success",
        articulos: articulosEncontrados,
      });
    }); */

module.exports = {
  prueba,
  curso,
  crear,
  listar,
  uno,
  borrar,
  editar,
  subir,
  imagen,
  buscador,
};
