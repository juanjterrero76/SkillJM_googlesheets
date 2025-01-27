import 'dotenv/config'
import { google } from 'googleapis';
import * as path from 'path';
import { fileURLToPath } from 'url';


// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar la autenticación de Google Sheets






const auth = new google.auth.GoogleAuth({
  
  //keyFile: path.resolve(process.env.GOOGLE_KEY_JSON_PATH), //eliminar esta keyFile

  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),  
    
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export const googleSheetsClient = google.sheets({version: 'v4', auth});