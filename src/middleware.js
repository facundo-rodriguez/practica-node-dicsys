
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const SECRET_KEY = 'tu_clave_secreta';

//formacionydesarrollo@dicsys.com
//carlos.velazquez@dicsys.com
//https://www.djamware.com/post/631719a902bb4f02ac0dab1d/ionic-angular-tutorial-multilanguage-app-using-angular-i18n#google_vignette

/*
Tarea: 
Enviar hasta el lunes 2/12/2024 un componente realizado en 
Angular / Ionic que integre .ts .css .html

Enviar hasta el lunes 2/12/2024 una funcion realizada en PHP en la que 
se evalue retornando verdadero o falso si un string es capicua.
*/

export async function createToken(body, user){
    
    /*
        body son los datos de usuarios que vienen del front, y user son 
        los datos de usuarios que se obtienen de la realizar la consulta a la bd.
    */
    
    //Comparar la contraseña introducida con la contraseña hasheada guardada en la bd.
    const isMatch = await bcrypt.compare(body.password, user.password );

    if (!isMatch) {//si las contraseñas son distintas se produce un error

        //return res.status(401).json({ error: 'Contraseña incorrecta' });
        throw new Error('Contraseña incorrecta');
    }

    // Generar token JWT
    const token = jwt.sign({ id: user.id_usuario, username: user.username, rol: user.rol }, SECRET_KEY, { expiresIn: '1h' });

    return token;
}


export function isNotAuthenticated(req, res, next){
  // Obtener el token de la cabecera 'Authorization' del request.
    const authHeader = req.cookies.access_token; //req.headers['authorization'];

    //Si authHeader tiene un valor, lo divide en un array usando el espacio
    //Si es undefined o null, no intenta hacer nada más y asigna undefined a token.
    const token= authHeader; //&& authHeader.split(' ')[1];

    // console.log("token: "+token);
    // console.log("authheader: ",authHeader)

    if(token){
        jwt.verify(token, SECRET_KEY, (err, user)=>{
            
            if(err){
                return res.status(403).json({ error: 'Token no válido o expirado' });
            
            }else{
                return res.status(200).json({mensaje:"ya está logueado" })
            }
        })
    }
    else{
        next();
    }
    

}

export function authenticateToken(req, res, next){
    
    // Obtener el token de la cabecera 'Authorization' del request.
    const authHeader = req.cookies.access_token;//req.headers['authorization'];
    
    //Si authHeader tiene un valor, lo divide en un array usando el espacio
    //Si es undefined o null, no intenta hacer nada más y asigna undefined a token.
    const token = authHeader; //&& authHeader.split(' ')[1];
    console.log(req.cookies)
    if(!token){
        return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token' });
    }

    jwt.verify(token, SECRET_KEY, (err, user)=>{
        
        if(err){
            return res.status(403).json({ error: 'Token no válido o expirado' });
        }

        req.user = user; // Añades la información del usuario decodificada al objeto req
        next(); // Pasas el control al siguiente middleware o manejador de ruta
    });
}


export function authorizeRoles(roles){ //recibe un array de roles
    return (req, res, next) => { //req, res, next corresponden a la solicitud, es un middleware
      if (!roles.includes(req.user.rol)){ //si el array de roles no tiene el rol de la solicitud se rechaza el acceso
        return res.status(403).json({ message: 'Acceso denegado: permisos insuficientes' });
      }
      next();
    };
}
