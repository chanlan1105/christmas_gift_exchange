# Updating the database

Tale note of the `DATABASE_URL` found in the `.env` file at the root of this project.

Use the SQL files to manually query the database:

```bash
psql DATABASE_URL -f file.sql
```

# Pre-defined Node.js scripts

Some actions already have pre-defined Node.js scripts. For example, `generateAssignments.js` to randomly generate assignments each year.