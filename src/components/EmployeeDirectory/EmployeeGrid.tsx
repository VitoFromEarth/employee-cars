import React, { useState } from "react";
import EmployeeCard from "./EmployeeCard";

interface Skill {
  name: string;
  category: "frontend" | "backend" | "design" | "devops";
}

interface Employee {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  skills: Skill[];
}

interface EmployeeGridProps {
  employees?: Employee[];
  onEmployeeClick?: (employeeId: string) => void;
}

const EmployeeGrid = ({
  employees = [
    {
      id: "1",
      name: "Alice Johnson",
      title: "Senior Frontend Developer",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
      skills: [
        { name: "React", category: "frontend" },
        { name: "TypeScript", category: "frontend" },
        { name: "UI/UX", category: "design" },
      ],
    },
    {
      id: "2",
      name: "Bob Smith",
      title: "Backend Engineer",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
      skills: [
        { name: "Node.js", category: "backend" },
        { name: "Python", category: "backend" },
        { name: "DevOps", category: "devops" },
      ],
    },
    {
      id: "3",
      name: "Carol Williams",
      title: "Full Stack Developer",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol",
      skills: [
        { name: "Vue.js", category: "frontend" },
        { name: "Java", category: "backend" },
        { name: "AWS", category: "devops" },
      ],
    },
  ],
  onEmployeeClick = () => {},
}: EmployeeGridProps) => {
  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {employees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            name={employee.name}
            title={employee.title}
            imageUrl={employee.imageUrl}
            skills={employee.skills}
            onClick={() => onEmployeeClick(employee.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default EmployeeGrid;
