import { useSession } from "next-auth/react";
import React from "react";

const Dashboard = () => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (status === "unauthenticated") {
    return <div>Log In</div>
  }
  return (
    <div>

    </div>
  );
};

export default Dashboard;
