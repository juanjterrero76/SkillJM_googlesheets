import { googleSheets } from "./plugins/googleSheets.plugin.js";

import 'dotenv/config';
import express from 'express';//AGREGADO JM 

const rutas = (await import(`./routes/mainRoutes.js`)).default; //AGREGADO JM
const app = express();//AGREGADO JM

import { conn } from './db/dbconnect.js';

app.use(express.json());
app.use(express.urlencoded({extended: true }));

//console.log("LA ruta:",rutas);
app.use('/', rutas); //AGREGADO JM



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



/**
 * Read data
 */
console.log('GOOGLE_KEY_JSON_PATH:', process.env.GOOGLE_KEY_JSON_PATH);

const spreadsheetId = process.env.SPREAD_SHEET_ID;
const rangeForRead = "Hoja 4!A:A";
let resultRead;

try {
  resultRead = await googleSheets.read(spreadsheetId, rangeForRead);
  console.log("Resultado de lectura:",resultRead);
} catch (err) {
  // TODO (developer) - Handle exception
  throw err;
}

/**
 * Write datan
 */
const rangeForWrite = "Hoja 4!B:G";
let resultWrite;
const data = [
  [
    'Email','usuario'
  ],
  [
    '1@localhost','primero'
  ],
  [
    '2@localhost','segundo'
  ],
  [
    '3@localhost','teercero'
  ],
  [
    '4@localhost','cuaarto'
  ],
  [
    '5@localhost','quiinto'
  ],
  [
    '4@localhost','seexto'
  ],


]
//console.log("Datos Escritos: ",data);
//console.log(registros);

try {
  /*resultWrite = await googleSheets.write(spreadsheetId, rangeForWrite, data, 'RAW');
  console.log(resultWrite.data);*/


  const [ registros ] = await conn.query(`SELECT * FROM cart_items`)//AGREGADO JM
      //res.json(registros)//los imprimo en localhost:3000 como json cuando hago el get 
      //console.log(registros);//los imprimo en la consola como json cuando hago el get
  const valores = registros.map(row => [ row.id, row.cart_id, row.product_id, row.quantity, row.price, row.added_at ]);

 resultWrite = await googleSheets.write(spreadsheetId, rangeForWrite, valores, 'RAW');
  //console.log(resultWrite.valores);


} catch (error) {
  throw error;
}



