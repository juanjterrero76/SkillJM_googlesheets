import { conn } from '../db/dbconnect.js';


export const mainController =  {

	getListado: async (req, res)=> {
		try{
			const [ registros ] = await conn.query(`SELECT * FROM cart_items`)
			res.json(registros)//los imprimo en localhost:3000 como json cuando hago el get 
			console.log(registros);//los imprimo en la consola como json cuando hago el get
			
		} catch (error){
			console.error(error);
			res.status(500).json({ error: 'Error al obtener los datos'});
			throw error 
		} 
			
		},
	
};