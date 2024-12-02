import express from 'express';
import pool from './../../config.js';
import {authenticateToken, authorizeRoles} from '../../middleware.js'

const router = express.Router();

//listar categorias
router.get('/', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM categorias');
        res.send(result);
    
    } catch (error) {
        console.log('Error al listar categorias', error);
        res.status(404).send('Error al listar categorias');
    }
});


//crear categoria
router.post('/', authenticateToken, authorizeRoles(["ADMIN"]), async function (req, res) {

    try{
        const {body} = req;

        if(validarNombreCategoria(body.nombre_categoria) ){ 

            const [result] = await pool.query(" insert into categorias (nombre_categoria)" + 
                " select ? where not exists (SELECT 1 FROM categorias WHERE nombre_categoria = ?)", 
                  [body.nombre_categoria.trim(), body.nombre_categoria.trim()]) ;
            
            res.json({
                mensaje: (result.affectedRows > 0 ) ? 
                        'se creo la categoria ' + body.nombre_categoria + ' con exito' 
                        : "la categoria ya existe",
    
                data:body //result.insertId
            })

        }else{
            res.send("error, los datos son erroneos")
        }

    }
    catch(error){
        console.log('Error al crear categoria', error);
        res.status(500).send('Error al crear');
    }

});

//actualizar categoria
router.put('/:id', authenticateToken, authorizeRoles(["ADMIN"]), async function (req, res){

    try{
        const { id } = req.params;
       
        if( validarIdCategoria(id) && validarNombreCategoria(req.body.nombre_categoria) ){ 
            
            const body = req.body;   
            const [result]= await pool.query('UPDATE categorias SET nombre_categoria=? WHERE id_categoria =? ', [body.nombre_categoria.trim(), id]);
            
            res.json({
                mensaje: (result.affectedRows == 1) ? 'categoria actualizada con exito' : 'categoria no actualizada',
                id,
                data: body
            })

        }else{
            res.send("error, los datos son erroneos")
        }

    }
    catch(error){
        console.log('Error al actualizar categoria', error);
        res.status(500).send('Error al actualizar');
    }

})


//eliminar categoria
router.delete('/:id', authenticateToken, authorizeRoles(["ADMIN"]), async function (req, res) {
    
    try{
        const { id } = req.params;
        const [result]= await pool.query('DELETE FROM categorias WHERE id_categoria =?', [id]);
    
        res.json({
            mensaje: (result.affectedRows==1) ? 'Se elimino la categoria con exito' : ' no se elimino la categoria',
            id
        })

    }catch(error){
        console.log('Error al eliminar categoria', error);
        res.status(500).send('Error al eliminar');
    }

})

function validarNombreCategoria(nombre_categoria){

    return nombre_categoria && typeof nombre_categoria ==='string' && nombre_categoria.trim()!== '';
}

function validarIdCategoria(id){ 
    
    return typeof parseInt(id,10) === 'number' && Number.isInteger(parseInt(id,10)) && parseInt(id,10) > 0;
}    



export default router;

