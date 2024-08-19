const app = require("../app.js");
const request = require("supertest");

const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");

const currentEndpointsTest = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api", () => {
    test("200 responds with endpoints object", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .expect("Content-Type", "application/json; charset=utf-8")
        .then(({ body }) => {
            expect(JSON.stringify(body)).toBe(
                JSON.stringify(currentEndpointsTest)
            );
        });
    });
    test("404 responds when route not found", () => {
        return request(app)
        .get("/nonValidRoute")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("route not found");
        });
    });
});

describe("GET /api/timelines", () => {
    test("200 returns all timelines", () => {
        return request(app)
        .get("/api/timelines")
        .expect(200)
        .then(({ body }) => {
            console.log("body : " + body);
            const { timelines } = body;
            console.log("timelines : " + timelines);
            timelines.forEach((timeline) => {
                console.log("timeline : " + timeline)
                console.log("timeline.timeline_name : " + timeline.timeline_name)
                console.log("timeline.description : " + timeline.description)
                expect(typeof timeline.timeline_name).toBe("string");
                expect(typeof timeline.description).toBe("string");
            });
        });
    });
    // test("404 responds when nothing found", () => {
    //     return request(app)
    //     .get("/api/timelines")
    //     .expect(404)
    //     .then(({ body }) => {
    //         expect(body.msg).toBe("Not Found");
    //     });
    // });
});