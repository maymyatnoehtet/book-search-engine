const AuthenticationError = require("apollo-server-express");
const User = require("../server/models");
const signToken = require("../server/utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("Not logged in");
      }

      try {
        const userData = await User.findById(context.user._id).select(
          "-__v -password"
        );
        return userData;
      } catch (error) {
        throw new Error("Failed to fetch user data");
      }
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          throw new AuthenticationError("Incorrect credentials");
        }

        const correctPw = await user.isCorrectPassword(password);

        if (!correctPw) {
          throw new AuthenticationError("Incorrect credentials");
        }

        const token = signToken(user);

        return { token, user };
      } catch (error) {
        throw new Error("Login failed");
      }
    },

    addUser: async (parent, args) => {
      try {
        const user = await User.create(args);
        const token = signToken(user);

        return { token, user };
      } catch (error) {
        throw new Error("Failed to create user");
      }
    },

    saveBook: async (parent, { input }, { user }) => {
      if (!user) {
        throw new AuthenticationError("You need to be logged in");
      }

      try {
        const updatedUser = await User.findByIdAndUpdate(
          user._id,
          { $addToSet: { savedBooks: input } },
          { new: true, runValidators: true }
        );

        return updatedUser;
      } catch (error) {
        throw new Error("Failed to save book");
      }
    },

    removeBook: async (parent, { bookId }, { user }) => {
      if (!user) {
        throw new AuthenticationError("You need to be logged in");
      }

      try {
        const updatedUser = await User.findByIdAndUpdate(
          user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true, runValidators: true }
        );

        return updatedUser;
      } catch (error) {
        throw new Error("Failed to remove book");
      }
    },
  },
};

module.exports = resolvers;
