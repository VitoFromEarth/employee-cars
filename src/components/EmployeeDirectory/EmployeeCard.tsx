import React from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { motion } from "framer-motion";

interface Skill {
  name: string;
  category: "frontend" | "backend" | "design" | "devops";
}

interface EmployeeCardProps {
  name?: string;
  title?: string;
  imageUrl?: string;
  skills?: Skill[];
  onClick?: () => void;
}

const getSkillColor = (category: Skill["category"]) => {
  const colors = {
    frontend: "bg-blue-100 text-blue-800",
    backend: "bg-green-100 text-green-800",
    design: "bg-purple-100 text-purple-800",
    devops: "bg-orange-100 text-orange-800",
  };
  return colors[category];
};

const EmployeeCard = ({
  name = "John Doe",
  title = "Software Engineer",
  imageUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
  skills = [
    { name: "React", category: "frontend" },
    { name: "Node.js", category: "backend" },
    { name: "UI/UX", category: "design" },
  ],
  onClick = () => {},
}: EmployeeCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="w-full"
    >
      <Card
        className="w-full bg-white cursor-pointer hover:shadow-lg transition-shadow duration-200"
        onClick={onClick}
      >
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <HoverCard>
              <HoverCardTrigger>
                <Avatar className="w-16 h-16">
                  <AvatarImage src={imageUrl} alt={name} />
                  <AvatarFallback>
                    {name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex flex-col space-y-2">
                  <h4 className="text-sm font-semibold">{name}</h4>
                  <p className="text-sm text-gray-600">{title}</p>
                  <p className="text-sm">
                    Click to view full profile and portfolio
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>

            <div className="flex-1">
              <h3 className="text-lg font-semibold">{name}</h3>
              <p className="text-sm text-gray-600 mb-4">{title}</p>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge
                    key={index}
                    className={`${getSkillColor(skill.category)} cursor-pointer hover:opacity-80`}
                    variant="secondary"
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EmployeeCard;
