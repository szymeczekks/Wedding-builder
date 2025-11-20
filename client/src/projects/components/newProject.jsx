import { useMutation } from '@apollo/client/react';
import { CREATE_PROJECT_QUERY, PROJECTS_QUERY } from '../graphql/project';

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

	return <button onClick={createProject}>Stwórz nowy projekt</button>;
}
