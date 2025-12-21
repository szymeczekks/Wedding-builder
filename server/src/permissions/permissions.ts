import { shield, and, or } from 'graphql-shield';
import { isAuthenticated } from './rules';

export const permissions = shield(
	{
		Mutation: {
			createProject: isAuthenticated,
		},
	},
	{
		allowExternalErrors: true,
		fallbackError: new Error('UNAUTHENTICATED'),
	}
);
