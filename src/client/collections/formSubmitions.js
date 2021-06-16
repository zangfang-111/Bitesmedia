import Collection from './collection';
import FormSubmitions from '../models/formSubmitions';

const resource = 'formSubmitions';

export default class FormSubmitionsCollection extends Collection {
  constructor() {
    super(resource, FormSubmitions);
  }
}
