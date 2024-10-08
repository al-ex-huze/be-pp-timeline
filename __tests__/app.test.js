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
                    expect(typeof timeline.begin_date).toBe("string");
                    // expect(typeof timeline.finish_date).toBe("string");
                    expect(typeof timeline.timeline_key).toBe("number");
                });
            });
    });
});

describe("GET /api/timelines/:timeline_name", () => {
    test("200 returns timeline object for name", () => {
        return request(app)
            .get("/api/timelines/Northcoders Bootcamp")
            .expect(200)
            .then(({ body }) => {
                const { timeline } = body;
                expect(typeof timeline.timeline_key).toBe("number");
                expect(typeof timeline.timeline_name).toBe("string");
                expect(typeof timeline.description).toBe("string");
                expect(typeof timeline.begin_date).toBe("string");
                expect(typeof timeline.finish_date).toBe("string");
                expect(timeline.begin_date).toBe("2024-04-15");
                expect(timeline.finish_date).toBe("2024-07-12");
            });
    });
    test("404 responds when valid id but is non-existent", () => {
        return request(app)
            .get("/api/timelines/111111")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Timeline does not exist: 111111");
            });
    });
});

describe("POST /api/timelines", () => {
    test("201 returns created timeline", () => {
        const newTimeline = {
            timeline_name: "Timeline Name",
            description: "Timeline description",
            begin_date: "2024-02-02",
            finish_date: "2024-03-03",
        };
        return request(app)
            .post("/api/timelines")
            .send(newTimeline)
            .expect(201)
            .then(({ body }) => {
                const { timeline } = body;
                expect(typeof timeline.timeline_key).toBe("number");
                expect(typeof timeline.timeline_name).toBe("string");
                expect(typeof timeline.description).toBe("string");
                expect(timeline.timeline_name).toEqual("Timeline Name");
                expect(timeline.description).toEqual("Timeline description");
                expect(typeof timeline.begin_date).toBe("string");
                expect(typeof timeline.finish_date).toBe("string");
                expect(timeline.begin_date).toEqual("2024-02-02");
                expect(timeline.finish_date).toEqual("2024-03-03");
            });
    });
    test("201 successful post, additional properties ignored", () => {
        const newTimeline = {
            newProperty: "ignore",
            timeline_name: "Timeline Name",
            description: "Timeline description",
            begin_date: "2024-02-02",
            finish_date: "2024-03-03",
        };
        return request(app)
            .post("/api/timelines")
            .send(newTimeline)
            .expect(201)
            .then(({ body }) => {
                const { timeline } = body;
                expect(typeof timeline.timeline_key).toBe("number");
                expect(typeof timeline.timeline_name).toBe("string");
                expect(typeof timeline.description).toBe("string");
                expect(timeline.timeline_name).toEqual("Timeline Name");
                expect(timeline.description).toEqual("Timeline description");
                expect(typeof timeline.begin_date).toBe("string");
                expect(typeof timeline.finish_date).toBe("string");
                expect(timeline.begin_date).toEqual("2024-02-02");
                expect(timeline.finish_date).toEqual("2024-03-03");
            });
    });
    test("400 missing required fields", () => {
        const newTimeline = {
            timeline_name: null,
            description: "test body",
            begin_date: "2024-02-02",
            finish_date: "2024-03-03",
        };
        return request(app)
            .post("/api/timelines")
            .send(newTimeline)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("PSQL ERROR: 23502 - Missing input.");
            });
    });
    test("409 rejects unique timeline_name constraint", () => {
        const newTimeline = {
            timeline_name: "Northcoders Bootcamp",
            description: "test body",
            begin_date: "2024-02-02",
            finish_date: "2024-03-03",
        };
        return request(app)
            .post("/api/timelines")
            .send(newTimeline)
            .expect(409)
            .then(({ body }) => {
                expect(body.msg).toBe("PSQL ERROR: 23505 - Violates unique constraint.");
            });
    });
});

