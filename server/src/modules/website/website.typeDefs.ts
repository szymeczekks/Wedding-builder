import { gql } from 'graphql-tag';

export const websiteTypeDefs = gql`
    type Website {
        _id: ID!
        name: String!
        creator: String!
        config: JSON!
    }

    type Mutation {
        createWebsite(name: String!): Website!
    }

    type Query {
        getWebsites: [Website!]!
    }

    scalar JSON
`;