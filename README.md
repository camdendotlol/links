# Links

**Update (August 19, 2021):** This app is being taken offline and the repo is being archived. It is my earliest major web development project and as such, it doesn't do a good job of represent my current skills. The project that replaced its spot in my portfolio is [Chromapoll](https://github.com/mythmakerseven/chromapoll).

This web app originated as a tutorial program from [Full Stack Open](https://fullstackopen.com/en/), but through the course of the exercises and after I have made many of my own modifications.

The most significant feature I added that was not in the course is the server-side like functionality. When the user likes a link, it's added to a ``likes`` property in the database and the user is added to a `liked_by` property on the link, similar to the functionality that attaches user IDs to the links they post.

Looking back at it now, the implementation of the like system is really not up to par and I plan to rewrite it at some point.

I also added support for an invite key so I could allow user registration from the frontend without the threat of spam. The invite key is set via an ``INVITE_KEY`` environment variable in the backend.

## Known issues

The like functionality still behaves strangely when you click the like button many times in quick succession. As mentioned above, the whole implementation is deeply flawed and I will rewrite it at some point.

The frontend's error handling in forms is rather primitive. It manually checks if the server's response includes the text of a known error, and displays a corresponding notification. If serverside errors are changed, the frontend must be updated to account for them. My successor project, [Groupread](https://github.com/mythmakerseven/groupread), actually displays the error message directly from the server. Since Links is really just a portfolio project that won't change much in the future, I don't plan to spend time porting the Groupread implementation back to it.
