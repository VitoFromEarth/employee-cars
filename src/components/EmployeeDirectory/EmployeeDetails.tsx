import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { supabase } from "@/lib/supabase";
import { Project, Skill } from "./types";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployeeData();
  }, [id]);

  const fetchEmployeeData = async () => {
    try {
      const { data: employeeData, error } = await supabase.rpc(
        "get_single_employee_data",
        { employee_id: parseInt(id || "0") },
      );

      if (error) throw error;
      if (!employeeData || employeeData.length === 0)
        throw new Error("Employee not found");

      const employee = employeeData[0];

      setEmployee({
        name: employee.employee_name,
        title: employee.title || "Employee",
        image_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.employee_name}`,
      });

      setSkills(
        employee.technology_details.map((tech: any) => ({
          name: tech.technology_name,
          category: tech.specialty_name?.toLowerCase() || "frontend",
          proficiency: tech.skill_level,
        })),
      );

      // Note: Projects are not included in the current function
      setProjects([]);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const radarData = {
    labels: skills.map((s) => s.name),
    datasets: [
      {
        label: "Skill Proficiency",
        data: skills.map((s) => s.proficiency),
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={
                    employee.image_url ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.name}`
                  }
                />
                <AvatarFallback>
                  {employee.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">{employee.name}</h1>
                <p className="text-xl text-gray-600">{employee.title}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skills & Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill.name} - Level {skill.proficiency}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="h-[300px]">
                <Radar
                  data={radarData}
                  options={{ maintainAspectRatio: false }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                  <Card key={project.id}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg">{project.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {project.role}
                      </p>
                      <p className="text-sm mb-2">{project.description}</p>
                      <div className="text-sm text-gray-500">
                        {new Date(project.startDate).toLocaleDateString()} -
                        {project.endDate
                          ? new Date(project.endDate).toLocaleDateString()
                          : "Present"}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
