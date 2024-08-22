const { selectEvents, selectEventByID } = require("../models/events.model.js");

exports.getEvents = (req, res, next) => {
    selectEvents()
    .then((events) => {
        res.status(200).send({ events });
    })
    .catch(next);
};

exports.getEventByID = (req, res, next) => {
    const { event_id } = req.params;
    selectEventByID(event_id)
    .then((event) => {
        res.status(200).send({ event });
    })
    .catch(next);
}