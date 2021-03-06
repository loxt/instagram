import { Router } from 'express';

import multer from 'multer';
import PostController from './controllers/PostController';
import uploadConfig from './config/upload';
import LikeController from './controllers/LikeController';

const routes = Router();
const upload = multer(uploadConfig);

routes.get('/posts', PostController.index);
routes.post('/posts', upload.single('image'), PostController.store);

routes.post('/posts/:id/like', LikeController.store);

export default routes;
