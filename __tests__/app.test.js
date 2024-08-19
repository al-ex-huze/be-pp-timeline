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
            const { timelines } = body;
            timelines.forEach((timeline) => {
                expect(typeof timeline.timeline_name).toBe("string");
                expect(typeof timeline.description).toBe("string");
            });
        });
    });
});

describe("POST /api/timelines", () => {
    test("201 returns created timeline", () => {
        const newTimeline = {
            timeline_name: "Timeline Name",
            description: "Timeline description",
        };
        return request(app)
            .post("/api/timelines")
            .send(newTimeline)
            .expect(201)
            .then(({ body }) => {
                const { timeline } = body;
                expect(typeof timeline.timeline_name).toBe("string");
                expect(typeof timeline.description).toBe("string");
                expect(timeline.timeline_name).toEqual("Timeline Name");
                expect(timeline.description).toEqual("Timeline description");
            });
    });
    test("201 successful post, additional properties ignored", () => {
        const newTimeline = {
            newProperty: "ignore",
            timeline_name: "Timeline Name",
            description: "Timeline description",
        };
        return request(app)
            .post("/api/timelines")
            .send(newTimeline)
            .expect(201)
            .then(({ body }) => {
                const { timeline } = body;
                expect(typeof timeline.timeline_name).toBe("string");
                expect(typeof timeline.description).toBe("string");
                expect(timeline.timeline_name).toEqual("Timeline Name");
                expect(timeline.description).toEqual("Timeline description");
            });
    });
    test("400 missing required fields", () => {
        const newTimeline = {
            timeline_name: null,
            description: "test body",
        };
        return request(app)
            .post("/api/timelines")
            .send(newTimeline)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("PSQL ERROR - 23502 - Failing row contains (null, test body).");
            });
    });
});

describe("DELETE /api/timelines/:timeline_name", () => {
    test("204 responds with no content", () => {
        return request(app)
            .delete("/api/timelines/Pre Bootcamp")
            .expect(204)
            .then(({ body }) => {
                expect(body).toEqual({});
            });
    });
    test("404 responds when timeline not found", () => {
        return request(app)
            .delete("/api/timelines/Poo Bootcamp")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("timeline Poo Bootcamp does not exist");
            });
    });
});

describe("GET /api/events", () => {
    test("200 returns all events", () => {
        return request(app)
            .get("/api/events")
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8")
            .then(({ body }) => {
                const { events } = body;
                events.forEach((event) => {
                    expect(typeof event.author).toBe("string");
                    expect(typeof event.title).toBe("string");
                    expect(typeof event.event_id).toBe("number");
                    expect(typeof event.timeline).toBe("string");
                    expect(typeof event.created_at).toBe("string");
                    expect(typeof event.votes).toBe("number");
                    expect(typeof event.event_img_url).toBe("string");

                });
            });
    });
    
});