const { getAuthUserCall, getPublicUserCall, getAllReposForUserCall, getWeeklyCommitsCall, getYearlyActivityCall, getLanguagesUsedByRepoCall } = require("../models/ghapi");

exports.getAuthUser = (req, res, next) => {
    const { user } = req.params;
    getAuthUserCall(user)
        .then((user_details) => {
            // console.log("weeklyCommits in controller" + weeklyCommits);
            res.status(200).send({ user_details });
        })
        .catch(next);
};

exports.getPublicUser = (req, res, next) => {
    const { user } = req.params;
    getPublicUserCall(user)
        .then((user_details) => {
            res.status(200).send({ user_details });
        })
        .catch(next);
};

exports.getAllReposForUser = (req, res, next) => {
    const { user } = req.params;
    getAllReposForUserCall(user)
        .then((all_repos) => {
            res.status(200).send({ all_repos });
        })
        .catch(next);
};

exports.getWeeklyCommits = (req, res, next) => {
    const { repo } = req.params;
    getWeeklyCommitsCall(repo)
        .then((weeklyCommits) => {
            res.status(200).send({ weeklyCommits });
        })
        .catch(next);
};

exports.getYearlyActivity = (req, res, next) => {
    const { repo } = req.params;
    getYearlyActivityCall(repo)
        .then((yearlyActivity) => {
            res.status(200).send({ yearlyActivity });
        })
        .catch(next);
};

exports.getLanguagesUsedByRepo = (req, res, next) => {
    const { repo } = req.params;
    getLanguagesUsedByRepoCall(repo)
        .then((languages) => {
            res.status(200).send({ languages });
        })
        .catch(next);
};

