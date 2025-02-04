import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Search, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Technology {
  id: number;
  name: string;
  specialty: string;
}

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (skill: string) => void;
  selectedSkills?: string[];
}

const SearchBar = ({
  onSearch = () => {},
  onFilterChange = () => {},
  selectedSkills = [],
}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);

  useEffect(() => {
    const fetchTechnologies = async () => {
      const { data, error } = await supabase.rpc("get_technologies");

      if (error) {
        console.error("Error fetching technologies:", error);
        return;
      }

      // Get unique specialties and filter out null/undefined values
      const uniqueSpecialties = Array.from(
        new Set(
          data
            .map((tech: Technology) => tech.specialty?.toLowerCase())
            .filter(Boolean),
        ),
      ).sort();

      setSpecialties(uniqueSpecialties);
    };

    fetchTechnologies();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleSkillSelect = (skill: string) => {
    onFilterChange(skill);
  };

  return (
    <div className="w-full bg-white p-4 border-b">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-10"
              placeholder="Search employees by name or title..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <Select onValueChange={handleSkillSelect}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by skill" />
            </SelectTrigger>
            <SelectContent>
              {specialties.map((specialty) => (
                <SelectItem key={specialty} value={specialty}>
                  {specialty.charAt(0).toUpperCase() + specialty.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedSkills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="px-3 py-1 flex items-center gap-1"
              >
                {skill}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => onFilterChange(skill)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
