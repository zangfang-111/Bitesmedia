var knex = process.env.USER_ANALYTICS_DB ? require('knex')({
    client: 'mysql',
    connection: process.env.USER_ANALYTICS_DB,
    pool: {min: 0, max: 7}
}) : null;

module.exports = {
    find: function (self) {
        return function (req, res) {
            // let options = {
            //   fields: {
            //     user_id: 0,
            //     user_username: '',
            //     article_id: 0,
            //     article_slug: '',
            //     article_title: '',
            //     href: '',
            //     timestamp: new Date(),
            //     block_id: 0,
            //     block_title: '',
            //     block_type: '',
            //     block_px: '',
            //     block_percent: 0,
            //     block_seconds: 0
            //   },
            //   requireUser: true
            // };

            if (!req.data.user) {
                return res.status(401).json({
                    success: false,
                    error: 'You need to be logged in to create this.'
                });
            }

            if (knex) {
                knex('bites_article_tracking')
                    .select('block_type')
                    .sum('block_seconds as sum_seconds')
                    .where({
                        user_id: req.query.studentId,
                        article_id: req.query.articleId
                    })
                    .groupBy('block_type')
                    .then(function (results) {
                        return res.status(200).json(results);
                    })
                    .catch(function (err) {
                        console.error("Error getting collection: ", err);
                        return res.status(500).json({
                            success: false,
                            error: 'There was an issue.'
                        })
                    });

                // const con = mysql.createConnection(process.env.USER_ANALYTICS_DB);
                // con.connect(function(err) {
                //     if (err) throw err
                //     con.query("SELECT * FROM bites_article_tracking LIMIT 100", function (err, result) {
                //         if (err) throw err
                //         res.status(200).json(result)
                //     })
                // })
            } else {
                res.status(200).json({});
            }
        }
    }
}
