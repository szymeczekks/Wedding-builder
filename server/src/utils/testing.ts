import { ApolloServer } from '@apollo/server';

export const execQuery = async (server: ApolloServer, query: string) => {
	const res = await server.executeOperation({ query: query });
	if (res.body.kind !== 'single') throw new Error('Unexpected response kind');
	const result = res.body.singleResult;
	expect(result.data).toBeDefined();
	return result.data as Record<string, any>;
};

export const execQueryError = async (server: ApolloServer, query: string, errorCode: string = '') => {
	const res = await server.executeOperation({ query: query });
	if (res.body.kind !== 'single') throw new Error('Unexpected response kind');
	const result = res.body.singleResult;
	expect(result.errors).toBeDefined();
	if (!result.errors || result.errors.length < 1) throw new Error('Unexpected response');
	console.log(result.errors[0]);
	if (result.errors[0].extensions) {
		expect(result.errors[0].extensions.code).toContain(errorCode);
	}
};



// export const execMutation = async(server: ApolloServer, mutation: string) => {
// 	const res = await server.executeOperation({ mutation: mutation });
// }