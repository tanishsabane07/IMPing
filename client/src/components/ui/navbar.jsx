// import React, { useState, useEffect } from 'react';
// import { Home, LogOut, User, Settings, FileText, Briefcase, BookOpen } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// const Navbar = () => {
//   const navigate = useNavigate();
//   const [role, setRole] = useState("");
//   const [username, setUsername] = useState("");

//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         setRole(decoded.role);
//         setUsername(decoded.username || "User"); // Assuming username is in the token
//       } catch (error) {
//         console.error("Invalid token", error);
//         localStorage.removeItem("authToken");
//         navigate("/register/login");
//       }
//     }
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem("authToken");
//     navigate("/register/login");
//   };

//   const profileMenuItems = [
//     {
//       label: "Profile Settings",
//       icon: <Settings className="mr-2 h-4 w-4" />,
//       onClick: () => navigate("/profile/settings"),
//       roles: ["student", "admin"] // Accessible to these roles
//     },
//     {
//       label: "My Applications",
//       icon: <FileText className="mr-2 h-4 w-4" />,
//       onClick: () => navigate("/student/applications"),
//       roles: ["student"]
//     },
//     {
//       label: "Manage Internships",
//       icon: <Briefcase className="mr-2 h-4 w-4" />,
//       onClick: () => navigate("/admin/internships"),
//       roles: ["admin"]
//     },
//     {
//       label: "Learning Resources",
//       icon: <BookOpen className="mr-2 h-4 w-4" />,
//       onClick: () => navigate("/resources"),
//       roles: ["student"]
//     }
//   ];

//   return (
//     <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 border-b shadow-sm bg-white">
//       <div className="flex items-center space-x-4">
//         {/* Logo */}
//         <Button variant="ghost" size="icon" onClick={() => navigate("/student/internships")}>
//           <Home className="h-6 w-6" />
//         </Button>

//         {/* Navigation Menu */}
//         <NavigationMenu>
//           <NavigationMenuList className="flex space-x-4">
//             {role === "admin" && (
//               <NavigationMenuItem>
//                 <Button onClick={() => navigate("/add-internship")}>Add Internship</Button>
//               </NavigationMenuItem>
//             )}
//           </NavigationMenuList>
//         </NavigationMenu>
//       </div>

//       {/* Profile Section */}
//       <div className="flex items-center space-x-4">
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Avatar className="cursor-pointer">
//               <AvatarImage src="/api/placeholder/40/40" alt="User profile" />
//               <AvatarFallback>
//                 <User className="h-5 w-5" />
//               </AvatarFallback>
//             </Avatar>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent className="w-56">
//             <DropdownMenuLabel>
//               <div className="flex items-center">
//                 <Avatar className="mr-2 h-8 w-8">
//                   <AvatarImage src="/api/placeholder/40/40" alt="User profile" />
//                   <AvatarFallback>
//                     <User className="h-5 w-5" />
//                   </AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <p className="text-sm font-medium">{username}</p>
//                   <p className="text-xs text-muted-foreground capitalize">{role}</p>
//                 </div>
//               </div>
//             </DropdownMenuLabel>
//             <DropdownMenuSeparator />
            
//             {profileMenuItems
//               .filter(item => item.roles.includes(role))
//               .map((item, index) => (
//                 <DropdownMenuItem key={index} onClick={item.onClick}>
//                   {item.icon}
//                   {item.label}
//                 </DropdownMenuItem>
//               ))
//             }
            
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
//               <LogOut className="mr-2 h-4 w-4" />
//               Logout
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState, useEffect } from 'react';
import { 
  Home, 
  LogOut, 
  User, 
  Settings, 
  FileText, 
  Briefcase, 
  BookOpen, 
  Search, 
  Bell, 
  Star, 
  Filter 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from '@radix-ui/react-dropdown-menu';

const Navbar = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  //const [notifications, setNotifications] = useState(3); // Example notification count

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
        setUsername(decoded.username || "User");
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("authToken");
        navigate("/register/login");
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/register/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  const profileMenuItems = [
    {
      label: "Profile Settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
      onClick: () => navigate("/profile"),
      roles: ["student", "admin"]
    },
    {
      label: "My Applications",
      icon: <FileText className="mr-2 h-4 w-4" />,
      onClick: () => navigate("/student/applications"),
      roles: ["student"]
    },
    {
      label: "Manage Internships",
      icon: <Briefcase className="mr-2 h-4 w-4" />,
      onClick: () => navigate("/admin/internships"),
      roles: ["admin"]
    },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] flex items-center justify-between px-6 py-3 border-b shadow-sm bg-white">
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button variant="ghost" size="icon" onClick={() => navigate("/internships")}>
                  <Home className="h-6 w-6" />
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent className="z-[1000]">
              <p>Home</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Search internships, resources..." 
              className="w-72 pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          </div>
          <Button type="submit" variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* Right Side Navigation */}
      <div className="flex items-center space-x-4 justify-center">

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src="/api/placeholder/40/40" alt="User profile" />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 z-[1000]">
            <DropdownMenuLabel>
              <div className="flex items-center">
                <Avatar className="mr-3 h-10 w-10">
                  <AvatarImage src="/api/placeholder/40/40" alt="User profile" />
                  <AvatarFallback>
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{username}</p>
                  <p className="text-xs text-muted-foreground capitalize flex items-center">
                    {role}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {profileMenuItems
              .filter(item => item.roles.includes(role))
              .map((item, index) => (
                <DropdownMenuItem key={index} onClick={() => { item.onClick(); document.activeElement?.blur(); }}>
                  {item.icon}
                  {item.label}
                </DropdownMenuItem>
              ))
            }
          
            
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;