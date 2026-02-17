import { gql } from 'graphql-tag';

export const guestListTypeDefs = gql`
    type GuestList {
        _id: ID!
        projectId: String!
        name: String!
        type: String
        guests: [Guest!]
    }
    
    type GuestListDelete {
        _id: String!
        success: Boolean!
    }

    input UpdateGuestListInput {
        name: String
    }

    type Mutation {
        createGuestList(projectId: String!, name: String!): GuestList!
        updateGuestList(guestListId: String!, dataInput: UpdateGuestListInput): GuestList!
        deleteGuestList(guestListId: String!): GuestListDelete!
    }

    type Query {
        getGuestLists(projectId: String!): [GuestList!]!
    }
`;