describe("PATCH /api/timelines/:timeline_name", () => {
    test("200 returns updated timeline", () => {
        const patchName = "Pre Bootcamp";
        const update = {
            timeline_name_update: "Updated Timeline Name",
            description_update: "Updated Timeline description",
            begin_date_update: "2024-04-04",
            finish_date_update: "2024-05-05",
        };
        return request(app)
            .patch(`/api/timelines/${patchName}`)
            .send(update)
            .expect(200)
            .then(({ body }) => {
                const { timeline } = body;
                expect(typeof timeline.timeline_key).toBe("number");
                expect(typeof timeline.timeline_name).toBe("string");
                expect(typeof timeline.description).toBe("string");
                expect(timeline.timeline_name).toEqual("Updated Timeline Name");
                expect(timeline.description).toEqual(
                    "Updated Timeline description"
                );
                expect(typeof timeline.begin_date).toBe("string");
                expect(typeof timeline.finish_date).toBe("string");
                expect(timeline.begin_date).toEqual("2024-04-04");
                expect(timeline.finish_date).toEqual("2024-05-05");
            });
    });
    test("200 returns updated timeline", () => {
        const patchName = "Northcoders Bootcamp";
        const update = {
            timeline_name_update: "Updated Timeline Name",
            description_update: "Updated Timeline description",
            begin_date_update: "2024-04-04",
            finish_date_update: "2024-05-05",
        };
        return request(app)
            .patch(`/api/timelines/${patchName}`)
            .send(update)
            .expect(200)
            .then(({ body }) => {
                const { timeline } = body;
                expect(typeof timeline.timeline_key).toBe("number");
                expect(typeof timeline.timeline_name).toBe("string");
                expect(typeof timeline.description).toBe("string");
                expect(timeline.timeline_name).toEqual("Updated Timeline Name");
                expect(timeline.description).toEqual(
                    "Updated Timeline description"
                );
                expect(typeof timeline.begin_date).toBe("string");
                expect(typeof timeline.finish_date).toBe("string");
                expect(timeline.begin_date).toEqual("2024-04-04");
                expect(timeline.finish_date).toEqual("2024-05-05");
            });
    });
    test("400 missing required fields when request is null", () => {
        const patchName = "Pre Bootcamp";
        const update = null;
        return request(app)
            .patch(`/api/timelines/${patchName}`)
            .send(update)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("PSQL ERROR: 23502 - Missing input.");
            });
    });
    test("400 incorrect type of request", () => {
        const patchName = "Pre Bootcamp";
        const update = [
            {
                timeline_name_update: "Updated Timeline Name",
                description_update: "Updated Timeline description",
                begin_date_update: "2024-04-04",
                finish_date_update: "2024-05-05",
            },
        ];
        return request(app)
            .patch(`/api/timelines/${patchName}`)
            .send(update)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("PSQL ERROR: 23502 - Missing input.");
            });
    });
    test('200 should cascade update parent id to child',async () => {
        const patchName = "Northcoders Bootcamp";
        const update = {
            timeline_name_update: "Updated Timeline Name",
            description_update: "Updated Timeline description",
            begin_date_update: "2024-04-04",
            finish_date_update: "2024-05-05",
        };
        return request(app)
            .patch(`/api/timelines/${patchName}`)
            .send(update)
            .expect(200)
            .then(({ body }) => {
                const { timeline } = body;
                expect(typeof timeline.timeline_key).toBe("number");
                expect(typeof timeline.timeline_name).toBe("string");
                expect(typeof timeline.description).toBe("string");
                expect(timeline.timeline_name).toEqual("Updated Timeline Name");
                expect(timeline.description).toEqual(
                    "Updated Timeline description"
                );
                expect(typeof timeline.begin_date).toBe("string");
                expect(typeof timeline.finish_date).toBe("string");
                expect(timeline.begin_date).toEqual("2024-04-04");
                expect(timeline.finish_date).toEqual("2024-05-05");
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
    test("200 returns events with default limit length", () => {
        return request(app)
            .get(`/api/events`)
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8")
            .then(({ body }) => {
                const { events } = body;
                expect(events.length).toBe(5);
                events.forEach((event) => {
                    expect(typeof event.author).toBe("string");
                    expect(typeof event.title).toBe("string");
                    expect(typeof event.event_id).toBe("number");
                    expect(typeof event.timeline).toBe("string");
                    expect(typeof event.body).toBe("string");
                    expect(typeof event.start_date).toBe("string");
                    expect(typeof event.end_date).toBe("string");
                    expect(typeof event.created_at).toBe("string");
                    expect(typeof event.votes).toBe("number");
                    expect(typeof event.event_img_url_1).toBe("string");
                    expect(typeof event.event_img_url_2).toBe("string");
                    expect(typeof event.event_img_url_3).toBe("string");
                });
            });
    });
    test("200 returns events  of the limit length, offset by page number", () => {
        const limit = 2;
        const p = 2;
        return request(app)
            .get(`/api/events?limit=${limit}&p=${p}`)
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8")
            .then(({ body }) => {
                const { events } = body;
                expect(events.length).toBe(2);
            });
    });
    test("200 returns sorted by ascending start date order as default", () => {
        return request(app)
            .get("/api/events")
            .expect(200)
            .then(({ body }) => {
                const { events } = body;
                expect(events).toBeSortedBy("start_date");
            });
    });
    test("200 returns sorted by descending start date order query", () => {
        return request(app)
            .get("/api/events?order=desc")
            .expect(200)
            .then(({ body }) => {
                const { events } = body;
                expect(events).toBeSortedBy("start_date", {
                    descending: true,
                });
            });
    });
    test("200 returns sorted by query... end date", () => {
        return request(app)
            .get("/api/events?sort_by=end_date")
            .expect(200)
            .then(({ body }) => {
                const { events } = body;
                expect(events).toBeSortedBy("end_date");
            });
    });
    test("200 returns sorted by query... end date desc", () => {
        return request(app)
            .get("/api/events?sort_by=end_date&order=desc")
            .expect(200)
            .then(({ body }) => {
                const { events } = body;
                expect(events).toBeSortedBy("end_date", {
                    descending: true,
                });
            });
    });
    test("200 returns array of with pagination offset and filtered by timeline query", () => {
        const limit = 2;
        const p = 2;
        return request(app)
            .get(`/api/events?limit=${limit}&p=${p}&timeline=Northcoders Bootcamp`)
            .expect(200)
            .then(({ body }) => {
                const { events } = body;
                events.forEach((event) => {
                    expect(event.timeline).toBe("Northcoders Bootcamp");
                });
            });
    });
    test("200 returns array of events filtered by timeline query", () => {
        return request(app)
            .get("/api/events?timeline=Post Bootcamp")
            .expect(200)
            .then(({ body }) => {
                const { events } = body;
                events.forEach((event) => {
                    expect(event.timeline).toBe("Post Bootcamp");
                });
            });
    });
    test("200 returns empty array for valid timeline with no events", () => {
        return request(app)
            .get("/api/events?timeline=Pre Bootcamp")
            .expect(200)
            .then(({ body }) => {
                const { events } = body;
                expect(events).toEqual([]);
            });
    });
    test("200 returns sorted by query...author", () => {
        return request(app)
            .get("/api/events?sort_by=author")
            .expect(200)
            .then(({ body }) => {
                const { events } = body;
                expect(events).toBeSortedBy("author");
            });
    });
    test("400 returns invalid timeline query", () => {
        return request(app)
            .get("/api/events?timeline=invalid_timeline")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid query");
            });
    });
    test("400 valid path but invalid sort_by query", () => {
        return request(app)
            .get("/api/events?sort_by=sausage")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid query: sort_by");
            });
    });
    test("400 valid path but invalid order query", () => {
        return request(app)
            .get("/api/events?order=sideways")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid query: order");
            });
    });
    test("400 returns invalid page type", () => {
        const limit = 10;
        const p = "string";
        return request(app)
            .get(`/api/events?limit=${limit}&p=${p}`)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("PSQL ERROR: 22P02 - Invalid input.");
            });
    });
    test("400 returns invalid page number", () => {
        const limit = 10;
        const p = -1;
        return request(app)
            .get(`/api/events?limit=${limit}&p=${p}`)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("PSQL ERROR: 2201X - Negative Page Number.");
            });
    });
    test("400 returns invalid limit type", () => {
        const limit = "string";
        const p = 1;
        return request(app)
            .get(`/api/events?limit=${limit}&p=${p}`)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("PSQL ERROR: 22P02 - Invalid input.");
            });
    });
    test("400 returns invalid limit number", () => {
        const limit = -10;
        const p = 1;
        return request(app)
            .get(`/api/events?limit=${limit}&p=${p}`)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("PSQL ERROR: 2201W - Negative Limit Number.");
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
                expect(typeof event.start_date).toBe("string");
                expect(typeof event.end_date).toBe("string");
                expect(typeof event.votes).toBe("number");
                expect(typeof event.event_img_url_1).toBe("string");
            });
    });
    test("400 responds when valid path but invalid id", () => {
        return request(app)
            .get("/api/events/invalidId")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("PSQL ERROR: 22P02 - Invalid input.");
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
        const newEvent = {
            author: "al-ex-huze",
            title: "Test Title - New event",
            body: "Test body - one, two, three",
            skills: "skill one. skill two.",
            topics: "topic a. topic b.",
            timeline: "Northcoders Bootcamp",
            start_date: "2024-07-15",
            end_date: "2024-07-19",
            github_url: "https://test.uk",
            deployed_url: "https://test.uk",
            event_img_url_1:
                "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg",
            event_img_url_2:
                "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg",
            event_img_url_3:
                "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg",
        };
        return request(app)
            .post("/api/events")
            .send(newEvent)
            .expect(201)
            .then(({ body }) => {
                const { event } = body;
                expect(typeof event.author).toBe("string");
                expect(typeof event.title).toBe("string");
                expect(typeof event.event_id).toBe("number");
                expect(typeof event.body).toBe("string");
                expect(typeof event.skills).toBe("string");
                expect(typeof event.topics).toBe("string");
                expect(typeof event.timeline).toBe("string");
                expect(typeof event.created_at).toBe("string");
                expect(typeof event.start_date).toBe("string");
                expect(typeof event.end_date).toBe("string");
                expect(typeof event.votes).toBe("number");
                expect(typeof event.event_img_url_1).toBe("string");
                expect(typeof event.event_img_url_2).toBe("string");
                expect(typeof event.event_img_url_3).toBe("string");
                expect(typeof event.github_url).toBe("string");
                expect(typeof event.deployed_url).toBe("string");
            });
    });
    test("200 returns total count", () => {
        return request(app)
            .get("/api/events")
            .expect(200)
            .then(({ body }) => {
                const { events } = body;
                events.forEach((event) => {
                    expect(typeof event.total_count).toBe("number");
                    expect(event.total_count).toEqual(12);
                });
            });
    });
    test("201 successful post, additional properties ignored", () => {
        const newEvent = {
            surplus: "test ignore",
            author: "al-ex-huze",
            title: "Test Title - New event",
            body: "Test body - one, two, three",

            topics: "topic a. topic b.",
            timeline: "Northcoders Bootcamp",
            start_date: "2024-07-15",
            end_date: "2024-07-19",
            github_url: "https://test.uk",
            deployed_url: "https://test.uk",
            event_img_url_1:
                "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg",
            extra: 12345,
        };
        const expected = {
            author: "al-ex-huze",
            title: "Test Title - New event",
            event_id: 13,
            body: "Test body - one, two, three",
            topics: "topic a. topic b.",
            timeline: "Northcoders Bootcamp",
            created_at: expect.any(String),
            start_date: "2024-07-15",
            end_date: "2024-07-19",
            votes: 0,
            github_url: "https://test.uk",
            deployed_url: "https://test.uk",
            event_img_url_1:
                "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg",
        };
        return request(app)
            .post("/api/events")
            .send(newEvent)
            .expect(201)
            .then(({ body }) => {
                const { event } = body;
                expect(event).toMatchObject(expected);
            });
    });
    test("201 successful post with default img url if not included", () => {
        const newEvent = {
            author: "al-ex-huze",
            title: "Test Title - New event",
            body: "Test body - one, two, three",
            skills: "skill one. skill two.",
            topics: "topic a. topic b.",
            timeline: "Northcoders Bootcamp",
            start_date: "2024-07-15",
            end_date: "2024-07-19",
            github_url: "https://test.uk",
            deployed_url: "https://test.uk",
        };
        return request(app)
            .post("/api/events")
            .send(newEvent)
            .expect(201)
            .then(({ body }) => {
                const { event } = body;
                expect(event.event_img_url_1).toBe(
                    "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
                );
            });
    });
    test("201 successful post with default img url is null", () => {
        const newEvent = {
            author: "al-ex-huze",
            title: "Test Title - New event",
            body: "Test body - one, two, three",
            skills: "skill one. skill two.",
            topics: "topic a. topic b.",
            timeline: "Northcoders Bootcamp",
            start_date: "2024-07-15",
            end_date: "2024-07-19",
            event_img_url_1: null,
            github_url: "https://test.uk",
            deployed_url: "https://test.uk",
        };
        return request(app)
            .post("/api/events")
            .send(newEvent)
            .expect(201)
            .then(({ body }) => {
                const { event } = body;
                expect(event.event_img_url_1).toBe(
                    "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
                );
            });
    });
    test("404 valid but non existent timeline", () => {
        const newEvent = {
            author: "al-ex-huze",
            title: "Test Title - New event",
            body: "Test body - one, two, three",
            skills: "skill one. skill two.",
            topics: "topic a. topic b.",
            timeline: "Southcoders Bootcamp",
            start_date: "2024-07-15",
            end_date: "2024-07-19",
            github_url: "https://test.uk",
            deployed_url: "https://test.uk",
            event_img_url_1:
                "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg",
        };
        return request(app)
            .post("/api/events")
            .send(newEvent)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe(
                    "Timeline does not exist: Southcoders Bootcamp"
                );
            });
    });
    test("404 valid but non existent author", () => {
        const newEvent = {
            author: "al",
            title: "Test Title - New event",
            body: "Test body - one, two, three",
            skills: "skill one. skill two.",
            topics: "topic a. topic b.",
            timeline: "Northcoders Bootcamp",
            start_date: "2024-07-15",
            end_date: "2024-07-19",
            github_url: "https://test.uk",
            deployed_url: "https://test.uk",
            event_img_url_1:
                "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg",
        };
        return request(app)
            .post("/api/events")
            .send(newEvent)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("User does not exist: al");
            });
    });
    test("400 missing required fields", () => {
        const newEvent = {
            author: "al-ex-huze",
            title: null,
            body: "Test body - one, two, three",
            skills: "skill one. skill two.",
            topics: "topic a. topic b.",
            timeline: "Northcoders Bootcamp",
            start_date: "2024-07-15",
            end_date: "2024-07-19",
            github_url: "https://test.uk",
            deployed_url: "https://test.uk",
            event_img_url_1:
                "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg",
        };
        return request(app)
            .post("/api/events")
            .send(newEvent)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("PSQL ERROR: 23502 - Missing input.");
            });
    });
    test("400 missing required fields", () => {
        const newEvent = {
            author: "al-ex-huze",
            title: "Test Title - New event",
            body: null,
            skills: "skill one. skill two.",
            topics: "topic a. topic b.",
            timeline: "Northcoders Bootcamp",
            start_date: "2024-07-15",
            end_date: "2024-07-19",
            github_url: "https://test.uk",
            deployed_url: "https://test.uk",
            event_img_url_1:
                "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg",
        };
        return request(app)
            .post("/api/events")
            .send(newEvent)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("PSQL ERROR: 23502 - Missing input.");
            });
    });
});

