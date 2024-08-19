const { selectTimelines } = require("../models/timelines.model.js");

exports.getTimelines = (req, res, next) => {
    selectTimelines()
    .then((timelines) => {
        res.status(200).send({ timelines });
    })
    .catch(next);
};