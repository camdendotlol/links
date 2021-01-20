# Links

This web app originated as a tutorial program from [Full Stack Open](https://fullstackopen.com/en/), but through the course of the exercises and after I have made many of my own modifications.

The most significant feature I added that was not in the course is the server-side like functionality. When the user likes a link, it's added to a ``likes`` property in the database and the user is added to a `liked_by` property on the link, similar to the functionality that attaches user IDs to the links they post.

Looking back at it now, the implementation of the like system is really not up to par and I plan to rewrite it at some point.

I also added support for an invite key so I could allow user registration from the frontend without the threat of spam. The invite key is set via an ``INVITE_KEY`` environment variable in the backend.

## Known issues

The like functionality still behaves strangely when you click the like button many times in quick succession. As mentioned above, the whole implementation is deeply flawed and I will rewrite it at some point.