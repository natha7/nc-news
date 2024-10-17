const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const app = require("../app.js");
const endpoints = require("../endpoints.json");
const { getTopicByName } = require("../controllers/utils/getTopicByName.js");

beforeEach(() => {
  return seed(testData);
});

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
        expect(body.msg).toBe("Bad request");
      });
  });
  test("GET 200: Returns an article with the correct article id and properties and additionally a comment_count property when article has comments", () => {
    return request(app)
      .get("/api/articles/5")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(body.article.article_id).toBe(5);
        expect(article).toHaveProperty("comment_count", 2);
      });
  });
  test("GET 200: Returns an article with the correct article id and properties and additionally a comment_count property when article does not have comments", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(body.article.article_id).toBe(2);
        expect(article).toHaveProperty("comment_count", 0);
      });
  });
  test("GET 404: Returns a not found error when article_id is valid to process but no data found", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
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
        expect(articles.length).toBe(13);
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
        expect(body.msg).toBe("Bad request");
      });
  });
  test("GET 404: Returns a not found error when passed an id that can be processed but there are no associated rows", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
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
        expect(body.msg).toBe("Bad request");
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
        expect(body.msg).toBe("Not found");
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
        expect(body.msg).toBe("Bad request");
      });
  });
  test("POST 400: Returns a bad request error when the username passed in the comment does not exist", () => {
    const commentToPost = {
      username: "invalid_user",
      body: "Test comment",
    };

    return request(app)
      .post("/api/articles/10/comments")
      .send(commentToPost)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
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
    const votesToPatch = {};

    return request(app)
      .patch("/api/articles/2")
      .send(votesToPatch)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
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
        expect(body.msg).toBe("Not found");
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
        expect(body.msg).toBe("Bad request");
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
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("DELETE: /api/comments/:comment_id", () => {
  test("DELETE 204: Returns a no content status code to display the fulfilled request with no content", () => {
    return request(app)
      .delete("/api/comments/3")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("DELETE 400: Returns a bad request error when provided comment_id cannot be processed", () => {
    return request(app)
      .delete("/api/comments/invalid_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("DELETE 404: Returns a not found error when provided comment_id does not exist in the database", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET: /api/users", () => {
  test("GET 200: Returns an array of user objects each with the correct properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body.users;
        expect(users.length).toBeGreaterThan(0);
        expect(Array.isArray(users)).toBe(true);
        users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
});

describe("GET: /api/articles?sort_by&order", () => {
  test("GET 200: The returned array of articles can be sorted by title in descending order by default", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(13);
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toBeSortedBy("title", { descending: true });
      });
  });
  test("GET 200: The returned array of articles can be sorted by article_id in descending order by default", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(13);
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toBeSortedBy("article_id", { descending: true });
      });
  });
  test("GET 200: The returned array of articles can be sorted by created_at in descending order by default", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(13);
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET 200: The returned array of articles can be sorted by topic in descending order by default", () => {
    return request(app)
      .get("/api/articles?sort_by=topic")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(13);
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toBeSortedBy("topic", { descending: true });
      });
  });
  test("GET 200: The returned array of articles can be sorted by votes in descending order by default", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(13);
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toBeSortedBy("votes", { descending: true });
      });
  });
  test("GET 200: The returned array of articles can be sorted by comment_count in descending order by default", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(13);
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toBeSortedBy("comment_count", { descending: true });
      });
  });
  test("GET 200: The returned array of articles can be sorted by author in descending order by default", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(13);
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toBeSortedBy("author", { descending: true });
      });
  });
  test("GET 200: The returned array defaults to sorted by created_at when provided the order but not the sort_by", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(13);
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toBeSortedBy("created_at");
      });
  });
  test("GET 200: The query values are case insensitive", () => {
    return request(app)
      .get("/api/articles?sort_by=COMMENT_COUNT&order=asc")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(13);
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toBeSortedBy("comment_count");
      });
  });
  test("GET 200: The returned array defaults to desc when provided sort_by but not order ", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(13);
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toBeSortedBy("title", { descending: true });
      });
  });
  test("GET 400: Returns a bad request error when passed in an unapproved sort_by", () => {
    return request(app)
      .get("/api/articles?sort_by=unapprovedColumn&order=desc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("GET 400: Returns a bad request error when passed in an unapproved order", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=unapprovedOrder")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET: /api/articles?topics", () => {
  test("GET 200: The returned array of articles is filtered by the topic query value", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(12);
        expect(Array.isArray(articles)).toBe(true);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("GET 200: The array of articles defaults to all articles when topic not provided", () => {
    return request(app)
      .get("/api/articles?topic=")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(13);
        expect(Array.isArray(articles)).toBe(true);
      });
  });
  test("GET 200: The topic query can be used in combination with the sort_by and order query", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=author&order=asc")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(12);
        expect(Array.isArray(articles)).toBe(true);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
        expect(articles).toBeSortedBy("author");
      });
  });
  test("GET 404: Returns a custom not found error when no articles of a topic are found", () => {
    return request(app)
      .get("/api/articles?topic=lattes")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET 404: /api/X", () => {
  test("GET 404: Returns a not found error when trying to get from any endpoint that does not exist", () => {
    return request(app)
      .get("/api/chicken")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET: /api/users/:username", () => {
  test("GET 200: Returns a user object with the username passed in", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        const user = body.user;
        expect(user).toHaveProperty("username", "butter_bridge");
        expect(user).toHaveProperty("avatar_url");
        expect(user).toHaveProperty("name", "jonny");
      });
  });
  test("GET 404: Returns a not found error and custom message when the username requested does not exist in the database", () => {
    return request(app)
      .get("/api/users/invalid_user")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("GET 400: Returns a bad request error when the username contains special characters", () => {
    return request(app)
      .get("/api/users/;special!character*user")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("PATCH: /api/comments/:comment_id", () => {
  test("PATCH 200: Returns the comment object with correct properties and incremented in votes by the inc_votes request amount on the correct comment_id", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({
        inc_votes: 4,
      })
      .expect(200)
      .then(({ body }) => {
        const comment = body.comment;
        expect(comment).toHaveProperty("votes", 20);
        expect(comment).toHaveProperty("body");
        expect(comment).toHaveProperty("author");
        expect(comment).toHaveProperty("article_id");
        expect(comment).toHaveProperty("created_at");
        expect(comment).toHaveProperty("comment_id", 1);
      });
  });
  test("PATCH 200: Returns the comment object decremented in votes by the inc_votes request amount on the correct comment_id", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({
        inc_votes: -6,
      })
      .expect(200)
      .then(({ body }) => {
        const comment = body.comment;
        expect(comment).toHaveProperty("votes", 10);
        expect(comment).toHaveProperty("comment_id", 1);
      });
  });
  test("PATCH 400: Returns a bad request error when the comment_id provided is not a valid type i.e not a number", () => {
    return request(app)
      .patch("/api/comments/invalid_id")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("PATCH 404: Returns a not found error when the comment_id provided is a valid type but does not exist in the database", () => {
    return request(app)
      .patch("/api/comments/9999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("PATCH 400: Returns a bad request error when the inc_votes value is not valid i.e not a number", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: "invalid input" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("PATCH 400: Returns a bad request error when the inc_votes value is a decimal", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 4.99 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST: /api/articles", () => {
  test("POST 200: Returns the posted article with the correct properties some matching the request and some set by default", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "butter_bridge",
        title: "an essay on testing",
        body: "testing is important, thank you for reading",
        topic: "paper",
        article_img_url:
          "https://images.pexels.com/photos/965345/pexels-photo-965345.jpeg?cs=srgb&dl=pexels-markusspiske-965345.jpg&fm=jpg",
      })
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toHaveProperty("author", "butter_bridge");
        expect(article).toHaveProperty("title", "an essay on testing");
        expect(article).toHaveProperty(
          "body",
          "testing is important, thank you for reading"
        );
        expect(article).toHaveProperty("topic", "paper");
        expect(article).toHaveProperty(
          "article_img_url",
          "https://images.pexels.com/photos/965345/pexels-photo-965345.jpeg?cs=srgb&dl=pexels-markusspiske-965345.jpg&fm=jpg"
        );
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("votes", 0);
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("comment_count", 0);
      });
  });
  test("POST 404: Returns a not found error when the username corresponding to the author key does not exist in users", () => {
    const articleToPost = {
      author: "invalid_user",
      title: "an essay on testing",
      body: "testing is important, thank you for reading",
      topic: "paper",
      article_img_url:
        "https://images.pexels.com/photos/965345/pexels-photo-965345.jpeg?cs=srgb&dl=pexels-markusspiske-965345.jpg&fm=jpg",
    };
    return request(app)
      .post("/api/articles")
      .send(articleToPost)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("POST 404: Returns a not found error when the topic corresponding to the topic key does not exist in topics", () => {
    const articleToPost = {
      author: "butter_bridge",
      title: "an essay on testing",
      body: "testing is important, thank you for reading",
      topic: "invalid_topic",
      article_img_url:
        "https://images.pexels.com/photos/965345/pexels-photo-965345.jpeg?cs=srgb&dl=pexels-markusspiske-965345.jpg&fm=jpg",
    };

    return request(app)
      .post("/api/articles")
      .send(articleToPost)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("POST 404: Returns a combined not found error when the topic corresponding to the topic key and the username in users does not exist", () => {
    const articleToPost = {
      author: "invalid_user",
      title: "an essay on testing",
      body: "testing is important, thank you for reading",
      topic: "invalid_topic",
      article_img_url:
        "https://images.pexels.com/photos/965345/pexels-photo-965345.jpeg?cs=srgb&dl=pexels-markusspiske-965345.jpg&fm=jpg",
    };
    return request(app)
      .post("/api/articles")
      .send(articleToPost)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("POST 400: Returns a bad request error when missing essential input keys: author", () => {
    const articleToPost = {
      title: "an essay on testing",
      body: "testing is important, thank you for reading",
      topic: "cats",
      article_img_url:
        "https://images.pexels.com/photos/965345/pexels-photo-965345.jpeg?cs=srgb&dl=pexels-markusspiske-965345.jpg&fm=jpg",
    };
    return request(app)
      .post("/api/articles")
      .send(articleToPost)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("POST 400: Returns a bad request error when missing essential input keys: title", () => {
    const articleToPost = {
      author: "butter_bridge",
      body: "testing is important, thank you for reading",
      topic: "cats",
      article_img_url:
        "https://images.pexels.com/photos/965345/pexels-photo-965345.jpeg?cs=srgb&dl=pexels-markusspiske-965345.jpg&fm=jpg",
    };
    return request(app)
      .post("/api/articles")
      .send(articleToPost)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("POST 400: Returns a bad request error when missing essential input keys: body", () => {
    const articleToPost = {
      author: "butter_bridge",
      title: "an essay on testing",
      topic: "cats",
      article_img_url:
        "https://images.pexels.com/photos/965345/pexels-photo-965345.jpeg?cs=srgb&dl=pexels-markusspiske-965345.jpg&fm=jpg",
    };
    return request(app)
      .post("/api/articles")
      .send(articleToPost)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("POST 400: Returns a bad request error when missing essential input keys: topic", () => {
    const articleToPost = {
      author: "butter_bridge",
      title: "an essay on testing",
      body: "testing is important, thank you for reading",
      article_img_url:
        "https://images.pexels.com/photos/965345/pexels-photo-965345.jpeg?cs=srgb&dl=pexels-markusspiske-965345.jpg&fm=jpg",
    };
    return request(app)
      .post("/api/articles")
      .send(articleToPost)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("POST 200: Returns an article object with a default property for the article_img_url when no key/value for url provided", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "butter_bridge",
        title: "an essay on testing",
        body: "testing is important, thank you for reading",
        topic: "paper",
      })
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toHaveProperty(
          "article_img_url",
          "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
        );
      });
  });
});

describe("UTILS: getTopicByName", () => {
  test("Returns a topic object when topic exists in the topics table", () => {
    getTopicByName("cats").then((res) => {
      expect(res).toEqual({ description: "Not dogs", slug: "cats" });
    });
  });
  test("Returns a no topic found error when the result of the query is empty", () => {
    getTopicByName("dogs").catch((err) => {
      expect(err.msg).toBe("Not found");
    });
  });
});
