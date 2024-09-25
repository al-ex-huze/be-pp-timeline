const db = require("../db/connection.js");

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

exports.selectTimelines = () => {
    const queryStr = "SELECT timeline_key, timeline_name, description, begin_date, finish_date FROM timelines;";
    return db.query(queryStr).then(({ rows }) => {
        return rows;
    });
};

exports.selectTimelineByName = (timeline_name) => {
    const queryStr =
        "SELECT timeline_key, timeline_name, description, begin_date, finish_date FROM timelines WHERE timeline_name = $1;";
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

exports.updateTimelineByName = (update, timeline_name) => {
    const { timeline_name_update, description_update, begin_date_update, finish_date_update } = update;

    const queryStr =
        "UPDATE timelines SET timeline_name = $1, description = $2, begin_date = $3, finish_date = $4 WHERE timeline_name = $5 RETURNING *;";

    const queryValues = [timeline_name_update, description_update, begin_date_update, finish_date_update, timeline_name];
    return db.query(queryStr, queryValues).then(({ rows }) => {
        const timeline = rows[0];
        return timeline;
    });
}