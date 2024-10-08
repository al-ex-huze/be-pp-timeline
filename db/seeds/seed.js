const format = require("pg-format");
const db = require("../connection");
const {
    convertTimestampToDate,
    createRef,
    formatComments,
} = require("./utils");

const seed = ({
    timelineData,
    userData,
    eventData,
    commentData,
    repoData,
    languagesData,
    feelsData,
}) => {
    return db
        .query(`DROP TABLE IF EXISTS comments;`)
        .then(() => {
            return db.query(`DROP TABLE IF EXISTS feels;`);
        })
        .then(() => {
            return db.query(`DROP TABLE IF EXISTS repos;`);
        })
        .then(() => {
            return db.query(`DROP TABLE IF EXISTS languages;`);
        })
        .then(() => {
            return db.query(`DROP TABLE IF EXISTS events;`);
        })
        .then(() => {
            return db.query(`DROP TABLE IF EXISTS users;`);
        })
        .then(() => {
            return db.query(`DROP TABLE IF EXISTS timelines;`);
        })
        .then(() => {
            const timelinesTablePromise = db.query(`
      CREATE TABLE timelines (
        timeline_key SERIAL PRIMARY KEY,
        timeline_name VARCHAR NOT NULL UNIQUE,
        description VARCHAR NOT NULL,
        begin_date VARCHAR,
        finish_date VARCHAR
      );`);

            const usersTablePromise = db.query(`
      CREATE TABLE users (
        username VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        avatar_url VARCHAR
      );`);

            return Promise.all([timelinesTablePromise, usersTablePromise]);
        })
        .then(() => {
            return db.query(`
      CREATE TABLE events (
        event_id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL,
        timeline VARCHAR NOT NULL,
        FOREIGN KEY (timeline) REFERENCES timelines (timeline_name) ON UPDATE CASCADE ON DELETE CASCADE,
        author VARCHAR NOT NULL REFERENCES users(username),
        body VARCHAR NOT NULL,
        skills VARCHAR,
        topics VARCHAR,
        created_at TIMESTAMP DEFAULT NOW(),
        start_date VARCHAR NOT NULL,
        end_date VARCHAR DEFAULT NOW(),
        votes INT DEFAULT 0 NOT NULL,
        github_url VARCHAR,
        deployed_url VARCHAR,
        event_img_url_1 VARCHAR DEFAULT 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700',
                event_img_url_2 VARCHAR DEFAULT 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700',
                        event_img_url_3 VARCHAR DEFAULT 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'
      );`);
        })
        .then(() => {
            return db.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        body VARCHAR NOT NULL,
        event_id INT REFERENCES events(event_id) NOT NULL,
        author VARCHAR REFERENCES users(username) NOT NULL,
        votes INT DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );`);
        })
        .then(() => {
            return db.query(`
      CREATE TABLE repos (
        repo_id INT NOT NULL,
        name VARCHAR NOT NULL,
        full_name VARCHAR PRIMARY KEY,
        isPrivate BOOLEAN,
        owner_login VARCHAR NOT NULL,
        description VARCHAR,
        fork BOOLEAN,
        created_at VARCHAR NOT NULL,
        updated_at VARCHAR NOT NULL,
        pushed_at VARCHAR NOT NULL,
        size INT,
        language VARCHAR,
        visibility VARCHAR,
        default_branch VARCHAR
        );`);
        })
        .then(() => {
            return db.query(`
        CREATE TABLE languages (
        full_name_languages VARCHAR NOT NULL,
        languages_and_size VARCHAR
        );`);
        })
        .then(() => {
            return db.query(`
        CREATE TABLE feels (
        week_number VARCHAR PRIMARY KEY,
        week_start_date VARCHAR NOT NULL,
        week_end_date VARCHAR NOT NULL,
        knowledge INT,
        experience INT,
        passion INT,
        enthusiasm INT,
        confidence INT,
        wisdom INT,
        despair INT,
        input INT,
        output INT
        );`);
        })
        .then(() => {
            const insertTimelinesQueryStr = format(
                "INSERT INTO timelines (timeline_name, description, begin_date, finish_date) VALUES %L;",
                timelineData.map(
                    ({
                        timeline_name,
                        description,
                        begin_date,
                        finish_date,
                    }) => [timeline_name, description, begin_date, finish_date]
                )
            );
            const timelinesPromise = db.query(insertTimelinesQueryStr);

            const insertUsersQueryStr = format(
                "INSERT INTO users (username, name, avatar_url) VALUES %L;",
                userData.map(({ username, name, avatar_url }) => [
                    username,
                    name,
                    avatar_url,
                ])
            );
            const usersPromise = db.query(insertUsersQueryStr);
            return Promise.all([timelinesPromise, usersPromise]);
        })
        .then(() => {
            const formattedEventData = eventData.map(convertTimestampToDate);
            const insertEventsQueryStr = format(
                "INSERT INTO events (title, timeline, author, body, skills, topics, created_at, start_date, end_date, votes,github_url, deployed_url, event_img_url_1, event_img_url_2, event_img_url_3) VALUES %L RETURNING *;",
                formattedEventData.map(
                    ({
                        title,
                        timeline,
                        author,
                        body,
                        skills,
                        topics,
                        created_at,
                        start_date,
                        end_date,
                        votes = 0,
                        github_url,
                        deployed_url,
                        event_img_url_1,
                        event_img_url_2,
                        event_img_url_3,
                    }) => [
                        title,
                        timeline,
                        author,
                        body,
                        skills,
                        topics,
                        created_at,
                        start_date,
                        end_date,
                        votes,
                        github_url,
                        deployed_url,
                        event_img_url_1,
                        event_img_url_2,
                        event_img_url_3,
                    ]
                )
            );
            return db.query(insertEventsQueryStr);
        })
        .then(({ rows: eventRows }) => {
            const eventIdLookup = createRef(eventRows, "title", "event_id");
            const formattedCommentData = formatComments(
                commentData,
                eventIdLookup
            );
            const insertCommentsQueryStr = format(
                "INSERT INTO comments (body, author, event_id, votes, created_at) VALUES %L;",
                formattedCommentData.map(
                    ({ body, author, event_id, votes = 0, created_at }) => [
                        body,
                        author,
                        event_id,
                        votes,
                        created_at,
                    ]
                )
            );
            return db.query(insertCommentsQueryStr);
        })
        .then(() => {
            const insertReposQueryStr = format(
                "INSERT INTO repos (repo_id, name, full_name, isPrivate, owner_login, description, fork, created_at, updated_at, pushed_at,size, language, visibility, default_branch) VALUES %L;",
                repoData.map(
                    ({
                        repo_id,
                        name,
                        full_name,
                        isPrivate,
                        owner_login,
                        description,
                        fork,
                        created_at,
                        updated_at,
                        pushed_at,
                        size,
                        language,
                        visibility,
                        default_branch,
                    }) => [
                        repo_id,
                        name,
                        full_name,
                        isPrivate,
                        owner_login,
                        description,
                        fork,
                        created_at,
                        updated_at,
                        pushed_at,
                        size,
                        language,
                        visibility,
                        default_branch,
                    ]
                )
            );
            return db.query(insertReposQueryStr);
        })
        .then(() => {
            const insertLanguagesQueryStr = format(
                "INSERT INTO languages (full_name_languages, languages_and_size) VALUES %L;",
                languagesData.map(
                    ({ full_name_languages, languages_and_size }) => [
                        full_name_languages,
                        languages_and_size,
                    ]
                )
            );
            return db.query(insertLanguagesQueryStr);
        })
        .then(() => {
            const insertFeelsQueryStr = format(
                "INSERT INTO feels (week_number, week_start_date, week_end_date, knowledge, experience, passion, enthusiasm, confidence, wisdom, despair, input, output) VALUES %L;",
                feelsData.map(
                    ({
                        week_number,
                        week_start_date,
                        week_end_date,
                        knowledge,
                        experience,
                        passion,
                        enthusiasm,
                        confidence,
                        wisdom,
                        despair,
                        input,
                        output,
                    }) => [
                        week_number,
                        week_start_date,
                        week_end_date,
                        knowledge,
                        experience,
                        passion,
                        enthusiasm,
                        confidence,
                        wisdom,
                        despair,
                        input,
                        output,
                    ]
                )
            );
            return db.query(insertFeelsQueryStr);
        });
};

module.exports = seed;
