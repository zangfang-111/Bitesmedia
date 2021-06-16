import Collection from './collection';
import ArticleTracking from '../models/articleTracking';

const resource = 'articleTracking';

export default class ArticleTrackingCollection extends Collection {
  constructor() {
    super(resource, ArticleTracking);
  }
}
