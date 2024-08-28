const { getWeeklyCommitsCall, getYearlyActivityCall } = require("../ghapi");

exports.getWeeklyCommits = (req, res, next) => {
    getWeeklyCommitsCall()
        .then((weeklyCommits) => {
            // console.log("weeklyCommits in controller" + weeklyCommits);
            res.status(200).send({ weeklyCommits });
        })
        .catch(next);
};

exports.getYearlyActivity = (req, res, next) => {
    getYearlyActivityCall()
        .then((yearlyActivity) => {
            console.log("yearActivity in controller" + yearlyActivity);
            res.status(200).send({ yearlyActivity });
        })
        .catch(next);
};