describe("DELETE /api/events/:event_id", () => {
    test("204 responds with no content", () => {
        return request(app)
            .delete("/api/events/2")
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
                expect(body.msg).toBe("PSQL ERROR: 22P02 - Invalid input.");
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

describe("PATCH /api/events/:event_id", () => {
    test("200 returns updated event", () => {
        const patchID = 2;
        const update = {
            new_start_date: "2024-07-20",
            new_end_date: "2024-07-25",
            new_title: "Test Title - New event",
            new_body: "Test body - one, two, three",
            new_skills: "skill one. skill two.",
            new_topics: "topic a. topic b.",
            new_timeline: "Northcoders Bootcamp",
            new_github_url: "https://test.uk",
            new_deployed_url: "https://test.uk",
            new_event_img_url_1: "https://new-url.co.uk",
            new_event_img_url_2: "https://new-url.co.uk",
            new_event_img_url_3: "https://new-url.co.uk",
        };
        return request(app)
            .patch(`/api/events/${patchID}`)
            .send(update)
            .expect(200)
            .then(({ body }) => {
                const { event } = body;
                expect(event.start_date).toEqual("2024-07-20");
                expect(event.end_date).toEqual("2024-07-25");
                expect(typeof event.author).toBe("string");
                expect(typeof event.title).toBe("string");
                expect(typeof event.event_id).toBe("number");
                expect(typeof event.body).toBe("string");
                expect(typeof event.skills).toBe("string");
                expect(typeof event.topics).toBe("string");
                expect(typeof event.timeline).toBe("string");
                expect(typeof event.created_at).toBe("string");
                expect(typeof event.start_date).toBe("string");
                expect(typeof event.end_date).toBe("string");
                expect(typeof event.votes).toBe("number");
                expect(typeof event.deployed_url).toBe("string");
                expect(typeof event.event_img_url_1).toBe("string");
                expect(typeof event.event_img_url_2).toBe("string");
                expect(typeof event.event_img_url_3).toBe("string");
            });
    });
    test("200 returns updated event", () => {
        const patchID = 2;
        const update = {
            new_start_date: "2024-07-28",
            new_end_date: "2024-07-29",
            new_title: "Test Title - New event",
            new_body: "Test body - one, two, three",
            new_skills: "skill one. skill two.",
            new_topics: "topic a. topic b.",
            new_timeline: "Northcoders Bootcamp",
            new_github_url: "https://test.uk",
            new_deployed_url: "https://test.uk",
            new_event_img_url_1: "https://new-url.co.uk",
            new_event_img_url_2: "https://new-url-2.co.uk",
            new_event_img_url_3: "https://new-url-3.co.uk",
        };
        return request(app)
            .patch(`/api/events/${patchID}`)
            .send(update)
            .expect(200)
            .then(({ body }) => {
                const { event } = body;
                expect(event.start_date).toEqual("2024-07-28");
                expect(event.end_date).toEqual("2024-07-29");
                expect(event.title).toEqual("Test Title - New event");
                expect(event.body).toEqual("Test body - one, two, three");
                expect(event.skills).toEqual("skill one. skill two.");
                expect(event.topics).toEqual("topic a. topic b.");
                expect(event.timeline).toEqual("Northcoders Bootcamp");
                expect(event.github_url).toBe("https://test.uk");
                expect(event.deployed_url).toBe("https://test.uk");
                expect(event.event_img_url_1).toEqual("https://new-url.co.uk");
                expect(event.event_img_url_2).toEqual(
                    "https://new-url-2.co.uk"
                );
                expect(event.event_img_url_3).toEqual(
                    "https://new-url-3.co.uk"
                );
            });
    });
    test("200 returns updated event null not needed", () => {
        const patchID = 2;
        const update = {
            new_start_date: "2024-07-28",
            new_end_date: "2024-07-29",
            new_title: "Test Title - New event",
            new_body: "Test body - one, two, three",
            new_skills: null,
            new_topics: null,
            new_github_url: "https://test.uk",
            new_deployed_url: "https://test.uk",
            new_timeline: "Northcoders Bootcamp",
        };
        return request(app)
            .patch(`/api/events/${patchID}`)
            .send(update)
            .expect(200)
            .then(({ body }) => {
                const { event } = body;
                expect(event.start_date).toEqual("2024-07-28");
                expect(event.end_date).toEqual("2024-07-29");
                expect(event.title).toEqual("Test Title - New event");
                expect(event.body).toEqual("Test body - one, two, three");
                expect(event.timeline).toEqual("Northcoders Bootcamp");
            });
    });
    test("200 default time now when end date is null", () => {
        const patchID = 2;
        const update = {
            new_start_date: "2024-07-20",
            new_end_date: null,
            new_title: "Test Title - New event",
            new_body: "Test body - one, two, three",
            new_skills: "skill one. skill two.",
            new_topics: "topic a. topic b.",
            new_github_url: "https://test.uk",
            new_deployed_url: "https://test.uk",
            new_timeline: "Northcoders Bootcamp",
        };
        return request(app)
            .patch(`/api/events/${patchID}`)
            .send(update)
            .expect(200)
            .then(({ body }) => {
                const { event } = body;
            });
    });
    test("400 missing required fields when request is null", () => {
        const patchID = 2;
        const update = null;
        return request(app)
            .patch(`/api/events/${patchID}`)
            .send(update)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("PSQL ERROR: 23502 - Missing input.");
            });
    });
    test("400 incorrect fields of wrong property type", () => {
        const patchID = 2;
        const update = {
            new_start_date: "2024-07-20",
            new_end_date: 9999,
            new_title: "Test Title - New event",
            new_body: "Test body - one, two, three",
            new_skills: "skill one. skill two.",
            new_topics: "topic a. topic b.",
            new_github_url: "https://test.uk",
            new_deployed_url: "https://test.uk",
            new_timeline: "Northcoders Bootcamp",
        };
        return request(app)
            .patch(`/api/events/${patchID}`)
            .send(update)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Date input is an integer");
            });
    });
    test("400 incorrect type of request", () => {
        const patchID = 2;
        const update = ["2024-07-20"];
        return request(app)
            .patch(`/api/events/${patchID}`)
            .send(update)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("PSQL ERROR: 23502 - Missing input.");
            });
    });
});

