import { ApolloServer } from '@apollo/server';
import { typeDefs, resolvers } from "../schema";
import { Component } from "../modules/components/components.model";

jest.mock('../modules/components/components.model');


const execQuery = async (server: ApolloServer, query: string, userId: string) => {
    const res = await server.executeOperation(
        { query: query },
        { contextValue: { userId: userId} }
    );
    if (res.body.kind !== 'single') throw new Error('Unexpected response kind');
    const result = res.body.singleResult;
    expect(result.data).toBeDefined();
    return result.data as Record<string, any>;
}

describe("Components", () => {
    let server: ApolloServer;

    beforeAll(() => {
        server = new ApolloServer({
            typeDefs,
            resolvers
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("creates a new component for the authenticated user", async () => {
        (Component.create as jest.Mock).mockResolvedValue({
            name: "Hero Image",
            props: ["src", "text"]
        });
        
        const data = await execQuery(server, 'mutation { createComponent(name: "Hero Image", props: ["src", "text"]) { name, props } }', '68c69c4344abb13b45078a69');

        expect(data.createComponent).toEqual({
            name: "Hero Image",
            props: ["src", "text"]
        });

        expect(Component.create).toHaveBeenCalledWith({
            name: 'Hero Image',
            props: ['src', 'text'],
            userId: '68c69c4344abb13b45078a69'
        });
    });

    it('returns all components for authenticated user', async () => {
        (Component.find as jest.Mock).mockResolvedValue([{
            name: "Hero Image",
            props: ["src", "text"],
            userId: '68c69c4344abb13b45078a69'
        }]);

        const data = await execQuery(server, 'query { getComponents { name, props } }', '68c69c4344abb13b45078a69');

        expect(data.getComponents).toEqual([
            {
                name: "Hero Image",
                props: ["src", "text"]
            }
        ]);
    });

    it('should throw an error if user is not authenticated', async () => {
        const res = await server.executeOperation(
            { query: 'query { getComponents { name, props } }' }
        );

        if (res.body.kind === 'single') {
            const result = res.body.singleResult;
            expect(result.errors?.[0].message).toMatch(/User not authenticated./i);
        }
    });

    it("returns all components created by the current user", async () => {
        (Component.find as jest.Mock).mockResolvedValue([{
            name: "Hero Image",
            props: ["src", "text"],
            userId: '68c69c4344abb13b45078a69'
        }]);

        const data = await execQuery(server, 'query { getComponentsByCreator { name, props } }', '68c69c4344abb13b45078a69');

        expect(data.getComponentsByCreator).toEqual([
            {
                name: "Hero Image",
                props: ["src", "text"]
            }
        ]);

        expect(Component.find).toHaveBeenCalledWith({
            userId: '68c69c4344abb13b45078a69'
        });
    });

    it("returns empty array if there is no components", async () => {
        (Component.find as jest.Mock).mockResolvedValue([]);

        const data = await execQuery(server, 'query { getComponentsByCreator { name, props } }', '68c69c4344abb13b45078a69');

        expect(data.getComponentsByCreator).toEqual([]);

        expect(Component.find).toHaveBeenCalledWith({
            userId: '68c69c4344abb13b45078a69'
        });
    });

    it('should update name succesfully', async () => {
        (Component.findById as jest.Mock).mockResolvedValue({
            _id: "000000000111111111",
            name: "Hero Image",
            props: ["src", "text"],
            userId: '68c69c4344abb13b45078a69',
            save: jest.fn().mockResolvedValue(true)
        });

        const data = await execQuery(server, 'mutation { updateComponent(input: { id: "000000000111111111", name: "Hero Image Up" } ) { id, name, props, userId } }', '68c69c4344abb13b45078a69');

        expect(data.updateComponent).toEqual({
            id: "000000000111111111",
            name: "Hero Image Up",
            props: ["src", "text"],
            userId: '68c69c4344abb13b45078a69'
        });

        expect(Component.findById).toHaveBeenCalledWith('000000000111111111');
    });

    it('should update props succesfully', async () => {
        (Component.findById as jest.Mock).mockResolvedValue({
            _id: "000000000111111111",
            name: "Hero Image",
            props: ["src", "text"],
            userId: '68c69c4344abb13b45078a69',
            save: jest.fn().mockResolvedValue(true)
        });

        const data = await execQuery(server, 'mutation { updateComponent(input: { id: "000000000111111111", props: ["src"] } ) { id, name, props, userId } }', '68c69c4344abb13b45078a69');

        expect(data.updateComponent).toEqual({
            id: "000000000111111111",
            name: "Hero Image",
            props: ["src"],
            userId: '68c69c4344abb13b45078a69'
        });

        expect(Component.findById).toHaveBeenCalledWith('000000000111111111');
    });

    it('should throw an error if name is empty string', async () => {
        (Component.findById as jest.Mock).mockResolvedValue({
            _id: "000000000111111111",
            name: "Hero Image",
            props: ["src", "text"],
            userId: '68c69c4344abb13b45078a69',
            save: jest.fn().mockResolvedValue(true)
        });

        const res = await server.executeOperation(
            { query: 'mutation { updateComponent(input: { id: "000000000111111111", name: "" } ) { id, name, props, userId } }' },
            { contextValue: { userId: '68c69c4344abb13b45078a69'} }
        );

        if (res.body.kind === 'single') {
            const result = res.body.singleResult;
            expect(result.errors?.[0].message).toMatch('Invalid name: cannot be empty.');
        }
    });
});