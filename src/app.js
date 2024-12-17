import express from 'express';
// import config from './config.js';
import categorias from './modulos/categorias/ruta.js';
import productos from './modulos/productos/ruta.js';
import login from './modulos/login/ruta.js'
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app = express();

const corsOptions = {
    origin: 'https://practica-angular-dicsys.netlify.app/' //'http://localhost:4200',  // Permitir solo este origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'],          // Permitir solo ciertos métodos HTTP
    allowedHeaders: ['Content-Type', "Authorization"], 
    credentials: true,// Permitir ciertos encabezados
  };



app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

//configura el puerto
app.set('port', 4000);

//ruta
app.use('/api/categorias', categorias);

app.use('/api/productos', productos);

app.use('/api/login', login);




export default app;
