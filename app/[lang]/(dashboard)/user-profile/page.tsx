import ProfileProgress from "./overview/profile-progress";
import UserInfo from "./overview/user-info";
import Portfolio from "./overview/portfolio";
import Skills from "./overview/skills";
import Connections from "./overview/connections";
import Teams from "./overview/teams";
import About from "./overview/about";
import RecentActivity from "./overview/recent-activity";
import Projects from "./overview/projects";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Overview = () => {
  return (
    <div>
      {" "}
      <Card className="flex flex-row  !flex-nowrap justify-between items-center p-4  rounded-xl my-3">
        <div className="flex flex-col gap-3 justify-between items-start">
          <p className="font-bold text-base text-[#1A1A1A] dark:text-slate-200">
            Change Password
          </p>

          <p className="font-light text-sm text-[#1A1A1A] dark:text-slate-400">
            Create a password with at least 12 characters, including uppercase
            and lowercase letters, numbers, special characters, and avoid using
            personal information.
          </p>
        </div>
        <Button variant="outline">Change password</Button>
      </Card>
      <UserInfo />
    </div>
  );
};

export default Overview;
