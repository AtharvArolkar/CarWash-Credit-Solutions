# API Logic

- Check if token exist and is valid
  - If not throw 401 error.
  - If exists, fetch user ID from token payloiad and verify the id
    - If ID not found throw 404 error
    - If found, check the role of the user
      - if role is CLIENT, throw 403 error
      - if not, destructure the payload
        - Check if page is present,if not throw 400 error saying page is required attribute.
        - Form Date Query; 4 conditions:(endData > createdAt >startDate )
          1. If start and end date both are present. Start date beginning of start date and end date ending of end date
          2. If end date not present and start date present, throw error 400
          3. If only start date present, Start date beginning of startdate and enddate end of start date.
          4. If nothing is present, by default startdate begining of today's date and enddate ending of today's date
        - Start _Aggregation Pipeline_
          - Match based on date query
          - Lookup into user table for client user with fk value (clientID) and get corresponding client user objects
          - Lookup into user table for client user with fk value (createadBy) and get corresspondin createdBy user objects
          - Start a facet for creating 2 seperate pipelines from here
            1. Match based on regex stored as search string, for substring matches and get count of total number of matches found. If no search string pass empty string.
            2. - Match based on regex stored as search string, for substring matches
               - Select what fields to project from the results.
               - Add skip and limit for pagination.
            - Project the facet results(1,2) as totalTickets present in DB and fetched tickets array for that page
          - End of facet
        - End Aggregation Pipeline
        - Formulated te respose, with the pipeline results, along with adding total count of fetched tickets and return the response.
