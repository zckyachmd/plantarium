import { Hono } from 'hono';
import categories from './routes/categories';
import taxonomies from './routes/taxonomy';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.route('/categories', categories);
app.route('/taxonomies', taxonomies);

export default app;
