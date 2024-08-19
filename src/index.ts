import { Hono } from 'hono';
import categories from './routes/categories';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.route('/categories', categories);

export default app;
