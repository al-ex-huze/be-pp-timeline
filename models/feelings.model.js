const db = require("../db/connection.js");

exports.selectFeelings = () => {
    const queryStr = "SELECT week_number, week_start_date, week_end_date, knowledge, experience,passion, enthusiasm, confidence, wisdom, despair FROM feelings;";
    return db.query(queryStr).then(({ rows }) => {
        return rows;
    });
};
