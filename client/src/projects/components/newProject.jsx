import { useMutation } from '@apollo/client/react';
import { CREATE_PROJECT_QUERY, PROJECTS_QUERY } from '../graphql/project';
import { Header } from '../../components/ui/Header';

export function NewProject() {
	const [createProject] = useMutation(CREATE_PROJECT_QUERY, {
		update(cache, { data: { createProject } }) {
			const existing = cache.readQuery({ query: PROJECTS_QUERY });
			cache.writeQuery({
				query: PROJECTS_QUERY,
				data: {
					getProjects: [...existing.getProjects, createProject],
				},
			});
		},
	});

	return <button onClick={createProject} className='w-full h-full cursor-pointer p-3 md:p-5'>
        <span className='text-5xl text-(--color-special) md:text-7xl font-main-sans'>+</span>
        <Header>Stwórz nowy projekt</Header>
    </button>;
}