describe("GET /api/repos", () => {
    test("200 returns all repos", () => {
        return request(app)
            .get("/api/repos")
            .expect(200)
            .then(({ body }) => {
                const { repos } = body;
                repos.forEach((repo) => {
                    expect(typeof repo.repo_id).toBe("number");
                    expect(typeof repo.name).toBe("string");
                    expect(typeof repo.full_name).toBe("string");
                    expect(typeof repo.owner_login).toBe("string");
                    expect(typeof repo.fork).toBe("boolean");
                    expect(typeof repo.created_at).toBe("string");
                    expect(typeof repo.updated_at).toBe("string");
                    expect(typeof repo.pushed_at).toBe("string");
                    expect(typeof repo.size).toBe("number");
                    expect(typeof repo.visibility).toBe("string");
                    expect(typeof repo.default_branch).toBe("string");
                });
            });
    });
});

describe("GET /api/languages", () => {
    test("200 returns an array of languages object", () => {
        return request(app)
            .get("/api/languages")
            .expect(200)
            .then(({ body }) => {
                const { languages } = body;
                languages.forEach((language) => {
                    expect(typeof language.full_name_languages).toBe("string");
                    expect(typeof language.languages_and_size).toBe("string");
                });
            });
    });
});

describe("GET /api/feels", () => {
    test("200 returns an array of feels object", () => {
        return request(app)
            .get("/api/feels")
            .expect(200)
            .then(({ body }) => {
                const { feels } = body;
                feels.forEach((feeling) => {
                    expect(typeof feeling.week_number).toBe("string");
                    expect(typeof feeling.week_start_date).toBe("string");
                    expect(typeof feeling.week_end_date).toBe("string");
                    expect(typeof feeling.knowledge).toBe("number");
                    expect(typeof feeling.experience).toBe("number");
                    expect(typeof feeling.passion).toBe("number");
                    expect(typeof feeling.enthusiasm).toBe("number");
                    expect(typeof feeling.confidence).toBe("number");
                    expect(typeof feeling.wisdom).toBe("number");
                    expect(typeof feeling.despair).toBe("number");
                    expect(typeof feeling.input).toBe("number");
                    expect(typeof feeling.output).toBe("number");
                });
            });
    });
    test("200 returns sorted by ascending week_start_date order as default", () => {
        return request(app)
            .get("/api/feels")
            .expect(200)
            .then(({ body }) => {
                const { feels } = body;
                expect(feels).toBeSortedBy("week_start_date");
            });
    });
});

