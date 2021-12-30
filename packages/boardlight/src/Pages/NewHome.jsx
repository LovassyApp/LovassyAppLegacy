import * as React from "react";

import AuthLayout from "../Layouts/Auth";
import EmptyTable from "../Components/EmptyTable";
import GradeCard from "../Components/GradeCard";
import HeaderCard from "../Components/HeaderCard";
import toast from "react-hot-toast";
import { usePrivateChannel } from "../Hooks/SocketManager";
import { useSelector } from "react-redux";
import { useTheme } from "@nextui-org/react";

const NewHome = () => {
  const theme = useTheme();

  const user = useSelector((state) => state.control.control.user);

  usePrivateChannel("App.Models.User." + user.id, "TestEvent", (data) => {
    toast(data.message);
  });

  return (
    <AuthLayout>
      <HeaderCard title="Szebbet jobbat!" />
      <div className="container">
        <div className="row">
          <div className="col-sm mt-2">
            <GradeCard />
          </div>
          <div className="col-sm mt-2">
            <h1>MÁSIK </h1>
          </div>
        </div>
        <EmptyTable />
      </div>
    </AuthLayout>
  );
};

export default NewHome;
