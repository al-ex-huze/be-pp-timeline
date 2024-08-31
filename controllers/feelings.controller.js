const { selectFeelings } = require("../models/feelings.model");

exports.getFeelings = (req, res, next) => {
    selectFeelings()
        .then((feelings) => {
            res.status(200).send({ feelings });
        })
        .catch(next);
};