describe("PATCH /api/feels/:week", () => {
    test("200 returns updated event", () => {
        const patchWeek = "01-2024";
        const update = {
            knowledge_update: 10,
            experience_update: 15,
            passion_update: 20,
            enthusiasm_update: 25,
            confidence_update: 30,
            wisdom_update: 35,
            despair_update: 40,
            input_update: 45,
            output_update: 50,
        };
        return request(app)
            .patch(`/api/feels/${patchWeek}`)
            .send(update)
            .expect(200)
            .then(({ body }) => {
                const { feeling } = body;
                expect(typeof feeling.week_number).toBe("string");
                expect(typeof feeling.week_start_date).toBe("string");
                expect(typeof feeling.week_end_date).toBe("string");
                expect(typeof feeling.knowledge).toBe("number");
                expect(typeof feeling.experience).toBe("number");
                expect(typeof feeling.passion).toBe("number");
                expect(typeof feeling.enthusiasm).toBe("number");
                expect(typeof feeling.confidence).toBe("number");
                expect(typeof feeling.wisdom).toBe("number");
                expect(typeof feeling.despair).toBe("number");
                expect(typeof feeling.input).toBe("number");
                expect(typeof feeling.output).toBe("number");
            });
    });
    test("200 returns updated event", () => {
        const patchWeek = "01-2024";
        const update = {
            knowledge_update: 10,
            experience_update: 15,
            passion_update: 20,
            enthusiasm_update: 25,
            confidence_update: 30,
            wisdom_update: 35,
            despair_update: 40,
            input_update: 45,
            output_update: 50,
        };
        return request(app)
            .patch(`/api/feels/${patchWeek}`)
            .send(update)
            .expect(200)
            .then(({ body }) => {
                const { feeling } = body;
                expect(feeling.week_number).toEqual("01-2024");
                expect(feeling.week_start_date).toEqual("2024-01-01");
                expect(feeling.week_end_date).toEqual("2024-01-07");
                expect(feeling.knowledge).toEqual(10);
                expect(feeling.experience).toEqual(15);
                expect(feeling.passion).toEqual(20);
                expect(feeling.enthusiasm).toEqual(25);
                expect(feeling.confidence).toEqual(30);
                expect(feeling.wisdom).toEqual(35);
                expect(feeling.despair).toEqual(40);
                expect(feeling.input).toEqual(45);
                expect(feeling.output).toEqual(50);
            });
    });
    test("400 missing required fields when request key is null", () => {
        const patchWeek = "01-2024";
        const update = null;
        return request(app)
            .patch(`/api/feels/${patchWeek}`)
            .send(update)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Update data input is not an integer");
            });
    });

    test("400 incorrect fields of wrong property type", () => {
        const patchWeek = "01-2024";
        const update = {
            knowledge_update: "2024-01-07",
            experience_update: 15,
            passion_update: 20,
            enthusiasm_update: 25,
            confidence_update: 30,
            wisdom_update: 35,
            despair_update: 40,
            input_update: 45,
            output_update: 50,
        };
        return request(app)
            .patch(`/api/feels/${patchWeek}`)
            .send(update)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Update data input is not an integer");
            });
    });
    test("400 incorrect type of request", () => {
        const patchWeek = "01-2024";
        const update = [
            {
                knowledge_update: 10,
                experience_update: 15,
                passion_update: 20,
                enthusiasm_update: 25,
                confidence_update: 30,
                wisdom_update: 35,
                despair_update: 40,
                input_update: 45,
                output_update: 50,
            },
        ];
        return request(app)
            .patch(`/api/feels/${patchWeek}`)
            .send(update)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Update data input is not an integer");
            });
    });
});

