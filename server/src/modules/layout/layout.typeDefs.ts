import { gql } from 'graphql-tag';

export const layoutTypeDefs = gql`
    scalar JSON
    type Layout {
        name: String!
        components: [LayoutComponent]!
    }

    type LayoutComponent {
        type: String!
        props: JSON!
        position: Int!
    }

    input ComponentInput {
        type: String!
        props: JSON!
        position: Int!
    }

    type Mutation {
        createLayout(name: String!): Layout!
        updateLayout(id: ID!, updateLayout: [ComponentInput!]!): Layout!
    }
`;