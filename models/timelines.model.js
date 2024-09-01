const db = require("../db/connection.js");

exports.selectTimelines = () => {
    const queryStr = "SELECT timeline_name, description, begin_date, finish_date FROM timelines;";
    return db.query(queryStr).then(({ rows }) => {
        return rows;
    });
};

exports.selectTimelineByName = (timeline_name) => {
    const queryStr =
        "SELECT timeline_name, description, begin_date, finish_date FROM timelines WHERE timeline_name = $1;";
    const queryValue = [timeline_name];
    return db.query(queryStr, queryValue).then(({ rows }) => {
        const timeline = rows[0];
        if (timeline === undefined) {
            return Promise.reject({
                status: 404,
                msg: `Timeline does not exist: ${timeline_name}`,
            });
        }
        return timeline;
    });
};

exports.insertTimeline = (newTimeline) => {
    const { timeline_name, description, begin_date, finish_date } = newTimeline;
    const queryStr =
        "INSERT INTO timelines (timeline_name, description, begin_date, finish_date) VALUES ($1, $2, $3, $4) RETURNING *;";
    const queryValues = [timeline_name, description, begin_date, finish_date];
    return db.query(queryStr, queryValues).then(({ rows }) => {
        const timeline = rows[0];
        return timeline;
    });
};

exports.deleteTimeline = (timeline_name) => {
    const queryStr =
        "DELETE FROM timelines WHERE timeline_name = $1 RETURNING *;";
    const queryValue = [timeline_name];
    return db.query(queryStr, queryValue).then(({ rowCount }) => {
        if (rowCount === 0) {
            return Promise.reject({
                status: 404,
                msg: `timeline ${timeline_name} does not exist`,
            });
        }
    });
};
