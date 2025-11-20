import { gql } from 'graphql-tag';

export const projectTypeDefs = gql`
    type Project {
        _id: ID!
        name: String!
        creator: String!
        sessionId: String!
        config: JSON!
    }

    type Mutation {
        createProject: Project!
    }

    type Query {
        getProjects: [Project!]!
    }

    scalar JSON
`;