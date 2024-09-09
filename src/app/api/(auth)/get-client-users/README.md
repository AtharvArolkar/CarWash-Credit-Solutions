# API Logic

- Connect to the database
- Verify the token, if invalid respond with 401 error.
- Fetch user id from the token.
- Check if the user exists in the db, if not throw error
- Check if tha user is allowed to accesss that resource, if not throw 403 error.
- Fetch the users, which have role as client, project the name and id.
- Return the response with 200 status.
