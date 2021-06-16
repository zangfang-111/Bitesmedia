const CrudController = require('./crud');
const collectionName = 'students';

module.exports = {
  list: function(self) {
    return CrudController.list(self, collectionName, {
      fields: {
        id: 1,
        studentId: 1,
        studentName: 1,
        completedAssignments: 1,
        totalAssignments: 1,
        articleId: 1
      },
      insertCurrentUserId: 'teacherId',
      requireUser: true
    })
  },

  listAssignments: function(self) {
    return function (req) {
      if (!req.data.user) {
        return req.res.status(401).json({
          success: false,
          error: 'You need to be logged in to search for this.'
        })
      }

      const userId = req.data && req.data.user && req.data.user._id;
      let studentAssignments;

      self.apos.db.collection('assignments', function (err, assignments) {
        if (err) {
          console.error("Error getting collection: ", err);
          return req.res.status(500).json({
            success: false,
            error: 'There was an issue.'
          })
        }

        self.apos.db.collection('students', function (err, collection) {
          if (err) {
            console.error("Error getting collection: ", err);
            return req.res.status(500).json({
              success: false,
              error: 'There was an issue.'
            })
          }

          return collection.findOne({
            studentId: userId
          }, {
            teacherId: 1,
            assignments: 1
          }).then(function (result) {
            if(!result) {
              throw new Error("Could not find student.");
            }
            //
            // console.log("STUDENT RESULTS: ", result);
            //
            // studentAssignments = result.assignments;

            return assignments.find({
              userId: result.teacherId,
              // studentId: userId,
              visible: true
            }, {
              name: 1,
              endDate: 1,
              articleSlug: 1,
              articleImage: 1,
              articleThumbnail: 1
            }).toArray();
          }).then(function(results) {
            // console.log("RESULTS: ", results);
            return req.res.status(200).json({
              success: true,
              results: results
            });
          }).catch((err) => {
            return req.res.status(500).json({
              error: err.message
            });
          })
        });
      });
    }
  },

  find: function(self) {
    return CrudController.find(self, collectionName, {
      fields: {
        id: 1,
        studentId: 1,
        studentName: 1
      },
      requireUser: true
    })
  },

  getProgress: function(self) {
    return function(req) {
      if (!req.data.user) {
        return req.res.status(401).json({
          success: false
        })
      }

      self.apos.db.collection('students', function (err, collection) {
        if (err) {
          console.error("Error getting collection: ", err);
          return req.res.status(200).json({
            success: false,
            results: []
          });
        }

        return collection.findOne({
          id: req.params.id
        }, {
          progress: 1
        }).then(function(result) {
          const results = [];

          if(result && result.progress) {
            if(req.query.articleId && result.progress[req.query.articleId]) {
              results.push({
                progress: {
                  [req.query.articleId]: result.progress[req.query.articleId]
                }
              });
            } else {
              results.push({
                progress: result.progress
              });
            }
          }

          return req.res.status(200).json({
            success: true,
            results: results
          });
        }).catch(function(e) {
          console.log("Error finding progress", e);
          return req.res.status(200).json({
            success: false,
            results: []
          })
        })
      })
    }
  },

  track: function(self) {
    return function(req) {
      if (!req.data.user) {
        return req.res.status(401).json({
          success: false
        })
      }

      req.res.status(200).json({
        success: true
      });

      self.apos.db.collection('students', function (err, collection) {
        if (err) {
          console.error("Error getting collection: ", err);
          return;
        }

        if(req.body.type === 'progress') {
          collection.update({
            studentId: req.data.user._id,
          }, {
            "$set": {
              ["progress." + req.body.articleId]: {
                readPercent: req.body.readPercent,
                articleId: req.body.articleId,
                articleSlug: req.body.articleSlug
              }
            }
          }, {
            upsert: false,
            multi: false
          })
        }
      });
    }
  }
}
