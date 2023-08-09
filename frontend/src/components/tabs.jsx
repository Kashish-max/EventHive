import React from "react";
import { useSelector } from "react-redux";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import {
  CodeBracketSquareIcon,
  Square3Stack3DIcon,
  UserCircleIcon,
  MegaphoneIcon,
} from "@heroicons/react/24/solid";

import { selectDefaultTab } from "../store/authSlice";
import AllHackathons from "./features/all-hacks"; 
import HostHackathon from "./features/host-hack";
import MyRegistrations from "./features/my-registrations";
import MyListings from "./features/my-listings";


export default function TabsWithIcon({authData}) {
  const defaultTab = useSelector(selectDefaultTab);

  const data = [
    {
      label: "Hackathons",
      value: "hackathons",
      icon: CodeBracketSquareIcon,
      component: <AllHackathons authData={authData} />,
    },
    {
      label: "Host a Hackathon",
      value: "host",
      icon: MegaphoneIcon,
      component: <HostHackathon />,
    },
    {
      label: "My Registrations",
      value: "registrations",
      icon: UserCircleIcon,
      component: <MyRegistrations />,
    },
    {
      label: "My Listings",
      value: "listings",
      icon: Square3Stack3DIcon,
      component: <MyListings />,
    },
  ];

  return (
    <Tabs value={defaultTab}>
      <TabsHeader className="rounded-none block lg:flex">
        {data.map(({ label, value, icon }) => {
          return(
            <Tab key={value} value={value}>
              <div className="flex items-center gap-2">
                {React.createElement(icon, { className: "w-5 h-5" })}
                {label}
              </div>
            </Tab>
          )})
        }
      </TabsHeader>
      <TabsBody>
        {data.map(({ value, component }) => (
          <TabPanel key={value} value={value}>
            {component}
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  );
}