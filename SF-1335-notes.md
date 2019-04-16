# Notes on how to resolve SF-1335
- The problem is that currently on qcsupply they are seeing errors of a malformed request when trying to access the recommendations endpoint. This is due to the request including a `sessionId` key that should not be present in requests to the recommendations endpoint.
- The solution for the problem that qcsupply is seeing is to add sessionId to only the search requests that go out
  - Steps to solution:
    - Remove the `RequestHelpers.attachSessionId()` call from the `index.ts` file within the requests folder.
    - Update the `search` function  within `utils.ts` file within the requests folder to call and use the `attachSessionId` function already present in the file.
      - The `attachSesssionId` function needs to be updated to just pull the sessionId out of the store and return it. Otherwise we can potentially remove this function and just add sessionId directly within the `search` function itself in the `utils.ts` file.

- 2019-04-16
  - Need to update the version of `api-javascript` being pulled into the StoreFront project.
