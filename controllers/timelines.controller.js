const { selectTimelines, insertTimeline, deleteTimeline, selectTimelineByName } = require("../models/timelines.model.js");

exports.getTimelines = (req, res, next) => {
    selectTimelines()
    .then((timelines) => {
        res.status(200).send({ timelines });
    })
    .catch(next);
};

exports.getTimelineByName = (req, res, next) => {
    const { timeline_name } = req.params;
    selectTimelineByName(timeline_name)
    .then((timeline) => {
        res.status(200).send({ timeline })
        .catch(next);
    })
}

exports.createTimeline = (req, res, next) => {
    insertTimeline(req.body)
    .then((timeline) => {
        res.status(201);
        res.send({ timeline });
    })
    .catch(next);
};

exports.removeTimeline = (req, res, next) => {
    const { timeline_name } = req.params;
    deleteTimeline(timeline_name)
    .then(() => {
        res.status(204).send();
    })
    .catch(next);
};