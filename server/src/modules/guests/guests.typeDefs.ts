import { gql } from 'graphql-tag';

export const guestsTypeDefs = gql`
    type Guest {
        name: String!,
        side: String!
    }

    type Guests {
        projectId: String!,
        items: [Guest!]
    }

    type Mutation {
    }

    type Query {
        getGuests(projectId: String!): Guests!
    }
`;