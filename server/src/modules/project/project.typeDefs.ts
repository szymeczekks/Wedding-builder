import { gql } from 'graphql-tag';

export const projectTypeDefs = gql`
    type Project {
        _id: ID!
        name: String!
        creator: String!
        sessionId: String!
        config: JSON!
        ceremony: JSON!
        reception: JSON!
        newlyweds: [Guest!]
    }
    
    type ProjectSummary {
        _id: ID!
        name: String!
        creator: String!
        sessionId: String!
        config: JSON!
        newlyweds: [Guest!]
    }

    type ProjectCeremony {
        _id: ID!
        date: DateTime
        location: JSON
        description: String
    }

    input UpdateCeremonyInput {
        date: String
        location: JSON
        description: String
    }

    type ProjectReception {
        _id: ID!
        date: DateTime
        location: JSON
        description: String
    }

    input UpdateReceptionInput {
        date: String
        location: JSON
        description: String
    }

    type Mutation {
        createProject: Project!
        updateCeremony(projectId: String!, input: UpdateCeremonyInput!): ProjectCeremony!
        updateReception(projectId: String!, input: UpdateReceptionInput!): ProjectReception!
    }

    type Query {
        getProjects: [Project!]!
        getProject(id: String!): Project!
        getProjectSummary(id: String!): ProjectSummary!
    }

    scalar JSON
    scalar DateTime
`;