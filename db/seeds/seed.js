const format = require('pg-format');
const db = require('../connection');
const {
  convertTimestampToDate,
  createRef,
  formatComments,
} = require('./utils');

const seed = ({ timelineData, userData, eventData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments;`)
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
        timeline_name VARCHAR PRIMARY KEY,
        description VARCHAR
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
        timeline VARCHAR NOT NULL REFERENCES timelines(timeline_name),
        author VARCHAR NOT NULL REFERENCES users(username),
        body VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        votes INT DEFAULT 0 NOT NULL,
        event_img_url VARCHAR DEFAULT 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'
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
      const insertTimelinesQueryStr = format(
        'INSERT INTO timelines (timeline_name, description) VALUES %L;',
        timelineData.map(({ timeline_name, description }) => [timeline_name, description])
      );
      const timelinesPromise = db.query(insertTimelinesQueryStr);

      const insertUsersQueryStr = format(
        'INSERT INTO users ( username, name, avatar_url) VALUES %L;',
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
        'INSERT INTO events (title, timeline, author, body, created_at, votes, event_img_url) VALUES %L RETURNING *;',
        formattedEventData.map(
          ({
            title,
            timeline,
            author,
            body,
            created_at,
            votes = 0,
            event_img_url,
          }) => [title, timeline, author, body, created_at, votes, event_img_url]
        )
      );

      return db.query(insertEventsQueryStr);
    })
    .then(({ rows: eventRows }) => {
      const eventIdLookup = createRef(eventRows, 'title', 'event_id');
      const formattedCommentData = formatComments(commentData, eventIdLookup);

      const insertCommentsQueryStr = format(
        'INSERT INTO comments (body, author, event_id, votes, created_at) VALUES %L;',
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
    });
};

module.exports = seed;
