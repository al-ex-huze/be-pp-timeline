const { selectFeels, updateFeelsForWeek } = require("../models/feels.model");

exports.getFeels = (req, res, next) => {
    selectFeels()
        .then((feels) => {
            res.status(200).send({ feels });
        })
        .catch(next);
};

exports.patchFeelsForWeek = (req, res, next) => {
    const { week_number } = req.params;
    updateFeelsForWeek(req.body, week_number)
        .then((feeling) => {
            res.status(200).send({ feeling });
        })
        .catch(next);
};
