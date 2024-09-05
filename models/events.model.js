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
        "github_url",
        "deployed_url",
        "event_img_url_1",
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
        "SELECT author, title, event_id, timeline, body, skills, topics, created_at, start_date, end_date, votes, github_url,deployed_url, event_img_url_1, event_img_url_2, event_img_url_3 FROM events";

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
        queryStr += ` ORDER BY start_date ${order};`;
    } else {
        queryStr += " ORDER BY start_date ASC;";
    }

    return db.query(queryStr, queryValues).then(({ rows }) => {
        return rows;
    });
};

exports.selectEventByID = (event_id) => {
    const queryStr =
        "SELECT author, timeline, title, event_id, body, skills, topics, created_at, start_date, end_date, votes, github_url, deployed_url, event_img_url_1, event_img_url_2, event_img_url_3 FROM events WHERE event_id = $1;";

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
        skills,
        topics,
        start_date,
        end_date,
        deployed_url,
        github_url,
        event_img_url_1, event_img_url_2, event_img_url_3,
    } = newEvent;

    const checkAuthorQueryStr =
        "SELECT username FROM users WHERE EXISTS (SELECT username FROM users WHERE username = $1);";

    const checkTimelineQueryStr =
        "SELECT timeline_name FROM timelines WHERE EXISTS (SELECT timeline_name FROM timelines WHERE timeline_name = $1);";

    let queryStr = "";

    const queryValues = [];

    if (event_img_url_1 === null || event_img_url_1 === undefined) {
        queryValues.push(
            author,
            title,
            body,
            skills,
            topics,
            timeline,
            start_date,
            end_date,
            github_url,
            deployed_url
        );
        queryStr =
            "INSERT INTO events (author, title, body, skills, topics, timeline, start_date, end_date, github_url, deployed_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING event_id;";
    } else {
        queryValues.push(
            author,
            title,
            body,
            skills,
            topics,
            timeline,
            start_date,
            end_date,
            github_url,
            deployed_url,
            event_img_url_1, event_img_url_2, event_img_url_3
        );
        queryStr =
            "INSERT INTO events (author, title, body, skills, topics, timeline, start_date, end_date, github_url, deployed_url, event_img_url_1, event_img_url_2, event_img_url_3) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING event_id;";
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
    const {
        new_start_date,
        new_end_date,
        new_title,
        new_body,
        new_skills,
        new_topics,
        new_timeline,
        new_github_url,
        new_deployed_url,
        new_event_img_url_1, new_event_img_url_2, new_event_img_url_3,
    } = update;

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
        "UPDATE events SET start_date = $1, end_date = $2, title = $3, body = $4, skills = $5, topics = $6, timeline = $7, github_url = $8, deployed_url = $9, event_img_url_1 =$10, event_img_url_2 = $11, event_img_url_3 = $12 WHERE event_id = $13 RETURNING *;";

    const queryValues = [
        new_start_date,
        new_end_date,
        new_title,
        new_body,
        new_skills,
        new_topics,
        new_timeline,
        new_github_url,
        new_deployed_url,
        new_event_img_url_1,
        new_event_img_url_2,
        new_event_img_url_3,
        event_id,
    ];

    return db.query(queryStr, queryValues).then(({ rows }) => {
        const event = rows[0];
        return event;
    });
};
