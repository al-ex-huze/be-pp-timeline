const { selectFeelings, updateFeelingsForWeek } = require("../models/feelings.model");

exports.getFeelings = (req, res, next) => {
    selectFeelings()
        .then((feelings) => {
            res.status(200).send({ feelings });
        })
        .catch(next);
};

exports.patchFeelingsForWeek = (req, res, next) => {
    const { week_number } = req.params;
    updateFeelingsForWeek(req.body, week_number)
        .then((feeling) => {
            res.status(200).send({ feeling });
        })
        .catch(next);
};
