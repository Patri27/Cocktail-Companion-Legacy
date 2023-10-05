# Cocktail Companion Ver 2.0

## Introduction

Based on Eduard's Solo Project, we have decided to make changes to the application:

- Refractor everything to Typescript()
- Changed some naming convention
- Protect the paths with credentials
- Make the authentication
- Routing at front end, makes it smooth going from this path to another path
- Fix the UI to make it user-friendly
- New Features: We make the sorting by ingredients and cocktails(if you know the name)

### Improvements we made

### Back End

- Refractor server to Typescript: It first started really smoothly with the backend.
- We added new routes to router.ts .
- We also protect those paths with `corsConfig` which sets `credentials` to `true`.
- Inside `middleware/auth.ts` we defines a function `authMiddleware()` which is exported and serves as middleware for protecting routes that require authentication.
- Inside of `controller.ts` we define the asynchronous functions which will work for each of the path (most of them are protected and only one is not because we want it to be accessible even we are not logging in). With all the protected path we used bcrypt to hash the password and also jwt to give the user a token which will expire in 1h. We also handle the errors here
- The `models/user.ts` and `db.ts` we kept them as it is.
- We wrote somes tests also for the backend to see if the paths working correctly.


### Front End

- Refractor client to Typescript: Coming to the frontend we have new issues coming: we have to create the whole folders with interfaces and props for kind of each component we were working with. Because Typescript is really strict about types so yeh it made us sometimes struggled a while.
- Split the App to many Components to make everything does the specific job it needs to. Inside of `App.tsx` we wrap the whole jsx inside of the `<AuthProvider>` which is the context ( we declare it inside of the `context/authContext.tsx`) and then inside we wrap them in `BrowserRouter` from react-router-dom to make the routing.
- Inside the `apiComs/cocktailDbApi.ts` we refractored the code to make them cleaner and shorter. Also all the helper functions go to `helpers.ts` which help us easy to change things from time to time if needed. Seperate of concerns XD. Next to this file you can find some tests we made to make sure that everything we get back from the API is correct.
- In `apiComs/myApi.ts` ypu can find the functions which help us connect the server side to the client side for example like if user login with their username and password and they are both correct we give then the token which helps them to be kept logged in or add/remove the favourite drinks from the user favourites and so on. Of course we also try to handle error in all of the functions with try/catch.
- Inside of the components folder we have all of the components which each of these has their own misson:
    - C

- Instead of having only one `App.css` we seperated them into styling each components. And gather them all at the end inside of `App.css`.
- We have a `types` folder for showing the logo properly( before it always said that it couldn't find the image )
- And follows all the libs we use we have some config file for them.
- Before the presentation we made the validator for the username input at login and register. We used 
- 
## What we learned from this project?

- We got to get our hands dirty when working with Typescript and create a love-hate relationship with it. But at the end all the complaints were there to help us not making errors.
