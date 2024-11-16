
import express from 'express';
import pool from './../../config.js';

const router = express.Router();

//listar productos
router.get('/', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM productos');
        res.send(result);
    
    } catch (error) {
        console.log('Error al listar productos', error);
        res.status(500).json({ mensaje: "error al listar los productos" });
    }
});


//productos por categoria

router.get('/categoria/:id_categoria', async (req, res) => {
    try {
        const { id_categoria } = req.params;

        if(validarIdProducto(id_categoria)){

            const [result] = await pool.query('SELECT * FROM productos where fk_categoria=?',[id_categoria]);
            res.send(result);
        }
        else{
            res.status(400).json({ mensaje: "error, los datos son erroneos" })
        }

    } catch (error) {
        console.log('Error al listar productos', error);
        res.status(500).json({ mensaje: "error al listar los productos" });
    }
});

//un producto
router.get('/:id_producto', async (req, res) => {
    try {
        const { id_producto } = req.params;

        if(validarIdProducto(id_producto)){

            const [result] = await pool.query('SELECT id_producto, nombre_producto, precio, stock, p.fecha_alta as fecha_alta, c.id_categoria as id_categoria, c.nombre_categoria as categoria FROM productos p inner join categorias c on p.fk_categoria=c.id_categoria  where id_producto=?',[id_producto]);
            res.send(result);
        }
        else{
            res.status(400).json({ mensaje: "error, los datos son erroneos" })
        }

    } catch (error) {
        console.log('Error al listar productos', error);
        res.status(500)..json({ mensaje: "error al listar los productos" });
    }
});

//crear producto
router.post('/', async function (req, res) {

    try{
        const {body} = req;

        if(validarDatosProducto(body) ){ 

            const [result] = await pool.query(" insert into productos (nombre_producto, precio, stock, fk_categoria)" + 
                " select ?, ?, ?, ? where not exists (SELECT 1 FROM productos WHERE nombre_producto = ?)", 
                  [body.nombre_producto.trim(), body.precio, body.stock, body.fk_categoria, body.nombre_producto.trim()]) ;
            
            res.json({
                mensaje: (result.affectedRows > 0 ) ? 
                        'se creo la producto ' + body.nombre_producto + ' con exito' 
                        : "el producto ya existe",
    
                data:body //result.insertId
            })

        }else{
            res.status(400).json({ mensaje: "error, los datos son erroneos" });
        }

    }
    catch(error){
        console.log('Error al crear producto', error);
        res.status(500).send('Error al crear');
    }

});


//actualizar producto
router.put('/:id',async function (req, res){

    try{
        const { id } = req.params;
       
        if( validarIdProducto(id) && validarDatosProducto(req.body) ){ 
            
            const body = req.body;   
            const [result]= await pool.query(`UPDATE productos SET nombre_producto=?, precio=?, stock=?, fk_categoria=?
                                                WHERE id_producto=? and NOT EXISTS
                                                                            ( SELECT * 
                     FROM (SELECT * FROM productos) AS temp 
                     WHERE temp.nombre_producto=? 
                     AND temp.id_producto!=?) `
                                            
                                                , [body.nombre_producto.trim(), body.precio, body.stock, body.fk_categoria, id, body.nombre_producto.trim(), id]
                                            );
            
            res.json({
                mensaje: (result.affectedRows == 1) ? 'producto actualizada con exito' : 'producto no actualizado',
                id,
                data: body
            })

        }else{
            res.status(400).json({ mensaje: "error, los datos son erroneos" })
        }

    }
    catch(error){
        console.log('Error al actualizar producto', error);
        res.status(500).json({ mensaje: 'Error al actualizar', error: error.message });
    }

})


//eliminar producto
router.delete('/:id', async function (req, res) {
    
    try{
        const { id } = req.params;
        const [result]= await pool.query('DELETE FROM productos WHERE id_producto =?', [id]);
    
        res.json({
            mensaje: (result.affectedRows==1) ? 'Se elimino el producto con exito' : ' no se elimino el producto',
            id
        })

    }catch(error){
        console.log('Error al eliminar producto', error);
        res.status(500).send('Error al eliminar');
    }

})



function validarNombreProducto(nombre_producto){

    return nombre_producto && typeof nombre_producto ==='string' && nombre_producto.trim()!== '';
}

function validarIdProducto(id){ 
    
    return typeof parseInt(id,10) === 'number' && Number.isInteger(parseInt(id,10)) && parseInt(id,10) > 0;
}    

function validarDatosProducto(producto){

    return producto && typeof producto === 'object' &&
        typeof producto.nombre_producto ==='string' && producto.nombre_producto.trim()!== '' &&
        typeof producto.precio === 'number' && producto.precio > 0 &&
        typeof producto.stock === 'number' && producto.stock >= 0 &&
        typeof producto.fk_categoria === 'number' && producto.fk_categoria > 0;

}


export default router;

