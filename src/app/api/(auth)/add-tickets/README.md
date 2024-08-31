# API Logic

- Check if token exist and is valid
  - If not throw 401 error.
  - If exists, fetch user ID from token payloiad and verify the id
    - If ID not found throw 404 error
    - If found, check the role of the user
      - if role is CLIENT, throw 403 error
      - if not, destructure the payload
        - Check for required attributes in the payload. Throw 400 error if all required attributes not present.
        - If pricePaid is less that price, check if client ID is present.
          - If not present throw 400 error.
          - If present, check of the client exists in the DB.
            - If not throw 404 error, saying client not found, Please register the client.
          - If present, set isCredit as true in a variab;es
        - Form a tickets object.
        - Save the ticket into DB. and return Success.
