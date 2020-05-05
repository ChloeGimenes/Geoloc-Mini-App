const { AuthicationError} = require('apollo-server')

const user = {
    _id: "1",
    name: "Chloe",
    email: "chloegimenes@gmail.com",
    picture: "https://cloudinary.com/asdf"
}

const authenticated = next => (root, args, ctx, info) => {
    if (!ctx.currentUser) {
        throw new AuthicationError('You must be logged in')
    }
    return next(root, args, ctx, info)
}

module.exports = {

    Query: {

        me: authenticated((root, args, ctx) => ctx.currentUser)
    }
}