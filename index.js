const { conexion } = require("./basedatos/conexion.js");
const express = require("express");
const cors = require("cors");

//Inicializar app
console.log("App de node arrancada");

//conectar ala base de datos
conexion();

//crear servidor de Node
const app = express();
const puerto = 3900;

//Configurar cors
app.use(cors());

//convertir body a objeto js
app.use(express.json()); //recibir datos con content-type app/json
app.use(express.urlencoded({ extended: true })); // recibiendo datos q llegan por form-urlencoded

//Rutas   devoer varias lineas htmal se usa `` con el metodo send() i can devolver html, json , texto
const rutas_articulo = require("./rutas/articulo");

//Cargo las rutas
app.use("/api", rutas_articulo);

//Rutas prueba hardcodeadas
app.get("/probando", (req, res) => {
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
});

app.get("/", (req, res) => {
  console.log("Se ha ejecutado el endpoint probando");
  return res.status(200).send("<h1>Empezando a crear un api con node</h1>");
});
//crear servidor y escuchar peticiones http
app.listen(puerto, () => {
  console.log("Servidor corriendo en el puerto " + puerto);
});
