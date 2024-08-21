import { Hono } from 'hono';
import * as categoryController from '../controllers/categoryController';

const categories = new Hono();

categories.get('/', categoryController.getCategories);
categories.get('/:id', categoryController.getCategory);
categories.post('/', categoryController.createCategory);
categories.put('/:id', categoryController.updateCategory);
categories.delete('/:id', categoryController.deleteCategory);
categories.delete('/', categoryController.deleteCategories);

export default categories;