// describe.skip("GET /ghapi/auth_user/:user", () => {
//     test("200 data object", () => {
//         return request(app)
//             .get("/ghapi/auth_user/al-ex-huze")
//             .expect(200)
//             .then(({ body }) => {
//                 const { user_details } = body;
//                 // console.log("TEST --> " + user_details + " <-- TEST");
//                 /*{
//                     "message": "Not Found",
//                     "documentation_url": "https://docs.github.com/rest",
//                     "status": "404"
//                 }*/
//             });
//     });
// });

describe.skip("GET /ghapi/events/:user", () => {
    test("200 returns stringifieduser object", () => {
        return request(app)
            .get("/ghapi/events/al-ex-huze")
            .expect(200)
            .then(({ body }) => {
                const { events } = body;
                expect(typeof events).toBe("string");
                console.log(JSON.parse(events.length));
            });
    });
});

describe.skip("GET /ghapi/public_user/:user", () => {
    test("200 returns stringifieduser object", () => {
        return request(app)
            .get("/ghapi/public_user/al-ex-huze")
            .expect(200)
            .then(({ body }) => {
                const { user_details } = body;
                expect(typeof user_details).toBe("string");
                expect(JSON.parse(user_details).login).toEqual("al-ex-huze");
            });
    });
});

describe.skip("GET /ghapi/all_repos/:user/", () => {
    test("200 returns stringified array of objects", () => {
        return request(app)
            .get("/ghapi/all_repos/al-ex-huze")
            .expect(200)
            .then(({ body }) => {
                const { all_repos } = body;
                expect(typeof all_repos).toBe("string");
                console.log(JSON.parse(all_repos));
            });
    });
});

describe.skip("GET /ghapi/weekly_commits/:repo", () => {
    test("200 data array", () => {
        return request(app)
            .get("/ghapi/weekly_commits/be-pp-timeline")
            .expect(200)
            .then(({ body }) => {
                const { weeklyCommits } = body;
                expect(typeof weeklyCommits).toBe("string");
                console.log(JSON.parse(weeklyCommits));
            });
    });
});

describe.skip("GET /ghapi/yearly_activity/:repo", () => {
    test("200 data object", () => {
        return request(app)
            .get("/ghapi/yearly_activity/be-pp-timeline")
            .expect(200)
            .then(({ body }) => {
                const { yearlyActivity } = body;
                expect(typeof yearlyActivity).toBe("string");
                console.log(JSON.parse(yearlyActivity));
            });
    });
});

describe.skip("GET /ghapi/languages_used/:repo", () => {
    test("200 object", () => {
        return request(app)
            .get("/ghapi/languages_used/be-pp-timeline")
            .expect(200)
            .then(({ body }) => {
                const { languages } = body;
                expect(typeof languages).toBe("string");
                console.log(JSON.parse(languages));
            });
    });
});
