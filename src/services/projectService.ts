import type { CreateProjectInput, Project, UpdateProjectInput } from '../types/project'
import { storageService, STORAGE_KEYS } from './storageService'
import { INITIAL_PROJECTS } from './demoData'
import { generateId } from '../utils/idGenerator'
import { createProjectSchema } from '../schemas/projectSchema'

export class ProjectService {
  public getProjects(): Project[] {
    const initialized = storageService.getItem<boolean>(STORAGE_KEYS.INITIALIZED, false)
    if (!initialized) {
      storageService.setItem(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS)
      storageService.setItem(STORAGE_KEYS.INITIALIZED, true)
      return INITIAL_PROJECTS
    }
    return storageService.getItem<Project[]>(STORAGE_KEYS.PROJECTS, [])
  }

  public getProjectById(id: string): Project | undefined {
    const projects = this.getProjects()
    return projects.find((p) => p.id === id)
  }

  public createProject(input: CreateProjectInput): Project {
    // Validate with Zod
    createProjectSchema.parse(input)

    const now = new Date().toISOString()
    const newProject: Project = {
      ...input,
      id: generateId('proj'),
      createdAt: now,
      updatedAt: now,
    }

    const projects = this.getProjects()
    const updatedList = [newProject, ...projects]
    storageService.setItem(STORAGE_KEYS.PROJECTS, updatedList)
    return newProject
  }

  public updateProject(id: string, input: UpdateProjectInput): Project {
    const projects = this.getProjects()
    const existingIndex = projects.findIndex((p) => p.id === id)
    if (existingIndex === -1) {
      throw new Error(`Project with ID "${id}" was not found`)
    }

    const existing = projects[existingIndex]
    if (!existing) {
      throw new Error(`Project with ID "${id}" was not found`)
    }

    const updatedProject: Project = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    }

    // Validate the updated project fields
    createProjectSchema.parse({
      name: updatedProject.name,
      description: updatedProject.description,
      status: updatedProject.status,
      priority: updatedProject.priority,
      startDate: updatedProject.startDate,
      deadline: updatedProject.deadline,
      color: updatedProject.color,
      tags: updatedProject.tags,
    })

    projects[existingIndex] = updatedProject
    storageService.setItem(STORAGE_KEYS.PROJECTS, projects)
    return updatedProject
  }

  /**
   * Deletes a project.
   * Returns list of removed task IDs for cascade delete synchronisation.
   */
  public deleteProject(id: string): { success: boolean; deletedProjectId: string } {
    const projects = this.getProjects()
    const filtered = projects.filter((p) => p.id !== id)
    if (filtered.length === projects.length) {
      throw new Error(`Project with ID "${id}" was not found`)
    }

    storageService.setItem(STORAGE_KEYS.PROJECTS, filtered)
    return { success: true, deletedProjectId: id }
  }

  public saveAllProjects(projects: Project[]): void {
    storageService.setItem(STORAGE_KEYS.PROJECTS, projects)
  }
}

export const projectService = new ProjectService()
