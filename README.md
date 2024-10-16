# Northcoders News API

### **Hosted Version** https://natha7-nc-news.onrender.com/api

---

## **What is this API?**

This API is a back-end for a mock news site with endpoint responses to the articles, users, comments and topics with some sorting and filtering features. The API uses the express.js web framework for routing and responding to requests at endpoints and postgreSQL for data management. This project uses Model-View-Controller design patterns for separation of concerns and TDD was used to develop endpoints.

---

## **How to use locally**

- Ensure you have installed these or later versions: postgreSQL 16.4 and node v22.6.0

- In your terminal use:

  - `git clone https://github.com/natha7/nc-news` to clone the repository
  - `npm install` to install the project dependencies
  - `npm run setup-dbs` to setup the databases (optionally delete db/setup.sql)

- Create .env.X files in the top-level folder, for example: .env.test & .env.development, these files should contain a single line `PGDATABASE = [YOUR_DATABASE_NAME]`

- Ensure your .env files are ignored to not publicize your database names
- See ./db/connection.js to see how dotenv uses the `process.env.NODE_ENV` to set current database appropiately
- Seeding of the test database will happen before every test however to seed the development database use `npm run seed`
- You're all set! To listen and serve on a localhost use `npm run start` this should display 'Listening on PORT...' in the terminal, now navigate to localhost:PORT/api to view the api endpoints page. To test the endpoints use `npm test __tests__/endpoints.test.js`

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
