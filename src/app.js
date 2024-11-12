import express from 'express';
// import config from './config.js';
import categorias from './modulos/categorias/ruta.js';
import productos from './modulos/productos/ruta.js';

const app = express();

app.use(express.json());

//configura el puerto
app.set('port', 4000);

//ruta
app.use('/api/categorias', categorias);

app.use('/api/productos', productos);





export default app;