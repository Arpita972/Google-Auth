const express = require('express');
const passport = require("passport")
const session = require("express-session")
const path = require("path");
const app = express();
const port = 8000; // You can use any port you prefer
require("./auth")
app.use(express.json())
app.use(express.static(path.join(__dirname,"client")))

function isLogin(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}


// Define a route handler for the root URL
app.get('/', (req, res) => {
  // Use path.join to provide an absolute path for index.html
  const filePath = path.join(__dirname, client, 'index.html');
  res.sendFile(filePath);
});

app.use(session({
  secret: 'vfretyhu',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))
app.use(passport.initialize())
app.use(passport.session())


app.get('/auth/google',
  passport.authenticate('google', {
    scope:
      ['email', 'profile']
  }
  ));
 

app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/auth/protected',
    failureRedirect: '/auth/google/failure'
  })
);


app.get("/auth/protected", isLogin, (req, res) => {
  let name = req.user.displayName;
  res.send(`Hi ${name}`);
});

// Add a new route to redirect to Google authentication if not logged in
app.get("/auth/redirect", (req, res) => {
  res.redirect("/auth/google");
});

app.get("/auth/google/failure",(req, res) => {
  res.send("wrong")
})
app.get("/auth/logout", (req, res) => {
  req.session.destroy()
  res.send("byee")
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
