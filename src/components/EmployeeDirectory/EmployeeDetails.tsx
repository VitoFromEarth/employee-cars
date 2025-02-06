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
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../ui/tooltip";
import { Info as InfoIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
);

interface Skill {
  technology_id: number;
  technology_name: string;
  specialty_name: string;
  years_of_experience: number;
  skill_level: number;
}

interface CategoryOfImprovement {
  category_id: number;
  category_name: string;
  category_description: string;
  points: number;
}

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState<any>(null);

  const [skills, setSkills] = useState<Skill[]>([]);
  const [improvements, setImprovements] = useState<CategoryOfImprovement[]>([]);
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

      setSkills(employee.technology_details);
      setImprovements(employee.category_of_improvements);
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

  // Group skills by specialty
  const specialtyGroups = skills.reduce(
    (acc, skill) => {
      const specialty = skill.specialty_name || "Other";
      if (!acc[specialty]) {
        acc[specialty] = [];
      }
      acc[specialty].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>,
  );

  const specialtyColors: Record<string, { main: string; background: string }> =
    {
      Frontend: {
        main: "rgba(99, 102, 241, 1)",
        background: "rgba(99, 102, 241, 0.2)",
      },
      Backend: {
        main: "rgba(16, 185, 129, 1)",
        background: "rgba(16, 185, 129, 0.2)",
      },
      DevOps: {
        main: "rgba(245, 158, 11, 1)",
        background: "rgba(245, 158, 11, 0.2)",
      },
      Mobile: {
        main: "rgba(236, 72, 153, 1)",
        background: "rgba(236, 72, 153, 0.2)",
      },
      Other: {
        main: "rgba(107, 114, 128, 1)",
        background: "rgba(107, 114, 128, 0.2)",
      },
    };

  const radarData = {
    labels: allTechnologies.map((tech) => tech.name),
    datasets: Object.entries(specialtyGroups).map(([specialty, skills]) => ({
      label: specialty,
      data: allTechnologies.map((tech) => {
        const skill = skills.find(
          (s) => s.technology_name.toLowerCase() === tech.name.toLowerCase(),
        );
        return skill ? skill.skill_level : 0;
      }),
      backgroundColor:
        specialtyColors[specialty]?.background ||
        specialtyColors["Other"].background,
      borderColor:
        specialtyColors[specialty]?.main || specialtyColors["Other"].main,
      borderWidth: 2,
      pointBackgroundColor:
        specialtyColors[specialty]?.main || specialtyColors["Other"].main,
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor:
        specialtyColors[specialty]?.main || specialtyColors["Other"].main,
      pointRadius: 4,
    })),
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
              (s) =>
                s.technology_name.toLowerCase() === tech.name.toLowerCase(),
            );
            const level = skill ? skill.skill_level : 0;
            return `${label} (${level})`;
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
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

        <Card>
          <CardHeader>
            <CardTitle>Skills & Expertise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Tabs defaultValue="radar" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="radar">Radar</TabsTrigger>
                    <TabsTrigger value="polar">Polar Area</TabsTrigger>
                  </TabsList>
                  <TabsContent value="radar" className="h-[400px]">
                    <Radar data={radarData} options={radarOptions} />
                  </TabsContent>
                  <TabsContent value="polar" className="h-[400px]">
                    <PolarArea
                      data={{
                        labels: Object.keys(specialtyGroups),
                        datasets: [
                          {
                            data: Object.entries(specialtyGroups).map(
                              ([specialty, skills]) =>
                                skills.reduce(
                                  (sum, skill) => sum + skill.skill_level,
                                  0,
                                ) / skills.length,
                            ),
                            backgroundColor: Object.keys(specialtyGroups).map(
                              (specialty) =>
                                specialtyColors[specialty]?.background ||
                                specialtyColors["Other"].background,
                            ),
                            borderColor: Object.keys(specialtyGroups).map(
                              (specialty) =>
                                specialtyColors[specialty]?.main ||
                                specialtyColors["Other"].main,
                            ),
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
                                const skills = specialtyGroups[label] || [];
                                const avg =
                                  skills.reduce(
                                    (sum, skill) => sum + skill.skill_level,
                                    0,
                                  ) / skills.length;
                                return `${label} (${avg.toFixed(1)})`;
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
              </div>

              <div className="space-y-4">
                {Object.entries(specialtyGroups).map(([specialty, skills]) => (
                  <div key={specialty} className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground">
                      {specialty}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          style={{
                            backgroundColor:
                              specialtyColors[specialty]?.background ||
                              specialtyColors["Other"].background,
                            color:
                              specialtyColors[specialty]?.main ||
                              specialtyColors["Other"].main,
                            borderColor:
                              specialtyColors[specialty]?.main ||
                              specialtyColors["Other"].main,
                          }}
                        >
                          {skill.technology_name} - Level {skill.skill_level}
                          {skill.years_of_experience > 0 &&
                            ` (${skill.years_of_experience}y exp)`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
                {improvements.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                      Areas for Improvement
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {improvements.map((improvement, index) => (
                        <TooltipProvider key={index}>
                          <UITooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="outline"
                                className="border-dashed cursor-help"
                              >
                                {improvement.category_name} (
                                {improvement.points} points)
                                <InfoIcon className="w-4 h-4 ml-1" />
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{improvement.category_description}</p>
                            </TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDetails;
