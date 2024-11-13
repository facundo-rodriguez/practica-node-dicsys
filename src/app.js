import express from 'express';
// import config from './config.js';
import categorias from './modulos/categorias/ruta.js';
import productos from './modulos/productos/ruta.js';
import cors from 'cors'

const app = express();

const corsOptions = {
    origin: 'https://mi-dominio.com',  // Permitir solo este origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'],          // Permitir solo ciertos métodos HTTP
    allowedHeaders: ['Content-Type'],  // Permitir ciertos encabezados
  };

app.use(cors());

app.use(express.json());

//configura el puerto
app.set('port', 4000);

//ruta
app.use('/api/categorias', categorias);

app.use('/api/productos', productos);





export default app;