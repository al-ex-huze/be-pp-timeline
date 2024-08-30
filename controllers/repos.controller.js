const { selectAllRepos } = require("../models/repos.model");

exports.getAllRepos = (req, res, next) => {
    selectAllRepos()
        .then((repos) => {
            res.status(200).send({ repos });
        })
        .catch(next);
};
