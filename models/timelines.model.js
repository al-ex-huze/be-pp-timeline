const db = require("../db/connection.js");

exports.selectTimelines = () => {
    const queryStr = "SELECT timeline_name, description FROM timelines;";

    return db.query(queryStr).then(({ rows }) => {
        return rows;
    });
};