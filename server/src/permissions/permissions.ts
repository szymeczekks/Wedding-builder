import { shield, and, or } from 'graphql-shield';
import { isAuthenticated } from './rules';

export const permissions = shield({
    Query: {

    },
    Mutation: {
        createProject: isAuthenticated
    }
});