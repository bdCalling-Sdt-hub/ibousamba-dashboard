// import React, { useContext, useEffect, useState } from "react";
// import { useProfileQuery } from "../redux/apiSlices/profileSlice";

// export const UserContext = React.createContext(null);

// export const UserProvider = ({ children }) => {
//   const { data: profile } = useProfileQuery();
//   const [user, setUser] = useState(null);

//   console.log("profile", profile);

//   const profiles = {
//     firstName: profile.fullName,
//     email: profile.email,
//     mobileNumber: profile.phone,
//     image: profile.image,
//   };

//   useEffect(() => {
//     if (profiles) {
//       setUser(profiles);
//     }
//   }, [profiles]); //[profile]

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error("useUser must be used within a UserProvider");
//   }
//   return context;
// };

import React, { useContext, useEffect, useState } from "react";
import { useProfileQuery } from "../redux/apiSlices/profileSlice";

export const UserContext = React.createContext(null);

export const UserProvider = ({ children }) => {
  const { data: profile } = useProfileQuery();
  const [user, setUser] = useState(null);

  // console.log("Profile Data:", profile?.data);

  useEffect(() => {
    if (profile) {
      setUser({
        firstName: profile?.data.fullName || "",
        email: profile?.data.email || "",
        mobileNumber: profile?.data.phone || "",
        image: profile?.data.image || "",
        role: profile?.data.role || "",
      });
    }
  }, [profile]); // Dependency should be profile, not profiles

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
