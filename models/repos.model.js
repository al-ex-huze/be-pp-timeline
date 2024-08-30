const db = require("../db/connection.js");

exports.selectAllRepos = () => {
    const queryStr = "SELECT repo_id, name, full_name, isPrivate, owner_login, description, fork, created_at, updated_at, pushed_at,size, language,visibility, default_branch FROM repos;";
    return db.query(queryStr).then(({ rows }) => {
        return rows;
    });
};
