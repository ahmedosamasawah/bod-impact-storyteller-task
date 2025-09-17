const MOCK_API_BASE_URL = "https://68c6e0bf442c663bd028347b.mockapi.io/api/v1";

export interface MockProject {
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

export interface MockTeamMember {
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

async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${MOCK_API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error(`MockAPI request failed: ${endpoint}`, error);
    throw error;
  }
}

export const mockApi = {
  async getProjects(): Promise<MockProject[]> {
    return apiRequest<MockProject[]>("/projects");
  },

  async getProject(id: string): Promise<MockProject> {
    return apiRequest<MockProject>(`/projects/${id}`);
  },

  async createProject(
    project: Omit<MockProject, "id" | "createdAt" | "updatedAt">
  ): Promise<MockProject> {
    return apiRequest<MockProject>("/projects", {
      method: "POST",
      body: JSON.stringify(project),
    });
  },

  async updateProject(
    id: string,
    project: Partial<MockProject>
  ): Promise<MockProject> {
    return apiRequest<MockProject>(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(project),
    });
  },

  async deleteProject(id: string): Promise<void> {
    await apiRequest<void>(`/projects/${id}`, {
      method: "DELETE",
    });
  },

  async getTeamMembers(): Promise<MockTeamMember[]> {
    return apiRequest<MockTeamMember[]>("/team-members");
  },

  async getTeamMember(id: string): Promise<MockTeamMember> {
    return apiRequest<MockTeamMember>(`/team-members/${id}`);
  },

  async createTeamMember(
    member: Omit<MockTeamMember, "id" | "createdAt" | "updatedAt">
  ): Promise<MockTeamMember> {
    return apiRequest<MockTeamMember>("/team-members", {
      method: "POST",
      body: JSON.stringify(member),
    });
  },

  async updateTeamMember(
    id: string,
    member: Partial<MockTeamMember>
  ): Promise<MockTeamMember> {
    return apiRequest<MockTeamMember>(`/team-members/${id}`, {
      method: "PUT",
      body: JSON.stringify(member),
    });
  },

  async deleteTeamMember(id: string): Promise<void> {
    await apiRequest<void>(`/team-members/${id}`, {
      method: "DELETE",
    });
  },
};

export const mockApiConfig = {
  baseUrl: MOCK_API_BASE_URL,
  setupInstructions: {
    currentUrl: MOCK_API_BASE_URL,
    isConfigured:
      MOCK_API_BASE_URL.includes("mockapi.io") &&
      !MOCK_API_BASE_URL.includes("1234"),
  },
};
