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
//console.log('GOOGLE_KEY_JSON_PATH:', process.env.GOOGLE_KEY_JSON_PATH);

const spreadsheetId = process.env.SPREAD_SHEET_ID;
const rangeForRead = "Stock!A:F";
let resultRead;



try {
  // Leer datos desde Google Sheets
  const resultRead = await googleSheets.read(spreadsheetId, rangeForRead);
  console.log("Resultado de lectura:", resultRead);
//   RANGO
const filteredData = resultRead .map(row => { 
      const idProd = row[0]; // Columna A (id_prod) 
      const cantExistente = row[5]; // Columna F (CantEXistente) 
                                             // Validar que las columnas no sean nulas o vacías
      if (!idProd || !cantExistente) {
        console.warn("Fila inválida, se omitirá:", row); return null; // Ignorar esta fila
       } return { id_prod: idProd, CantEXistente: cantExistente, }; }).filter(item => item !== null); // Filtrar las filas nulas 


  
//Inserto por row  'INSERT INTO stock (id_prod, CantEXistente) VALUES (?, ?)'
  //UPDATE stock SET CantEXistente = ? WHERE id_prod = ?
  //REPLACE INTO stock (id_prod, CantEXistente) VALUES (?, ?);
  
  //INSERT INTO stock (id_prod, CantEXistente) VALUES (?, ?) ON DUPLICATE KEY UPDATE CantEXistente = VALUES(CantEXistente);
const stockPromises = filteredData.map(item => { return conn.query( 'INSERT INTO stock (id_prod, CantEXistente) VALUES (?, ?) ON DUPLICATE KEY UPDATE CantEXistente = VALUES(CantEXistente);',           [item.id_prod, item.CantEXistente] ); }); 
  
  await Promise.all(stockPromises); 
      console.log("Datos insertados correctamente en la tabla 'stock'.");





  

  // Obtener todos los id_prod de los datos nuevos
  const idsToKeep = filteredData.map(item => item.id_prod);

  // Convertir a una cadena para usar en el query
  const placeholders = idsToKeep.map(() => '?').join(',');

  // Query para eliminar los datos que no están en el nuevo conjunto
  await conn.query(
    `DELETE FROM stock WHERE id_prod NOT IN (${placeholders})`,
    idsToKeep
  );
  console.log("Filas no existentes eliminadas.");







  

  
} catch (err) {
  console.error("Error durante la operación:", err);
  throw err; 
}


/*


  // Insertar datos en la tabla 'stock' usando Promises
  const stockPromises = resultRead.map(item => {
    return conn.query(
      'INSERT INTO stock (id_prod, CantEXistente) VALUES (?, ?)',
      [item.prod_id, item.CantEXistente]
    );
  });

  // Esperar a que todas las promesas se resuelvan
  await Promise.all(stockPromises);
  console.log("Datos insertados en la tabla 'stock'.");

} catch (err) {
  console.error("Error durante la operación:", err);
  throw err;
}
*/



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



