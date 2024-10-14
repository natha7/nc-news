# Northcoders News API

How to use locally:

> Install the dotenv-npm package.

> Add .env.x files where x corresponds to a unique word associated with an individual database you wish to connect to.

> In each .env.x file add the following line: PGDATABASE = [DATABASE_NAME].

> Check that connection.js is requiring dotenv and that the configuration has the path set to the directory where the .env files exist

> IMPORTANT: Ensure that the x in .env.x corresponds to the options of values that the ENV variable in connection.js will resolve to, if using jest process.env. NODE_ENV will resolve to 'test'

> IMPORTANT: Ensure that your .env.x files are .gitignored, you do not want your database names public

> You're all set! dotenv will now set the environment variable of your PGDATABASE programmatically

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
