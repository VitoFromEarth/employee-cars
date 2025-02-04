import React, { useState, useEffect } from "react";
import SearchBar from "./EmployeeDirectory/SearchBar";
import EmployeeGrid from "./EmployeeDirectory/EmployeeGrid";
import { supabase } from "@/lib/supabase";

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

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data: employeesData, error } = await supabase.rpc(
        "get_employee_data",
        { manager_id: null },
      );

      if (error) throw error;

      const formattedEmployees = employeesData.map((employee) => ({
        id: employee.employee_id.toString(),
        name: employee.employee_name,
        title: employee.title || "Employee",
        imageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.employee_name}`,
        skills: employee.technology_details.map((tech: any) => ({
          name: tech.technology_name,
          category:
            (tech.specialty_name?.toLowerCase() as
              | "frontend"
              | "backend"
              | "design"
              | "devops") || "frontend",
        })),
      }));

      setEmployees(formattedEmployees);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const handleEmployeeClick = (employeeId: string) => {
    window.location.href = `/employee/${employeeId}`;
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSkills =
      selectedSkills.length === 0 ||
      employee.skills.some((skill) =>
        selectedSkills.includes(skill.name.toLowerCase()),
      );

    return matchesSearch && matchesSkills;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchBar
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        selectedSkills={selectedSkills}
      />
      <EmployeeGrid
        employees={filteredEmployees}
        onEmployeeClick={handleEmployeeClick}
      />
    </div>
  );
};

export default Home;
