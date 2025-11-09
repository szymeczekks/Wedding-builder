import { gql } from 'graphql-tag';

export const widgetsTypeDefs = gql`
	type WidgetFieldOption {
		label: String!
		value: String!
	}

	type WidgetField {
		name: String!
		label: String!
		type: String!
		options: [WidgetFieldOption!]
		default: JSON
		placeholder: String
		required: Boolean!
	}

	type WidgetSchema {
		_id: ID!
		name: String!
		type: String!
		category: String
		icon: String
		description: String
		fields: [WidgetField!]!
		defaultConfig: JSON
		maxInstances: Int
		isPremium: Boolean!
		createdAt: DateTime
		updatedAt: DateTime
	}

	type Query {
		widgetSchemas: [WidgetSchema!]!
		widgetSchema(type: String!): WidgetSchema
		widgetSchemasByCategory(category: String!): [WidgetSchema!]!
	}

	scalar JSON
	scalar DateTime
`;
