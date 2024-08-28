const { getWeeklyCommitsCall } = require("../ghapi");

exports.getWeeklyCommits = (req, res, next) => {
    getWeeklyCommitsCall()
        .then((weeklyCommits) => {
            console.log("response in controller" + weeklyCommits);
            res.status(200).send({ weeklyCommits });
        })
        .catch(next);
};
