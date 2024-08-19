const { selectEvents } = require("../models/events.model.js");

exports.getEvents = (req, res, next) => {
    selectEvents()
    .then((events) => {
        res.status(200).send({ events });
    })
    .catch(next);
};