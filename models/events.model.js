const db = require("../db/connection.js");

exports.selectEvents = () => {
    let queryStr = "SELECT author, title, event_id, timeline, created_at, votes, event_img_url FROM events;";
    return db.query(queryStr).then(({ rows }) => {
        return rows;
    });
};

exports.selectEventByID = (event_id) => {
    const queryStr = "SELECT author, timeline, title, event_id, body, created_at, votes, event_img_url FROM events WHERE event_id = $1;";

    const queryValue = [event_id];

    return db.query(queryStr, queryValue).then(({ rows }) => {
        const event = rows[0];
        if (event === undefined) {
            return Promise.reject({
                status: 404,
                msg: `event ${event_id} does not exist`,
            });
        };
        return event;
    });
};