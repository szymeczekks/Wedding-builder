import { gql } from 'graphql-tag';

export const guestTypeDefs = gql`
    type Guest {
        _id: ID!
        name: String
        type: String!
        side: String!
        guestListId: ID!
        projectId: ID!
    }

    type Delete {
        _id: ID!
        success: Boolean!
    }

    input CreateGuestInput {
        name: String
        type: String!
        side: String
        guestListId: String!
        projectId: String!
    }

    input UpdateGuestInput {
        name: String
        type: String
        side: String
    }

    type Mutation {
        createGuest( input: CreateGuestInput ): Guest!
        updateGuest( id: ID!, updateInput: UpdateGuestInput ): Guest!
        deleteGuest( id: ID! ): Delete!
    }
`;