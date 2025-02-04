export type Project = {
  id: string;
  name: string;
  description: string;
  role: string;
  startDate: string;
  endDate: string | null;
};

export type Skill = {
  name: string;
  category: string;
  proficiency: number;
};
