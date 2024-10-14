const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const app = require("../app.js");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("GET: /api", () => {
  test("GET 200: Returns an object describing the endpoints, acceptable queries, the format of the request body and an example response", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});

describe("GET: /api/topics", () => {
  test("GET 200: Returns an array of topic objects which have the properties 'slug' and 'description'", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.topics)).toBe(true);
        body.topics.forEach((topic) => {
          expect(topic.hasOwnProperty("slug")).toBe(true);
          expect(topic.hasOwnProperty("description")).toBe(true);
        });
      });
  });
});

describe("GET: /api/articles/:article_id", () => {
  test("GET 200: Returns an article corresponding to the correct id, with the correct properties", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toBe(2);
        expect(body.article.hasOwnProperty("author")).toBe(true);
        expect(body.article.hasOwnProperty("title")).toBe(true);
        expect(body.article.hasOwnProperty("article_id")).toBe(true);
        expect(body.article.hasOwnProperty("body")).toBe(true);
        expect(body.article.hasOwnProperty("topic")).toBe(true);
        expect(body.article.hasOwnProperty("created_at")).toBe(true);
        expect(body.article.hasOwnProperty("votes")).toBe(true);
        expect(body.article.hasOwnProperty("article_img_url")).toBe(true);
      });
  });
  test("GET 400: Returns a bad request error when article_id is not valid to process", () => {
    return request(app)
      .get("/api/articles/an_author")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("GET 404: Returns a not found error when article_id is valid to process but no data found", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Author does not exist");
      });
  });
});
