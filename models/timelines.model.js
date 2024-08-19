const db = require("../db/connection.js");

exports.selectTimelines = () => {
    const queryStr = "SELECT timeline_name, description FROM timelines;";
    return db.query(queryStr).then(({ rows }) => {
        return rows;
    });
};

exports.insertTimeline = (newTimeline) => {
    const { timeline_name, description } = newTimeline;
    const queryStr = "INSERT INTO timelines (timeline_name, description) VALUES ($1, $2) RETURNING *;";
    const queryValues = [timeline_name, description];
    return db.query(queryStr, queryValues).then(({ rows }) => {
        const timeline = rows[0];
        return timeline;
    });
};

exports.deleteTimeline = (timeline_name) => {
    const queryStr = "DELETE FROM timelines WHERE timeline_name = $1 RETURNING *;";
    const queryValue = [timeline_name];
    return db.query(queryStr, queryValue).then(({ rowCount }) => {
        if (rowCount === 0) {
            return Promise.reject({
                status: 404,
                msg: `timeline ${timeline_name} does not exist`,
            });
        };
    });
};