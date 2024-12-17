
import express from 'express';
import pool from './../../config.js';
import {createToken, isNotAuthenticated} from '../../middleware.js'

const router = express.Router();

router.post('/', isNotAuthenticated, async (req, res) => {
    
    try{

        
        const { body } = req;
        const [result] = await pool.query(`SELECT u.id_usuario as id_usuario, u.username as username, u.password as password, u.estado as estado, r.rol as rol FROM usuarios u inner join roles r on u.fk_rol=r.id_rol  WHERE username='${body.username}'` );
        
        if(result.length === 0){
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }
      
        const user = result[0];

        //corregir porque me parece que al token lo estoy creadno con todos los datos del usuario, es decir, incluyendo el password
        const token= await createToken(body, user); 

        res
        .cookie('access_token', token, {   
            httpOnly: true, //la cookie solo se puede acceder en el servidor
            sameSite: 'None', //la cookie solo se puede acceder en el mismo dominio, Necesario para que funcione entre dominios diferentes
            secure: true,
            //domain: '.netlify.app',
            maxAge: 1000*60*60, // la cookie tiene un tiempo de validez de 1h
                })
        .json({ message: 'Login exitoso', token: token, username: user.username, rol: user.rol });
        // res.send(result);
    
    }catch(error){
        console.log('Error al loguearse', error);
        res.status(500).send('Error al loguearse');
    }
});


router.post('/logout',(req, res,next)=>{ 

    try{

        res
        .clearCookie('access_token')
        .json({message: 'Logout exitoso'});
     

    }catch(error){

        console.log('Error al logout', error);
        res.status(500).send('Error en el servidor');
    }

});

export default router;

