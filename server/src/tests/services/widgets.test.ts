import { ApolloServer } from '@apollo/server';
import { typeDefs, resolvers } from '../../schema';
import { Widget } from '../../modules/widgets/widgets.model';
import { execQuery } from '../../utils/testing';

const mockWidget = {
	_id: '507f1f77bcf86cd799439011',
	name: 'Odliczanie do ślubu',
	type: 'countdown',
	category: 'essential',
	icon: 'clock',
	description: 'Widget odliczający dni do ślubu',
	fields: [
		{
			name: 'weddingDate',
			label: 'Data ślubu',
			type: 'datetime',
			required: true,
			default: null,
			options: null,
			placeholder: null,
		},
		{
			name: 'title',
			label: 'Tytuł',
			type: 'text',
			default: 'Do naszego ślubu pozostało',
			placeholder: 'Wpisz tytuł...',
			required: false,
			options: null,
		},
		{
			name: 'backgroundColor',
			label: 'Kolor tła',
			type: 'color',
			default: '#ffffff',
			required: false,
			options: null,
			placeholder: null,
		},
		{
			name: 'textColor',
			label: 'Kolor tekstu',
			type: 'color',
			default: '#333333',
			required: false,
			options: null,
			placeholder: null,
		},
		{
			name: 'backgroundImage',
			label: 'Zdjęcie w tle',
			type: 'image',
			default: null,
			required: false,
			options: null,
			placeholder: null,
		},
	],
	defaultConfig: {
		weddingDate: null,
		title: 'Do naszego ślubu pozostało',
		backgroundColor: '#ffffff',
		textColor: '#333333',
		backgroundImage: null,
	},
	maxInstances: 1,
	isPremium: false,
	createdAt: new Date('2024-01-01'),
	updatedAt: new Date('2024-01-01'),
};

describe('Widgets', () => {
	let server: ApolloServer;

	beforeAll(() => {
		server = new ApolloServer({
			typeDefs,
			resolvers,
		});
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Widgets: widgetSchemas', () => {
		it('returns all existing widgets', async () => {
			(Widget.find as jest.Mock).mockReturnValue({
				lean: jest.fn().mockResolvedValue([mockWidget]),
			});
			const query = `
				query widgetSchemas {
					widgetSchemas {
						_id
						name
						type
						category
						icon
						description
						fields {
							name
							label
							type
							options {
								label
								value
							}
							default
							placeholder
							required
						}
						defaultConfig
						maxInstances
						isPremium
						createdAt
						updatedAt
					}
				}
			`;
	
			const data = await execQuery( server, query );
			expect(data.widgetSchemas).toEqual([mockWidget]);
			expect(Widget.find).toHaveBeenCalledTimes(1);
		});

		it('returns empty array when no widgets exist', async () => {
			(Widget.find as jest.Mock).mockReturnValue({
				lean: jest.fn().mockResolvedValue([]),
			});

			const query = `
				query GetWidgetSchemas {
					widgetSchemas {
						_id
						name
						type
					}
				}
			`;

			const data = await execQuery(server, query);
			expect(data.widgetSchemas).toEqual([]);
		});
	});

	describe('Widgets: widgetSchema', () => {
		it('return specific widget by type', async () => {
			(Widget.find as jest.Mock).mockReturnValue({
				lean: jest.fn().mockResolvedValue(mockWidget),
			});
			const query = `
				query {
					widgetSchema(type: "countdown") {
						_id
						name
						type
						category
						icon
						description
						fields {
							name
							label
							type
							options {
								label
								value
							}
							default
							placeholder
							required
						}
						defaultConfig
						maxInstances
						isPremium
						createdAt
						updatedAt
					}
				}
			`;
	
			const data = await execQuery( server, query );
			expect(data.widgetSchema).toEqual(mockWidget);
			expect(Widget.find).toHaveBeenCalledTimes(1);
		});
	});
});
