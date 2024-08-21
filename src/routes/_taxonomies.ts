import { Hono } from 'hono';
import * as taxonomyController from '../controllers/taxonomyController';

const taxonomies = new Hono();

taxonomies.get('/', taxonomyController.getTaxonomies);
taxonomies.get('/:id', taxonomyController.getTaxonomy);
taxonomies.post('/', taxonomyController.createTaxonomy);
taxonomies.put('/:id', taxonomyController.updateTaxonomy);
taxonomies.delete('/:id', taxonomyController.deleteTaxonomy);
taxonomies.delete('/', taxonomyController.deleteTaxonomies);

export default taxonomies;
