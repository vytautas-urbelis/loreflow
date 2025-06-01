import {Project, ProjectInterface} from "./index.ts";


// Generic find function
export function findMovieProjectById(id: number | string, projectList: ProjectInterface[]) {
    return projectList.find(movieProject => movieProject.id.toString() === id.toString());
}


// Generic delete function
export function findAndDeleteProjectById(id: number | string, projectList: ProjectInterface[]) {
    return projectList.filter(movieProject => movieProject.id.toString() !== id.toString());
}

// Generic update function
export function findAndUpdateMovieProjectById(
    updatedProject: Project,
    projectList: ProjectInterface[]
): ProjectInterface[] {
    return projectList.map(movieProject =>
        movieProject.id.toString() === movieProject.id.toString() ? updatedProject : movieProject
    );
}