const jwt = require("jsonwebtoken");

const secret = "mysecretsshhhhh";
const expiration = "2h";

module.exports = {
  authMiddleware: function ({ req }) {
    let token = req.headers.authorization || req.body.token || req.query.token;

    if (token) {
      token = token.replace("Bearer ", ""); // Remove 'Bearer ' from the token
      try {
        const decodedToken = jwt.verify(token, secret);
        req.user = decodedToken.data;
      } catch (error) {
        console.log("Invalid token:", error.message);
      }
    }

    return req;
  },

  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
