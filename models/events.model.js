const db = require("../db/connection.js");

exports.selectEvents = () => {
    const queryStr = "SELECT author, title, event_id, timeline, created_at, votes, event_img_url FROM events;";

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
                msg: `Event ID does not exist: ${event_id}`,
            });
        };
        return event;
    });
};

exports.insertEvent = (newEvent) => {
    const { author, title, timeline, body, event_img_url } = newEvent;
    
    const checkAuthorQueryStr =
        "SELECT username FROM users WHERE EXISTS (SELECT username FROM users WHERE username = $1);";

    const checkTimelineQueryStr =
        "SELECT timeline_name FROM timelines WHERE EXISTS (SELECT timeline_name FROM timelines WHERE timeline_name = $1);";

    let queryStr = "";

    const queryValues = [];

    if (event_img_url === null || event_img_url === undefined) {
        queryValues.push(author, title, body, timeline);
        queryStr =
            "INSERT INTO events (author, title, body, timeline) VALUES ($1, $2, $3, $4) RETURNING event_id;";
    } else {
        queryValues.push(author, title, body, timeline, event_img_url);
        queryStr =
            "INSERT INTO events (author, title, body, timeline, event_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING event_id;";
    }

    return db.query(checkAuthorQueryStr, [author]).then((isAuthorValid) => {
        if(isAuthorValid.rowCount === 0) {
            return Promise.reject({
                status: 404,
                msg: `User does not exist: ${author}`
            });
        };

        return db.query(checkTimelineQueryStr, [timeline])
        .then((isTimelineValid) => {
            if (isTimelineValid.rowCount === 0) {
                return Promise.reject({
                    status: 404,
                    msg: `Timeline does not exist: ${timeline}`,
                })
            }

            return db.query(queryStr, queryValues);
        })
        .then((({ rows }) => {
            const event = rows[0];
            const { event_id } = event;
            return event_id;
        }))
    })
}