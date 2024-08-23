const { selectTimelines } = require("../models/timelines.model.js");

const {
    selectEvents,
    selectEventByID,
    insertEvent,
    deleteEvent,
    updateEventDates,
} = require("../models/events.model.js");

exports.getEvents = (req, res, next) => {
    const { timeline, sort_by, order } = req.query;
    selectTimelines().then((timelines) => {
        const validTimelines = [];
        timelines.forEach((timeline) => {
            validTimelines.push(timeline.timeline_name);
        });
        return selectEvents(validTimelines, timeline, sort_by, order)
            .then((events) => {
                res.status(200).send({ events });
            })
            .catch(next);
    });
};

exports.getEventByID = (req, res, next) => {
    const { event_id } = req.params;
    selectEventByID(event_id)
        .then((event) => {
            res.status(200).send({ event });
        })
        .catch(next);
};

exports.createEvent = (req, res, next) => {
    insertEvent(req.body)
        .then((event_id) => {
            return selectEventByID(event_id.toString());
        })
        .then((event) => {
            res.status(201);
            res.send({ event });
        })
        .catch(next);
};

exports.removeEvent = (req, res, next) => {
    const { event_id } = req.params;
    deleteEvent(event_id)
        .then(() => {
            res.status(204).send();
        })
        .catch(next);
};

exports.patchEventDates = (req, res, next) => {
    const { event_id } = req.params;

    updateEventDates(req.body, event_id)
        .then((event) => {
            res.status(200).send({ event });
        })
        .catch(next);
};
