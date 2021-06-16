const CrudController = require('./crud');
const collectionName = 'formSubmitions';

module.exports = {
    find: function(self) {
        return CrudController.list(self, collectionName, {
            fields: {
                id: 1,
                user_id : 1,
                articleId : 1,
                question_1 : 1,
                answer_1 : 1,
                question_2 : 1,
                answer_2 : 1,
                question_3 : 1,
                answer_3 : 1,
                question_4 : 1,
                answer_4 : 1,
                question_5 : 1,
                answer_5 : 1,
                answer_1_correct : 1,
                answer_2_correct : 1,
                answer_3_correct : 1,
                answer_4_correct : 1,
                answer_5_correct : 1,
                title : 1
            },
            requireUser : true
        })
    },
    update: function(self) {
        return CrudController.update(self, collectionName, {
            requireUser: true
        })
    }
};