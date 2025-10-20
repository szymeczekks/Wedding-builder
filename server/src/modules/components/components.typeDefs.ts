import { gql } from 'graphql-tag';

export const componentsTypeDefs = gql`
    type Component {
        id: ID!
        name: String!
        props: [String!]!
        userId: ID!
    }

    input UpdateComponentInput {
        id: ID!
        name: String
        props: [String!]
    }

    type Query {
        getComponents: [Component!]!
        getComponentsByCreator: [Component!]!
    }

    type Mutation {
        createComponent(name: String!, props: [String!]!): Component!
        updateComponent(input: UpdateComponentInput!): Component!
        deleteComponent(id: String!): { id: ID! success: Boolean! }
    }
`;