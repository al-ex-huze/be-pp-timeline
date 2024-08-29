const repoParser = (oldRepos) => {
    if (oldRepos.length === 0) return [];
    const clonedRepos = [...oldRepos];
    const newRepos = clonedRepos.map((element) => {
        return {
            repo_id: element.id,
            name: element.name,
            full_name: element.full_name,
            isPrivate: element.private,
            owner_login: splitOwner(element.full_name),
            description: element.description,
            fork: element.fork,
            created_at: element.created_at,
            updated_at: element.updated_at,
            pushed_at: element.pushed_at,
            size: element.size,
            language: element.language,
            visibility: element.visibility,
            default_branch: element.default_branch,
        };
    });
    console.log(newRepos);
    return newRepos;
};

const splitOwner = (full_name) => {
    const splitArr = full_name.split("/");
    return splitArr[0];
};

module.exports = { splitOwner, repoParser };
