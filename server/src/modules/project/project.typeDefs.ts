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
        checklist: [ChecklistStage]!
        newlyweds: [Guest!]
    }

    type ChecklistStage {
        _id: ID!
        title: String!
        todos: [ChecklistTodo]!
    }

    type ChecklistTodo {
        _id: ID!
        title: String
        description: String
        done: Boolean!
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

    type DeleteTodo {
        _id: ID!
        stageId: ID!
        success: Boolean!
    }

    input UpdateReceptionInput {
        date: String
        location: JSON
        description: String
    }

    input UpdateTodoInput {
        title: String
        description: String
        done: Boolean
    }

    input UpdateStageInput {
        title: String!
    }

    input CreateTodoInput {
        title: String!
        description: String
    }

    type Mutation {
        createProject: Project!
        updateCeremony(projectId: String!, input: UpdateCeremonyInput!): ProjectCeremony!
        updateReception(projectId: String!, input: UpdateReceptionInput!): ProjectReception!
        updateTodo(projectId: String!, stageId: String!, todoId: String!, input: UpdateTodoInput!): ChecklistTodo!
        updateStage(projectId: String!, stageId: String!, input: UpdateStageInput!): ChecklistStage!
        deleteTodo(projectId: String!, stageId: String!, todoId: String!): DeleteTodo!
        deleteStage(projectId: String!, stageId: String!): Delete!
        createStage(projectId: String!, title: String!): ChecklistStage!
        createTodo(projectId: String!, stageId: String!, input: CreateTodoInput!): ChecklistTodo!
    }

    type Query {
        getProjects: [Project!]!
        getProject(id: String!): Project!
        getProjectSummary(id: String!): ProjectSummary!
    }

    scalar JSON
    scalar DateTime
`;