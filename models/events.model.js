const db = require("../db/connection.js");

exports.selectEvents = () => {
    let queryStr = "SELECT author, title, event_id, timeline, created_at, votes, event_img_url FROM events;";
    return db.query(queryStr).then(({ rows }) => {
        return rows;
    });
};