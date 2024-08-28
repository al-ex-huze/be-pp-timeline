const { getAuthUserCall, getPublicUserCall, getPublicReposCall, getWeeklyCommitsCall, getYearlyActivityCall, getLanguagesUsedByRepoCall } = require("../ghapi");

exports.getAuthUser = (req, res, next) => {
    const { user } = req.params;
    console.log(user)

    getAuthUserCall(user)
        .then((user_details) => {
            // console.log("weeklyCommits in controller" + weeklyCommits);
            res.status(200).send({ user_details });
        })
        .catch(next);
};

exports.getPublicUser = (req, res, next) => {
    const { user } = req.params;
    console.log(user)

    getPublicUserCall(user)
        .then((user_details) => {
            // console.log("weeklyCommits in controller" + weeklyCommits);
            res.status(200).send({ user_details });
        })
        .catch(next);
};

exports.getPublicRepos = (req, res, next) => {
    const { user } = req.params;
    console.log(user)

    getPublicReposCall(user)
        .then((public_repos) => {
            // console.log("weeklyCommits in controller" + weeklyCommits);
            res.status(200).send({ public_repos });
        })
        .catch(next);
};

exports.getWeeklyCommits = (req, res, next) => {
    const { repo } = req.params;
    getWeeklyCommitsCall(repo)
        .then((weeklyCommits) => {
            // console.log("weeklyCommits in controller" + weeklyCommits);
            res.status(200).send({ weeklyCommits });
        })
        .catch(next);
};

exports.getYearlyActivity = (req, res, next) => {
    const { repo } = req.params;
    getYearlyActivityCall(repo)
        .then((yearlyActivity) => {
            // console.log("yearActivity in controller" + yearlyActivity);
            res.status(200).send({ yearlyActivity });
        })
        .catch(next);
};

exports.getLanguagesUsedByRepo = (req, res, next) => {
    const { repo } = req.params;
    getLanguagesUsedByRepoCall(repo)
        .then((languages) => {
            // console.log("yearActivity in controller" + yearlyActivity);
            res.status(200).send({ languages });
        })
        .catch(next);
};

