const { describe } = require("node:test");
const {
    convertTimestampToDate,
    createRef,
    formatComments,
} = require("../db/seeds/utils");

const { repoParser, splitOwner } = require("../utils/repo-utils");
const { languageParser } = require("../utils/languages-utils");

describe("languageParser", () => {
    test("returns array of objects", () => {
        const input = [{ "fun-data-katas": { JavaScript: 9210 } }];
        const expected = [
            {
                full_name_languages: "al-ex-huze/fun-data-katas",
                languages_and_size: "{\"JavaScript\":9210}",
            },
        ];
        const actual = languageParser(input);
        expect(actual).toEqual(expected);
    });
    test("returns array of objects", () => {
        const input = [
            {
                "fe-pp-timeline": {
                    TypeScript: 44326,
                    CSS: 3671,
                    JavaScript: 734,
                    HTML: 376,
                },
            },
        ];
        const expected = [
            {
                full_name_languages: "al-ex-huze/fe-pp-timeline",
                languages_and_size: "{\"TypeScript\":44326,\"CSS\":3671,\"JavaScript\":734,\"HTML\":376}",
            },
        ];
        const actual = languageParser(input);
        expect(actual).toEqual(expected);
    });
});

describe("splitOwner", () => {
    test("returns owner from full name", () => {
        const input = "141Soft/intro-week-git-workshop";
        const expected = "141Soft";
        const actual = splitOwner(input);
        expect(actual).toEqual(expected);
    });
});

