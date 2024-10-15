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
        const topics = body.topics;
        expect(topics.length).toBeGreaterThan(0);
        expect(Array.isArray(topics)).toBe(true);
        body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
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
        const article = body.article;
        expect(body.article.article_id).toBe(2);
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");
        expect(article).toHaveProperty("title");
      });
  });
  test("GET 400: Returns a bad request error when article_id is not valid to process", () => {
    return request(app)
      .get("/api/articles/invalid_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request - invalid type");
      });
  });
  test("GET 404: Returns a not found error when article_id is valid to process but no data found", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article does not exist");
      });
  });
});

describe("GET: /api/articles", () => {
  test("GET 200: Returns an array of articles with each contained object having the correct properties, by default in descending order and no body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBeGreaterThan(0);
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        expect(
          articles.find(
            (article) => article.title === "Living in the shadow of a great man"
          ).comment_count
        ).toBe(11);
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
          expect(article).toHaveProperty("title");
        });
      });
  });
});

describe("GET: /api/articles/:article_id/comments", () => {
  test("GET 200: Returns an array of comments which share the article id passed in and each comment object has the correct properties, sorted by newest first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments.length).toBeGreaterThan(0);
        expect(Array.isArray(body.comments)).toBe(true);
        expect(comments).toBeSortedBy("created_at", { descending: true });
        comments.forEach((comment) => {
          expect(comment.article_id).toBe(1);
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("article_id");
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("body");
        });
      });
  });
  test("GET 400: Returns a bad request error when passed an id that cannot be processed", () => {
    return request(app)
      .get("/api/articles/invalid_id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request - invalid type");
      });
  });
  test("GET 404: Returns a not found error when passed an id that can be processed but there are no associated rows", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article does not exist");
      });
  });
  test("GET 200: Returns an empty comments array when article id exists but the article has no associated comments", () => {
    return request(app)
      .get("/api/articles/10/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toEqual([]);
      });
  });
});

describe("POST: /api/articles/:article_id/comments", () => {
  test("POST 201: Returns the posted comment with the correct article id and properties", () => {
    const commentToPost = {
      username: "icellusedkars",
      body: "Hi, this is a test comment",
    };

    return request(app)
      .post("/api/articles/10/comments")
      .send(commentToPost)
      .expect(201)
      .then(({ body }) => {
        const postedComment = body.comment;
        expect(postedComment).toHaveProperty("comment_id");
        expect(postedComment).toHaveProperty("author", "icellusedkars");
        expect(postedComment).toHaveProperty(
          "body",
          "Hi, this is a test comment"
        );
        expect(postedComment).toHaveProperty("article_id", 10);
        expect(postedComment).toHaveProperty("created_at");
      });
  });
  test("POST 400: Returns an unprocessable entity error when passed a correct article id but missing properties on the posted comment", () => {
    const commentToPost = {
      username: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/10/comments")
      .send(commentToPost)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required key(s)");
      });
  });
  test("POST 404: Returns a not found error when article with passed in id is valid but does not exist", () => {
    const commentToPost = {
      username: "icellusedkars",
      body: "Hi, this is a test comment",
    };

    return request(app)
      .post("/api/articles/999/comments")
      .send(commentToPost)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article does not exist");
      });
  });
  test("POST 400: Returns a bad request error when article with passed in id is invalid", () => {
    const commentToPost = {
      username: "icellusedkars",
      body: "Hi, this is a test comment",
    };

    return request(app)
      .post("/api/articles/invalid_id/comments")
      .send(commentToPost)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request - invalid type");
      });
  });
  test("POST 404: Returns a not found error when the username passed in the comment does not exist", () => {
    const commentToPost = {
      username: "invalid_user",
      body: "Test comment",
    };

    return request(app)
      .post("/api/articles/10/comments")
      .send(commentToPost)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Username does not exist");
      });
  });
});

describe("PATCH: /api/articles/:article_id", () => {
  test("PATCH 200: Returns the patched article object with votes adjusted to the inc_votes amount with the correct id", () => {
    const votesToPatch = {
      inc_votes: 2,
    };

    return request(app)
      .patch("/api/articles/2")
      .send(votesToPatch)
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("article_id", 2);
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes", 2);
        expect(article).toHaveProperty("article_img_url");
        expect(article).toHaveProperty("title");
      });
  });
  test("PATCH 400: Returns a bad request error when passed a request body without an inc_votes key", () => {
    const votesToPatch = {
      invalid_extra_key: true,
    };

    return request(app)
      .patch("/api/articles/2")
      .send(votesToPatch)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required key(s)");
      });
  });
  test("PATCH 404: Returns a not found request error when article_id with the passed in id does not exist", () => {
    const votesToPatch = {
      inc_votes: 2,
    };

    return request(app)
      .patch("/api/articles/999")
      .send(votesToPatch)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article does not exist");
      });
  });
  test("PATCH 400: Returns a bad request error when value in inc_votes is not a valid data type", () => {
    const votesToPatch = {
      inc_votes: "string",
    };

    return request(app)
      .patch("/api/articles/10")
      .send(votesToPatch)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request - invalid type");
      });
  });

  test("PATCH 400: Returns a bad request error when article_id is an invalid type", () => {
    const votesToPatch = {
      inc_votes: 4,
    };

    return request(app)
      .patch("/api/articles/invalid_id")
      .send(votesToPatch)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request - invalid type");
      });
  });
});
