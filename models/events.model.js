const db = require("../db/connection.js");

exports.selectEvents = (validTimelines, timeline, sort_by, order) => {
    const validSortBy = [
        "author",
        "title",
        "event_id",
        "timeline",
        "created_at",
        "start_date",
        "end_date",
        "votes",
    ];

    if (sort_by && !validSortBy.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "Invalid query: sort_by" });
    }

    if (order && !["asc", "desc"].includes(order)) {
        return Promise.reject({ status: 400, msg: "Invalid query: order" });
    }

    if (timeline && !validTimelines.includes(timeline)) {
        return Promise.reject({ status: 400, msg: "Invalid query" });
    }

    const queryValues = [];

    let queryStr =
        "SELECT author, title, event_id, timeline, created_at, start_date, end_date, votes, event_img_url FROM events";

    if (timeline) {
        queryStr += " WHERE timeline = $1";
        queryValues.push(timeline);
    }

    queryStr += " GROUP BY events.event_id";

    if (sort_by && order) {
        queryStr += ` ORDER BY ${sort_by} ${order};`;
    } else if (sort_by) {
        queryStr += ` ORDER BY ${sort_by};`;
    } else if (order) {
        queryStr += ` ORDER BY events.created_at ${order};`;
    } else {
        queryStr += " ORDER BY events.created_at ASC;";
    }

    return db.query(queryStr, queryValues).then(({ rows }) => {
        return rows;
    });
};

exports.selectEventByID = (event_id) => {
    const queryStr =
        "SELECT author, timeline, title, event_id, body, created_at, start_date, end_date, votes, event_img_url FROM events WHERE event_id = $1;";

    const queryValue = [event_id];

    return db.query(queryStr, queryValue).then(({ rows }) => {
        const event = rows[0];
        if (event === undefined) {
            return Promise.reject({
                status: 404,
                msg: `Event ID does not exist: ${event_id}`,
            });
        }
        return event;
    });
};

exports.insertEvent = (newEvent) => {
    const {
        author,
        title,
        timeline,
        body,
        start_date,
        end_date,
        event_img_url,
    } = newEvent;

    const checkAuthorQueryStr =
        "SELECT username FROM users WHERE EXISTS (SELECT username FROM users WHERE username = $1);";

    const checkTimelineQueryStr =
        "SELECT timeline_name FROM timelines WHERE EXISTS (SELECT timeline_name FROM timelines WHERE timeline_name = $1);";

    let queryStr = "";

    const queryValues = [];

    if (event_img_url === null || event_img_url === undefined) {
        queryValues.push(author, title, body, timeline, start_date, end_date);
        queryStr =
            "INSERT INTO events (author, title, body, timeline, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING event_id;";
    } else {
        queryValues.push(
            author,
            title,
            body,
            timeline,
            start_date,
            end_date,
            event_img_url
        );
        queryStr =
            "INSERT INTO events (author, title, body, timeline, start_date, end_date, event_img_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING event_id;";
    }

    return db.query(checkAuthorQueryStr, [author]).then((isAuthorValid) => {
        if (isAuthorValid.rowCount === 0) {
            return Promise.reject({
                status: 404,
                msg: `User does not exist: ${author}`,
            });
        }

        return db
            .query(checkTimelineQueryStr, [timeline])
            .then((isTimelineValid) => {
                if (isTimelineValid.rowCount === 0) {
                    return Promise.reject({
                        status: 404,
                        msg: `Timeline does not exist: ${timeline}`,
                    });
                }

                return db.query(queryStr, queryValues);
            })
            .then(({ rows }) => {
                const event = rows[0];
                const { event_id } = event;
                return event_id;
            });
    });
};

exports.deleteEvent = (event_id) => {
    const queryStr = "DELETE FROM events WHERE event_id = $1 RETURNING *;";
    const queryValue = [event_id];

    return db.query(queryStr, queryValue).then(({ rowCount }) => {
        if (rowCount === 0) {
            return Promise.reject({
                status: 404,
                msg: `Event does not exist: ${event_id}`,
            });
        }
    });
};

exports.updateEventDates = (update, event_id) => {
    const { new_start_date, new_end_date } = update;
    if (
        typeof new_start_date === "number" ||
        typeof new_end_date === "number"
    ) {
        return Promise.reject({
            status: 400,
            msg: "Date input is an integer",
        });
    }

    const queryStr =
        "UPDATE events SET start_date = $1, end_date = $2 WHERE event_id = $3 RETURNING *;";

    const queryValues = [new_start_date, new_end_date, event_id];

    return db.query(queryStr, queryValues).then(({ rows }) => {
        const event = rows[0];
        return event;
    });
};
