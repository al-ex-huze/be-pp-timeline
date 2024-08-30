const db = require("../db/connection.js");

exports.selectLanguages = () => {
    const queryStr = "SELECT full_name_languages, languages_and_size FROM languages;";
    return db.query(queryStr).then(({ rows }) => {
        return rows;
    });
};
