import { gql } from 'graphql-tag';

export const projectTypeDefs = gql`
    type Project {
        _id: ID!
        name: String!
        creator: String!
        sessionId: String!
        config: JSON!
        groomName: String
        brideName: String
    }

    type Mutation {
        createProject: Project!
    }

    type Query {
        getProjects: [Project!]!
        getProject(id: String!): Project!
    }

    scalar JSON
`;