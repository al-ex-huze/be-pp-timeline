const db = require("../db/connection.js");

exports.selectTimelines = () => {
    const queryStr = "SELECT timeline_name, description FROM timelines;";
    return db.query(queryStr).then(({ rows }) => {
        return rows;
    });
};

exports.insertTimeline = (newTimeline) => {
    console.log("newTimeline: " + newTimeline);
    console.log("tl-mdl create > insert")
    const { timeline_name, description } = newTimeline;
    const queryStr = "INSERT INTO timelines (timeline_name, description) VALUES ($1, $2) RETURNING *;";
    const queryValues = [timeline_name, description];
    return db.query(queryStr, queryValues).then(({ rows }) => {
        const timeline = rows[0];
        return timeline;
    });
};