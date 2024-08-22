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
                expect(body.msg).toBe(
                    "PSQL ERROR - 23502 - Missing input."
                );
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

describe("GET /api/events/:event_id", () => {
    test("200 returns an event object with corresponding ID", () => {
        return request(app)
            .get("/api/events/1")
            .expect(200)
            .then(({ body }) => {
                const { event } = body;
                expect(event.event_id).toEqual(1);
                expect(typeof event.author).toBe("string");
                expect(typeof event.title).toBe("string");
                expect(typeof event.event_id).toBe("number");
                expect(typeof event.body).toBe("string");
                expect(typeof event.timeline).toBe("string");
                expect(typeof event.created_at).toBe("string");
                expect(typeof event.votes).toBe("number");
                expect(typeof event.event_img_url).toBe("string");
            });
    });
    // test("200 returns, now with comment count", () => {
    //     return request(app)
    //         .get("/api/events/1")
    //         .expect(200)
    //         .then(({ body }) => {
    //             const { event } = body;
    //             expect(typeof event.comment_count).toBe("number");
    //         });
    // });
    test("400 responds when valid path but invalid id", () => {
        return request(app)
            .get("/api/events/invalidId")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("PSQL ERROR 22P02 - Invalid input.");
            });
    });
    test("404 responds when valid id but is non-existent", () => {
        return request(app)
            .get("/api/events/111111")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Event ID does not exist: 111111");
            });
    });
});

describe("POST /api/events", () => {
    test("201 returns newly created event", () => {
        const newevent = {
            author: "al-ex-huze",
            title: "Test Title - New event",
            body: "Test body - one, two, three",
            timeline: "Northcoders Bootcamp",
            event_img_url:
                "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg",
        };
        return request(app)
            .post("/api/events")
            .send(newevent)
            .expect(201)
            .then(({ body }) => {
                const { event } = body;
                expect(typeof event.author).toBe("string");
                expect(typeof event.title).toBe("string");
                expect(typeof event.event_id).toBe("number");
                expect(typeof event.body).toBe("string");
                expect(typeof event.timeline).toBe("string");
                expect(typeof event.created_at).toBe("string");
                expect(typeof event.votes).toBe("number");
                expect(typeof event.event_img_url).toBe("string");
            });
    });
    test("201 successful post, additional properties ignored", () => {
        const newevent = {
            surplus: "test ignore",
            author: "al-ex-huze",
            title: "Test Title - New event",
            body: "Test body - one, two, three",
            timeline: "Northcoders Bootcamp",
            event_img_url:
                "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg",
            extra: 12345,
        };
        const expected = {
            author: "al-ex-huze",
            title: "Test Title - New event",
            event_id: 6,
            body: "Test body - one, two, three",
            timeline: "Northcoders Bootcamp",
            created_at: expect.any(String),
            votes: 0,
            event_img_url:
                "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg",
        };
        return request(app)
            .post("/api/events")
            .send(newevent)
            .expect(201)
            .then(({ body }) => {
                const { event } = body;
                expect(event).toMatchObject(expected);
            });
    });
    test("201 successful post with default img url if not included", () => {
        const newevent = {
            author: "al-ex-huze",
            title: "Test Title - New event",
            body: "Test body - one, two, three",
            timeline: "Northcoders Bootcamp",
        };
        return request(app)
            .post("/api/events")
            .send(newevent)
            .expect(201)
            .then(({ body }) => {
                const { event } = body;
                expect(event.event_img_url).toBe(
                    "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
                );
            });
    });
    test("201 successful post with default img url is null", () => {
        const newevent = {
            author: "al-ex-huze",
            title: "Test Title - New event",
            body: "Test body - one, two, three",
            timeline: "Northcoders Bootcamp",
            event_img_url: null,
        };
        return request(app)
            .post("/api/events")
            .send(newevent)
            .expect(201)
            .then(({ body }) => {
                const { event } = body;
                expect(event.event_img_url).toBe(
                    "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
                );
            });
    });
    test("404 valid but non existent timeline", () => {
        const newevent = {
            author: "al-ex-huze",
            title: "Test Title - New event",
            body: "Test body - one, two, three",
            timeline: "Southcoders Bootcamp",
            event_img_url:
                "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg",
        };
        return request(app)
            .post("/api/events")
            .send(newevent)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Timeline does not exist: Southcoders Bootcamp");
            });
    });
    test("404 valid but non existent author", () => {
        const newevent = {
            author: "al",
            title: "Test Title - New event",
            body: "Test body - one, two, three",
            timeline: "Northcoders Bootcamp",
            event_img_url:
                "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg",
        };
        return request(app)
            .post("/api/events")
            .send(newevent)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("User does not exist: al");
            });
    });
    test("400 missing required fields", () => {
        const newevent = {
            author: "al-ex-huze",
            title: null,
            body: "Test body - one, two, three",
            timeline: "Northcoders Bootcamp",
            event_img_url:
                "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg",
        };
        return request(app)
            .post("/api/events")
            .send(newevent)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("PSQL ERROR - 23502 - Missing input.");
            });
    });
    test("400 missing required fields", () => {
        const newevent = {
            author: "al-ex-huze",
            title: "Test Title - New event",
            body: null,
            timeline: "Northcoders Bootcamp",
            event_img_url:
                "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg",
        };
        return request(app)
            .post("/api/events")
            .send(newevent)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("PSQL ERROR - 23502 - Missing input.");
            });
    });
});

describe("DELETE /api/events/:event_id", () => {
    test("204 responds with no content", () => {
        return request(app)
            .delete("/api/events/5")
            .expect(204)
            .then(({ body }) => {
                expect(body).toEqual({});
            });
    });
    test("400 responds when invalid event id", () => {
        return request(app)
            .delete("/api/events/invalidId")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("PSQL ERROR 22P02 - Invalid input.");
            });
    });
    test("404 responds when event not found", () => {
        return request(app)
            .delete("/api/events/333333333")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Event does not exist: 333333333");
            });
    });
});