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