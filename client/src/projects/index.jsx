import { useQuery } from "@apollo/client/react";
import { PROJECTS_QUERY } from "./graphql/project";
import { Project } from "./components/project";
import { NewProject } from "./components/newProject";
import { Header } from "../components/ui/Header";
import { Link } from "react-router-dom";

export function Projects() {
    const { data, loading, error } = useQuery(PROJECTS_QUERY);
    
    if (loading) return <div>Loading pages...</div>;
    if (error) return <div>Error while fetching pages...</div>;

    return <div>
        <Header>Moje projekty</Header>
        <hr className="mb-5 text-bg-dark"/>
        <div className="flex gap-3 flex-wrap md:gap-5">
            <Project>
                <NewProject/>
            </Project>
            {data.getProjects.map(project => <Project >
                <Link to={`/project/${project._id}`}>
                    <div className="aspect-[2/1] bg-(--color-bg-dark) relative">
                        <div className="absolute w-full h-full bg-linear-to-t from-bg to-transparent"></div>
                        {project.image && <img src={project.image} alt="" />}
                    </div>
                    <div className="p-3 bg-(--color-bg) md:p-5">
                        <h2 className="font-semibold text-xl mb-2 font-header">{project.name}</h2>
                        <p className="text-sm font-main">Ostatnia aktualizacja: <span className="text-(--color-special) font-medium">05 kwietnia 2025</span></p>
                    </div>
                </Link>
            </Project>)}
        </div>
    </div>
}