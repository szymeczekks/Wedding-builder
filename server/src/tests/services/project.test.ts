import { Guests } from '../../modules/guests/guests.model';
import { Project } from '../../modules/project/project.model';
import { projectResolvers } from '../../modules/project/project.resolvers';

const mockProject = {
	_id: '68c69c4344abb13b45078a60',
	sessionId: 'test',
	name: 'Bez tytułu',
};

const mockProjectSummary = {
	_id: '68c69c4344abb13b45078a60',
	sessionId: 'test',
	name: 'Bez tytułu',
	groomName: 'Szymon Mińko',
	brideName: 'Zuzanna Kujawska'
};

const mockGuests = {
	_id: '68c69c4344abb13b45078a61',
	projectId: '68c69c4344abb13b45078a60',
	items: [
		{
			name: 'Zuzanna Kujawska',
			type: 'bride',
			side: 'bride'
		},
		{
			name: 'Szymon Mińko',
			type: 'groom',
			side: 'groom'
		}
	]
};

describe('Project', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Project: create', () => {
		it('should create new project', async () => {
			(Project.create as jest.Mock).mockResolvedValue(mockProject);
			(Guests.create as jest.Mock).mockResolvedValue(mockGuests);

			const result = await projectResolvers.Mutation.createProject(null, null, { user: { id: '', email: '', role: '' }, sessionId: 'test' });

			expect(result).toEqual(mockProject);
			expect(Project.create).toHaveBeenCalledTimes(1);
		});
	});

	describe('Projects: get', () => {
		it('should return all projects created by logged in user', async () => {
			(Project.find as jest.Mock).mockReturnValue({
				lean: jest.fn().mockResolvedValue([mockProject]),
			});

			const result = await projectResolvers.Query.getProjects(null, null, { user: { id: '68c69c4344abb13b45078a69', email: '', role: '' } });

			expect(result).toEqual([mockProject]);
			expect(Project.find).toHaveBeenCalledTimes(1);
		});

		it('should return all projects created by not logged in user', async () => {
			(Project.find as jest.Mock).mockReturnValue({
				lean: jest.fn().mockResolvedValue([mockProject]),
			});

			const result = await projectResolvers.Query.getProjects(null, null, { user: { id: '', email: '', role: '' }, sessionId: 'test' });

			expect(result).toEqual([mockProject]);
			expect(Project.find).toHaveBeenCalledTimes(1);
		});
	});

	describe('Project: get', () => {
		it('should throw error if id is not found', async () => {
            await expect(projectResolvers.Query.getProject(null, {id: ''}, { user: { id: '68c69c4344abb13b45078a69', email: '', role: '' } })).rejects.toMatchObject({
				extensions: { code: 'BAD_USER_INPUT' },
			});
        });

		it('should return null if project not found', async () => {
            (Project.findOne as jest.Mock).mockReturnValue({
				lean: jest.fn().mockResolvedValue(null),
			});

			const result = await projectResolvers.Query.getProject(null, {id: '68c69c4344abb13b45078a60'}, { user: { id: '', email: '', role: '' }, sessionId: 'test' });

			expect(result).toEqual(null);
			expect(Project.findOne).toHaveBeenCalledTimes(1);
        });

		it('should return project data', async () => {
            (Project.findOne as jest.Mock).mockReturnValue({
				lean: jest.fn().mockResolvedValue(mockProjectSummary),
			});
            (Guests.findOne as jest.Mock).mockReturnValue({
				lean: jest.fn().mockResolvedValue(mockGuests),
			});

			const result = await projectResolvers.Query.getProject(null, {id: '68c69c4344abb13b45078a60'}, { user: { id: '', email: '', role: '' }, sessionId: 'test' });

			expect(result).toEqual(mockProjectSummary);
			expect(Project.findOne).toHaveBeenCalledTimes(1);
        });
	});
});
