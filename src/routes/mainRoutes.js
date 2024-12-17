import express  from 'express';

const router = express.Router(); 

import { mainController }  from '../controlers/mainController.js';
  

  router.get('/', mainController.getListado);


export default router;