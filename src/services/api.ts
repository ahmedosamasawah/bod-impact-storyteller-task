import { mockApi, mockApiConfig } from "./mockapi";

export interface Project {
  id: string;
  userId: number;
  title: string;
  body: string;
  sector?: string;
  status?: string;
  region?: string;
  budget?: number;
  duration?: string;
  impactScore?: number;
  clientName?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  website?: string;
  position?: string;
  expertise?: string[];
  experience?: number;
  certifications?: string[];
  location?: string;
  joinDate?: string;
  projectsLed?: number;
  clientRating?: number;
  address: {
    street: string;
    suite?: string;
    city: string;
    zipcode: string;
  };
  company: {
    name: string;
    catchPhrase?: string;
    bs?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export type CreateProjectPayload = Omit<
  Project,
  "id" | "createdAt" | "updatedAt"
>;
export type CreateTeamMemberPayload = Omit<
  TeamMember,
  "id" | "createdAt" | "updatedAt"
>;

export const api = {
  async getProjects(): Promise<Project[]> {
    try {
      return await mockApi.getProjects();
    } catch (error) {
      console.warn("MockAPI.io not available");
      throw new Error("Unable to fetch projects. Please configure MockAPI.io.");
    }
  },

  async getProject(id: string): Promise<Project> {
    try {
      return await mockApi.getProject(id);
    } catch (error) {
      throw new Error("Unable to fetch project. Please configure MockAPI.io.");
    }
  },

  async createProject(project: CreateProjectPayload): Promise<Project> {
    try {
      const projectData = { userId: 1, ...project };
      return await mockApi.createProject(projectData);
    } catch (error) {
      throw new Error(
        "Unable to create project. Please configure MockAPI.io for persistent data."
      );
    }
  },

  async updateProject(
    id: string,
    project: Partial<CreateProjectPayload>
  ): Promise<Project> {
    try {
      return await mockApi.updateProject(id, project);
    } catch (error) {
      throw new Error(
        "Unable to update project. Please configure MockAPI.io for persistent data."
      );
    }
  },

  async deleteProject(id: string): Promise<void> {
    try {
      await mockApi.deleteProject(id);
    } catch (error) {
      throw new Error(
        "Unable to delete project. Please configure MockAPI.io for persistent data."
      );
    }
  },

  async getTeamMembers(): Promise<TeamMember[]> {
    try {
      return await mockApi.getTeamMembers();
    } catch (error) {
      console.warn("MockAPI.io not available");
      throw new Error(
        "Unable to fetch team members. Please configure MockAPI.io."
      );
    }
  },

  async getTeamMember(id: string): Promise<TeamMember> {
    try {
      return await mockApi.getTeamMember(id);
    } catch (error) {
      throw new Error(
        "Unable to fetch team member. Please configure MockAPI.io."
      );
    }
  },

  async createTeamMember(member: CreateTeamMemberPayload): Promise<TeamMember> {
    try {
      return await mockApi.createTeamMember(member);
    } catch (error) {
      throw new Error(
        "Unable to create team member. Please configure MockAPI.io for persistent data."
      );
    }
  },

  async updateTeamMember(
    id: string,
    member: Partial<CreateTeamMemberPayload>
  ): Promise<TeamMember> {
    try {
      return await mockApi.updateTeamMember(id, member);
    } catch (error) {
      throw new Error(
        "Unable to update team member. Please configure MockAPI.io for persistent data."
      );
    }
  },

  async deleteTeamMember(id: string): Promise<void> {
    try {
      await mockApi.deleteTeamMember(id);
    } catch (error) {
      throw new Error(
        "Unable to delete team member. Please configure MockAPI.io for persistent data."
      );
    }
  },

  getMockApiConfig() {
    return mockApiConfig;
  },
};

export const mockMetrics = {
  totalImpactScore: 9.2,
  projectsCompleted: 47,
  clientsServed: 28,
  consultingHours: 3240,
  strategicPlansDelivered: 23,
  researchReportsPublished: 15,
  clientSatisfaction: 97.5,
  regionalReach: 12,
  sectorsCovered: 8,
  transformationInitiatives: 19,
  capacityBuildingPrograms: 11,
  innovationWorkshops: 34,
  expertiseAreas: 6,
};

export const mockChartData = [
  {
    month: "يناير",
    impact: 1000,
    consultingHours: 400,
    clientSatisfaction: 1800,
    projects: 9,
  },
  {
    month: "فبراير",
    impact: 400,
    consultingHours: 320,
    clientSatisfaction: 600,
    projects: 8,
  },
  {
    month: "مارس",
    impact: 900,
    consultingHours: 480,
    clientSatisfaction: 1000,
    projects: 9,
  },
  {
    month: "إبريل",
    impact: 700,
    consultingHours: 200,
    clientSatisfaction: 969,
    projects: 80,
  },
  {
    month: "مايو",
    impact: 1300,
    consultingHours: 800,
    clientSatisfaction: 2000,
    projects: 100,
  },
  {
    month: "يونيو",
    impact: 1900,
    consultingHours: 1200,
    clientSatisfaction: 1000,
    projects: 11,
  },
];