describe("repoParser", () => {
    test("returns empty array", () => {
        const input = [];
        const expected = [];
        const actual = repoParser(input);
        expect(actual).toEqual(expected);
    });
    test("returns a new array", () => {
        const input = [
            {
                id: 111,
                name: "testName1",
                full_name: "al-ex-huze1/testFull_name1",
                private: true,
                description: "test description",
                fork: true,
                created_at: "2024-07-01T10:36:36Z",
                updated_at: "2024-07-11T21:44:04Z",
                pushed_at: "2024-07-18T16:03:48Z",
                size: 777,
                language: "Javascript",
                visibility: "public",
                default_branch: "main",
            },
            {
                id: 222,
                name: "testName2",
                full_name: "al-ex-huze2/testFull_name2",
                private: true,
                description: "test description2",
                fork: true,
                created_at: "2024-07-01T10:36:36Z",
                updated_at: "2024-07-11T21:44:04Z",
                pushed_at: "2024-07-18T16:03:48Z",
                size: 777,
                language: "Javascript",
                visibility: "public",
                default_branch: "main",
            },
        ];
        const actual = repoParser(input);
        expect(actual).not.toBe(input);
    });
    test("doesnt mutate", () => {
        const input = [
            {
                id: 111,
                name: "testName1",
                full_name: "al-ex-huze1/testFull_name1",
                private: true,
                description: "test description",
                fork: true,
                created_at: "2024-07-01T10:36:36Z",
                updated_at: "2024-07-11T21:44:04Z",
                pushed_at: "2024-07-18T16:03:48Z",
                size: 777,
                language: "Javascript",
                visibility: "public",
                default_branch: "main",
            },
            {
                id: 222,
                name: "testName2",
                full_name: "al-ex-huze2/testFull_name2",
                private: true,
                description: "test description2",
                fork: true,
                created_at: "2024-07-01T10:36:36Z",
                updated_at: "2024-07-11T21:44:04Z",
                pushed_at: "2024-07-18T16:03:48Z",
                size: 777,
                language: "Javascript",
                visibility: "public",
                default_branch: "main",
            },
        ];
        const actual = repoParser(input);
        expect(input).toEqual([
            {
                id: 111,
                name: "testName1",
                full_name: "al-ex-huze1/testFull_name1",
                private: true,
                description: "test description",
                fork: true,
                created_at: "2024-07-01T10:36:36Z",
                updated_at: "2024-07-11T21:44:04Z",
                pushed_at: "2024-07-18T16:03:48Z",
                size: 777,
                language: "Javascript",
                visibility: "public",
                default_branch: "main",
            },
            {
                id: 222,
                name: "testName2",
                full_name: "al-ex-huze2/testFull_name2",
                private: true,
                description: "test description2",
                fork: true,
                created_at: "2024-07-01T10:36:36Z",
                updated_at: "2024-07-11T21:44:04Z",
                pushed_at: "2024-07-18T16:03:48Z",
                size: 777,
                language: "Javascript",
                visibility: "public",
                default_branch: "main",
            },
        ]);
    });
    test("returns array of objects", () => {
        const input = [
            {
                id: 111,
                name: "testName1",
                full_name: "al-ex-huze1/testFull_name1",
                private: true,
                description: "test description",
                fork: true,
                created_at: "2024-07-01T10:36:36Z",
                updated_at: "2024-07-11T21:44:04Z",
                pushed_at: "2024-07-18T16:03:48Z",
                size: 777,
                language: "Javascript",
                visibility: "public",
                default_branch: "main",
            },
            {
                id: 222,
                name: "testName2",
                full_name: "al-ex-huze2/testFull_name2",
                private: true,
                description: "test description2",
                fork: true,
                created_at: "2024-07-01T10:36:36Z",
                updated_at: "2024-07-11T21:44:04Z",
                pushed_at: "2024-07-18T16:03:48Z",
                size: 777,
                language: "Javascript",
                visibility: "public",
                default_branch: "main",
            },
        ];
        const expected = [
            {
                repo_id: 111,
                name: "testName1",
                full_name: "al-ex-huze1/testFull_name1",
                isPrivate: true,
                owner_login: "al-ex-huze1",
                description: "test description",
                fork: true,
                created_at: "2024-07-01T10:36:36Z",
                updated_at: "2024-07-11T21:44:04Z",
                pushed_at: "2024-07-18T16:03:48Z",
                size: 777,
                language: "Javascript",
                visibility: "public",
                default_branch: "main",
            },
            {
                repo_id: 222,
                name: "testName2",
                full_name: "al-ex-huze2/testFull_name2",
                isPrivate: true,
                owner_login: "al-ex-huze2",
                description: "test description2",
                fork: true,
                created_at: "2024-07-01T10:36:36Z",
                updated_at: "2024-07-11T21:44:04Z",
                pushed_at: "2024-07-18T16:03:48Z",
                size: 777,
                language: "Javascript",
                visibility: "public",
                default_branch: "main",
            },
        ];
        const actual = repoParser(input);
        expect(actual).toEqual(expected);
    });
    test("returns array of objects ignoring surplus", () => {
        const input = [
            {
                id: 111,
                name: "testName1",
                full_name: "al-ex-huze1/testFull_name1",
                private: true,
                description: "test description",
                fork: true,
                created_at: "2024-07-01T10:36:36Z",
                updated_at: "2024-07-11T21:44:04Z",
                pushed_at: "2024-07-18T16:03:48Z",
                size: 777,
                language: "Javascript",
                visibility: "public",
                default_branch: "main",
                surplus: "TEST",
                surplus: "TEST",
            },
            {
                surplus: "TEST",
                surplus: "TEST",
                id: 222,
                name: "testName2",
                full_name: "al-ex-huze2/testFull_name2",
                private: true,
                description: "test description2",
                fork: true,
                created_at: "2024-07-01T10:36:36Z",
                updated_at: "2024-07-11T21:44:04Z",
                pushed_at: "2024-07-18T16:03:48Z",
                size: 777,
                language: "Javascript",
                visibility: "public",
                default_branch: "main",
            },
        ];
        const expected = [
            {
                repo_id: 111,
                name: "testName1",
                full_name: "al-ex-huze1/testFull_name1",
                isPrivate: true,
                owner_login: "al-ex-huze1",
                description: "test description",
                fork: true,
                created_at: "2024-07-01T10:36:36Z",
                updated_at: "2024-07-11T21:44:04Z",
                pushed_at: "2024-07-18T16:03:48Z",
                size: 777,
                language: "Javascript",
                visibility: "public",
                default_branch: "main",
            },
            {
                repo_id: 222,
                name: "testName2",
                full_name: "al-ex-huze2/testFull_name2",
                isPrivate: true,
                owner_login: "al-ex-huze2",
                description: "test description2",
                fork: true,
                created_at: "2024-07-01T10:36:36Z",
                updated_at: "2024-07-11T21:44:04Z",
                pushed_at: "2024-07-18T16:03:48Z",
                size: 777,
                language: "Javascript",
                visibility: "public",
                default_branch: "main",
            },
        ];
        const actual = repoParser(input);
        expect(actual).toEqual(expected);
    });
});

