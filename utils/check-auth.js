const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { AuthenticationError } = require('apollo-server')



dotenv.config({ path: 'config.env' });
const SECRET_KEY = process.env.SECRET_KEY

module.exports = (context) => {
    const authHeader = context.req.headers.authorization
    if (authHeader) {
        //Bearer ...
        console.log(authHeader)
        const token = authHeader.split('Bearer')[1].trim()
        if (token) {
            try {
                const user = jwt.verify(token, SECRET_KEY)
                return user
            }
            catch (err) {
                throw new AuthenticationError('Invalid/Expired token')
            }
        }
        throw new Error('Authenticaton token must be \'Bearer [token]')
    }
    throw new Error('Authorization header must provided')

}