# Requirements

- **Docker** (version 20.10+ recommended)
- **Docker Compose** (version 2.0+ required)
- **Node.js** (version 23+ recommended)
- **Yarn**

# Install

To install the project, you just have to run :

- `yarn install` to get all the dependencies
- `yarn setup` to setup the db container and run the migrations

# Running the tests

After installing the dependencies you can run the tests with this command `yarn test`.
You can run the critical tests with persistence with this command `yarn test:critical`.

# Using the CLI

```
./fleet create <userId> # returns fleetId on the standard output
./fleet register-vehicle <fleetId> <vehiclePlateNumber>
./fleet localize-vehicle <fleetId> <vehiclePlateNumber> lat lng
```

# Step 3 answers

About the code quality and the CI/CD, we should/can use:

- ESLint for the linting : it catches some syntax errors
- Prettier so that code is styled for a good readability and consitency

- We can use tools like SonarQube to have an audit of bad code practices and security issues.

- Some tool for the code coverage of the tests is nice to have to master what and how much the app is tested, and to ensure every critical feature is tested.

- Linting and formatting tools should run during precommit, to avoid to review code with syntax errors, and for the style consistency.

- Tests should run when a Pull Request is opened so that you ensure your change didn't break anything even before it gets reviewed.

The CI/CD pipeline should have a pre deploy phase where it run tests, code quality insurance tools, build.
Then a deploy phase, where it migrates the DB schema and then deploy the new code.
And finally a post-deploy phases with actions such as updating an API documentation for instance.

# Algo exercise

`node fizzbuzz.js`