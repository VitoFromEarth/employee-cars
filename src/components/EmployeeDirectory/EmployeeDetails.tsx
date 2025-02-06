import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Radar, PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { supabase } from "@/lib/supabase";
import { Project, Skill } from "./types";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
);

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [allTechnologies, setAllTechnologies] = useState<
    { id: number; name: string; specialty: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchEmployeeData(), fetchAllTechnologies()]);
    };
    fetchData();
  }, [id]);

  const fetchAllTechnologies = async () => {
    try {
      const { data, error } = await supabase.rpc("get_technologies");
      if (error) throw error;

      setAllTechnologies(
        data
          .filter((tech) => !tech.deleted)
          .map((tech) => ({
            id: tech.id,
            name: tech.name,
            specialty: tech.specialty,
          })),
      );
    } catch (error) {
      console.error("Error fetching technologies:", error);
    }
  };

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

      // Add mock projects since they're not in the database yet
      setProjects([
        {
          id: "1",
          name: "Employee Directory Revamp",
          description:
            "Led the redesign and implementation of the company-wide employee directory system",
          role: "Tech Lead",
          startDate: "2023-01-01",
          endDate: "2023-06-30",
        },
        {
          id: "2",
          name: "Client Portal Migration",
          description:
            "Migrated legacy client portal to a modern React-based architecture",
          role: "Senior Developer",
          startDate: "2022-07-01",
          endDate: "2022-12-31",
        },
        {
          id: "3",
          name: "API Gateway Implementation",
          description:
            "Designing and implementing a new API gateway for microservices architecture",
          role: "Backend Developer",
          startDate: "2023-07-01",
          endDate: null,
        },
      ]);
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
    labels: allTechnologies.map((tech) => tech.name),
    datasets: [
      {
        label: "Skill Proficiency",
        data: allTechnologies.map((tech) => {
          const skill = skills.find(
            (s) => s.name.toLowerCase() === tech.name.toLowerCase(),
          );
          return skill ? skill.proficiency : 0;
        }),
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 2,
        pointBackgroundColor: allTechnologies.map((tech) => {
          const hasSkill = skills.some(
            (s) => s.name.toLowerCase() === tech.name.toLowerCase(),
          );
          return hasSkill ? "rgba(99, 102, 241, 1)" : "rgba(203, 213, 225, 1)";
        }),
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(99, 102, 241, 1)",
        pointRadius: allTechnologies.map((tech) => {
          const hasSkill = skills.some(
            (s) => s.name.toLowerCase() === tech.name.toLowerCase(),
          );
          return hasSkill ? 4 : 2;
        }),
      },
    ],
  };

  const radarOptions = {
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 10,
        ticks: {
          display: false,
        },
        grid: {
          color: "#E5E7EB",
        },
        angleLines: {
          color: "#E5E7EB",
        },
        pointLabels: {
          color: "#374151",
          font: {
            size: 12,
            weight: "500",
          },
          callback: (label: string, index: number) => {
            const tech = allTechnologies[index];
            const skill = skills.find(
              (s) => s.name.toLowerCase() === tech.name.toLowerCase(),
            );
            const level = skill ? skill.proficiency : 0;
            return `${label} (${level})`;
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
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
              <Tabs defaultValue="radar" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="radar">Radar</TabsTrigger>
                  <TabsTrigger value="polar">Polar Area</TabsTrigger>
                </TabsList>
                <TabsContent value="radar" className="h-[300px]">
                  <Radar data={radarData} options={radarOptions} />
                </TabsContent>

                <TabsContent value="polar" className="h-[300px]">
                  <PolarArea
                    data={{
                      labels: skills.map((skill) => skill.name),
                      datasets: [
                        {
                          data: skills.map((skill) => skill.proficiency),
                          backgroundColor: [
                            "rgba(99, 102, 241, 0.7)",
                            "rgba(129, 140, 248, 0.7)",
                            "rgba(165, 180, 252, 0.7)",
                            "rgba(199, 210, 254, 0.7)",
                            "rgba(224, 231, 255, 0.7)",
                          ],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      maintainAspectRatio: false,
                      scales: {
                        r: {
                          max: 10,
                          ticks: {
                            display: false,
                          },
                          pointLabels: {
                            callback: (label: string) => {
                              const skill = skills.find(
                                (s) => s.name === label,
                              );
                              return `${label} (${skill?.proficiency})`;
                            },
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          position: "right",
                        },
                      },
                    }}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <Card
                      key={project.id}
                      className="hover:shadow-md transition-shadow duration-200"
                    >
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg text-primary">
                          {project.name}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <span className="font-medium">{project.role}</span>
                          <span className="mx-2">•</span>
                          <span>
                            {new Date(project.startDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                year: "numeric",
                              },
                            )}{" "}
                            -{" "}
                            {project.endDate
                              ? new Date(project.endDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    year: "numeric",
                                  },
                                )
                              : "Present"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {project.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No projects available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