describe("convertTimestampToDate", () => {
    test("returns a new object", () => {
        const timestamp = 1557572706232;
        const input = { created_at: timestamp };
        const result = convertTimestampToDate(input);
        expect(result).not.toBe(input);
        expect(result).toBeObject();
    });
    test("converts a created_at property to a date", () => {
        const timestamp = 1557572706232;
        const input = { created_at: timestamp };
        const result = convertTimestampToDate(input);
        expect(result.created_at).toBeDate();
        expect(result.created_at).toEqual(new Date(timestamp));
    });
    test("does not mutate the input", () => {
        const timestamp = 1557572706232;
        const input = { created_at: timestamp };
        convertTimestampToDate(input);
        const control = { created_at: timestamp };
        expect(input).toEqual(control);
    });
    test("ignores includes any other key-value-pairs in returned object", () => {
        const input = { created_at: 0, key1: true, key2: 1 };
        const result = convertTimestampToDate(input);
        expect(result.key1).toBe(true);
        expect(result.key2).toBe(1);
    });
    test("returns unchanged object if no created_at property", () => {
        const input = { key: "value" };
        const result = convertTimestampToDate(input);
        const expected = { key: "value" };
        expect(result).toEqual(expected);
    });
});

describe("createRef", () => {
    test("returns an empty object, when passed an empty array", () => {
        const input = [];
        const actual = createRef(input);
        const expected = {};
        expect(actual).toEqual(expected);
    });
    test("returns a reference object when passed an array with a single items", () => {
        const input = [{ title: "title1", article_id: 1, name: "name1" }];
        let actual = createRef(input, "title", "article_id");
        let expected = { title1: 1 };
        expect(actual).toEqual(expected);
        actual = createRef(input, "name", "title");
        expected = { name1: "title1" };
        expect(actual).toEqual(expected);
    });
    test("returns a reference object when passed an array with many items", () => {
        const input = [
            { title: "title1", article_id: 1 },
            { title: "title2", article_id: 2 },
            { title: "title3", article_id: 3 },
        ];
        const actual = createRef(input, "title", "article_id");
        const expected = { title1: 1, title2: 2, title3: 3 };
        expect(actual).toEqual(expected);
    });
    test("does not mutate the input", () => {
        const input = [{ title: "title1", article_id: 1 }];
        const control = [{ title: "title1", article_id: 1 }];
        createRef(input);
        expect(input).toEqual(control);
    });
});

describe("formatComments", () => {
    test("returns an empty array, if passed an empty array", () => {
        const comments = [];
        expect(formatComments(comments, {})).toEqual([]);
        expect(formatComments(comments, {})).not.toBe(comments);
    });
    test("converts created_by key to author", () => {
        const comments = [{ created_by: "ant" }, { created_by: "bee" }];
        const formattedComments = formatComments(comments, {});
        expect(formattedComments[0].author).toEqual("ant");
        expect(formattedComments[0].created_by).toBe(undefined);
        expect(formattedComments[1].author).toEqual("bee");
        expect(formattedComments[1].created_by).toBe(undefined);
    });
    test("replaces belongs_to value with appropriate id when passed a reference object", () => {
        const comments = [{ belongs_to: "title1" }, { belongs_to: "title2" }];
        const ref = { title1: 1, title2: 2 };
        const formattedComments = formatComments(comments, ref);
        expect(formattedComments[0].article_id).toBe(1);
        expect(formattedComments[1].article_id).toBe(2);
    });
    test("converts created_at timestamp to a date", () => {
        const timestamp = Date.now();
        const comments = [{ created_at: timestamp }];
        const formattedComments = formatComments(comments, {});
        expect(formattedComments[0].created_at).toEqual(new Date(timestamp));
    });
});
