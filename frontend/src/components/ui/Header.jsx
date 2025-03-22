import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-react";
import React from "react";
import Container from "./Container";
import LogoContainer from "./LogoContainer";
import NavigationRoutes from "./NavigationRoutes";
import { NavLink } from "react-router-dom";
import ProfileContainer from "./ProfileContainer";
import ToggleContainer from "./ToggleContainer";

const Header = () => {
  const { userId } = useAuth();
  return (
    <header
      className={cn("w-full border-b duration-150 transition-all ease-in-out")}
    >
      <Container>
        <div className="flex items-center gap-4 w-full">
          {/* logosection */}
          <LogoContainer />
          {/* navigation section   */}
          <nav className="hidden md:flex items-center gap-3">
            <NavigationRoutes />
            {userId && (
              <NavLink
                to="/generate"
                className={({ isActive }) =>
                  cn(
                    "text-base text-neutral-500",
                    isActive && "text-neutral-900 font-semibold"
                  )
                }
              >
                Take An Interview
              </NavLink>
              
            )}
              {userId && (
              <NavLink
                to="/resume"
                className={({ isActive }) =>
                  cn(
                    "text-base text-neutral-500",
                    isActive && "text-neutral-900 font-semibold"
                  )
                }
              >
                Resume Builder
              </NavLink>
              
            )}
               {userId && (
              <NavLink
                to="/ai-cover-letter"
                className={({ isActive }) =>
                  cn(
                    "text-base text-neutral-500",
                    isActive && "text-neutral-900 font-semibold"
                  )
                }
              >
                Cover-Letter Generator
              </NavLink>
              
            )}
          </nav>
          {/* profilesection */}
          <div className="ml-auto flex items-center gap-6">
{/* profile container */}
<ProfileContainer/>
{/* toggle container */}
<ToggleContainer/>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
