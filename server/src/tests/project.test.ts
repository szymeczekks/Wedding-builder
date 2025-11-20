import { Project } from "../modules/project/project.model";
import { projectResolvers } from "../modules/project/project.resolvers";

jest.mock('../modules/project/project.model');

const mockProject = {
	_id: "123",
	sessionId: "test",
	name: "Bez tytułu",
};

describe('Project', () => {
    beforeEach(() => {
		jest.clearAllMocks();
	});

    describe('Project: create', () => {
        it('should create new project', async () => {
            (Project.create as jest.Mock).mockResolvedValue(mockProject);

            const result = await projectResolvers.Mutation.createProject(null, null, { user: { id: "", email: "", role: ""}, sessionId: "test"});
            
            expect(result).toEqual(mockProject);
            expect(Project.create).toHaveBeenCalledTimes(1);
        });

        it('should throw error when not authenticated', async () => {
            await expect(
                projectResolvers.Mutation.createProject(
                    null,
                    { name: "" },
                    {}
                )
            ).rejects.toMatchObject({
                extensions: { code: "UNAUTHENTICATED" }
            });
        });
    });

    describe('Project: get', () => {
        it('should return all projects created by logged in user', async () => {
            (Project.find as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue([mockProject]),
            });

            const result = await projectResolvers.Query.getProjects(null, null, { user: { id: "68c69c4344abb13b45078a69", email: "", role: ""}});

            expect(result).toEqual([mockProject]);
            expect(Project.find).toHaveBeenCalledTimes(1);
        });

        it('should return all projects created by not logged in user', async () => {
            (Project.find as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue([mockProject]),
            });

            const result = await projectResolvers.Query.getProjects(null, null, { user: { id: "", email: "", role: ""}, sessionId: "test"});

            expect(result).toEqual([mockProject]);
            expect(Project.find).toHaveBeenCalledTimes(1);
        });

        it('should throw error when not authenticated', async () => {
            await expect(
                projectResolvers.Query.getProjects(null, null, { user: { id: "", email: "", role: ""}})
            ).rejects.toMatchObject({
                extensions: { code: "UNAUTHENTICATED" }
            });
        });
    });
});