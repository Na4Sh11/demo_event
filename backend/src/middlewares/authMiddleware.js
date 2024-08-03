// Import necessary modules
const { expressjwt: jwt } = require('express-jwt'); // Note the change here
const jwksRsa = require('jwks-rsa');

// Middleware for validating JWTs using Auth0
const authMiddleware = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

module.exports = authMiddleware;
