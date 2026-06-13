export interface ProjectUpdateRequest {
  name: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface ProjectResponse {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  description?: string;
}
