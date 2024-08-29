# API Logic

- Check if newPassword and identifier are present

  - If not present return bad request response
  - If present
    - Check if the user exists
      - If not return not found response
      - If found
        - Check if the user is verified
          - if verified check if old password is present in the payload
            - if not present return bad request response
            - if present check if the token is valid
              - if not valid return unauthorised response
              - Check if the old password is matches
                - if not return bad request response
                - if matches hash the password and update the DB
        - If user is not verified (First time login)
        - hash the password, make isVerified to true and update the DB
