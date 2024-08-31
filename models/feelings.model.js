const db = require("../db/connection.js");

exports.selectFeelings = () => {
    const queryStr = "SELECT week_number, week_start_date, week_end_date, knowledge, experience,passion, enthusiasm, confidence, wisdom, despair FROM feelings;";
    return db.query(queryStr).then(({ rows }) => {
        return rows;
    });
};

exports.updateFeelingsForWeek = (update, week_number) => {
    const { knowledge_update, experience_update, passion_update, enthusiasm_update, confidence_update, wisdom_update, despair_update } = update;
    if (
        typeof knowledge_update !== "number" ||
        typeof experience_update !== "number" || typeof passion_update !== "number" ||
        typeof enthusiasm_update !== "number" || typeof confidence_update !== "number" ||
        typeof wisdom_update !== "number" || typeof wisdom_update !== "number" ||
        typeof despair_update !== "number"
    ) {
        return Promise.reject({
            status: 400,
            msg: "Update data input is not an integer",
        });
    }

    const queryStr =
        "UPDATE feelings SET knowledge = $1, experience = $2, passion = $3, enthusiasm = $4, confidence = $5, wisdom = $6, despair = $7 WHERE week_number = $8 RETURNING *;";

    const queryValues = [knowledge_update, experience_update, passion_update, enthusiasm_update, confidence_update, wisdom_update, despair_update, week_number];

    return db.query(queryStr, queryValues).then(({ rows }) => {
        const feeling = rows[0];
        return feeling;
    });
};