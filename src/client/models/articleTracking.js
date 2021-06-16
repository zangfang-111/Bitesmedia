import { extendObservable } from 'mobx';
import Model from './model';

class ArticleTrackingModel extends Model {
  constructor() {
    super();

    extendObservable(this, {
      user_id: 0,
      user_username: '',
      article_id: 0,
      article_slug: '',
      article_title: '',
      href: '',
      timestamp: new Date(),
      block_id: 0,
      block_title: '',
      block_type: '',
      block_px: '',
      block_percent: 0,
      block_seconds: 0
    });

    this.resource = 'articleTracking';
    this.Model = ArticleTrackingModel;
  }
}

export default ArticleTrackingModel;
