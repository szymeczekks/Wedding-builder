import { gql } from 'graphql-tag';

export const authTypeDefs = gql`
    type User {
        _id: ID!
        email: String!
        name: String!
        token: String!
    }

    type Mutation {
        register(email: String!, password: String!, name: String!): User!
    }

    type Query {
        login(email: String!, password: String!): User!
    }
`;