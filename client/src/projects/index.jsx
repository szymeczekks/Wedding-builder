import { useQuery } from "@apollo/client/react";
import { PROJECTS_QUERY } from "./graphql/project";
import { Project } from "./components/project";
import { NewProject } from "./components/newProject";
import { Header } from "../components/ui/Header";

export function Projects() {
    const { data, loading, error } = useQuery(PROJECTS_QUERY);
    
    if (loading) return <div>Loading pages...</div>;
    if (error) return <div>Error while fetching pages...</div>;

    return <div>
        <Header>Moje projekty</Header>
        <hr className="mb-5"/>
        <NewProject/>
        {data.getProjects.map(project => <Project name={project.name} />)}
    </div>
}