import { extendObservable } from 'mobx';
import Model from './model';

class FormSubmitionsModel extends Model {
  constructor() {
    super();

    extendObservable(this, {
      user_id :'',
      articleId :'',
      question_1 :'',
      answer_1 :'',
      question_2 :'',
      answer_2 :'',
      question_3 :'',
      answer_3 :'',
      question_4 :'',
      answer_4 :'',
      question_5 :'',
      answer_5 :'',
    });

    this.resource = 'formSubmitions';
    this.Model = FormSubmitionsModel;
  }
}

export default FormSubmitionsModel;
