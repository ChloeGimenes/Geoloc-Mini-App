const { ApolloServer } = require('apollo-server');
const { findOrCreateUser} = require('./controllers/UserController')
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const mongoose = require('mongoose')
require('dotenv').config()

mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(() => console.log("DB connected!"))
    .catch(err => console.error(err))

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({req}) => {
        let authToken = null;
        let currentUser = null;
        try {
            authToken = req.headers.authorization
            
            if(authToken) {
                    currentUser = await findOrCreateUser(authToken);

             }
        
        } catch (err) {
            console.error(`Unable to authenticate user with token with ${authToken}`);
            }
        return {currentUser};

    }

})

server.listen().then(({ url }) => {
    console.log(`Server listening on ${url}`)
});