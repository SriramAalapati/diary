import React from "react";
import Layout from "../../layout/Layout";

const Dashboard = () => {
  const metrics = {
    dairy: 10,
    todayTasks: 10,
    tomorrowTasks: 10,
    finance: 5000,
    goalProgress: 20,
    todo: 9,
  };
  const anotherMetrix = [];
  return (
    <Layout>
      <div>
        <div className="w-full  border-b  rounded-md px-3 py-4 text-center">
          <p className="">
            <span className="text-3xl font-bold text-black">Welcome, </span>
            <span className="text-3xl font-bold italic text-black underline underline-offset-2 decoration-blue-700 shadow-2xl">
              Sriram Aalapati
            </span>
          </p>
          <p className="font-semibold italic">
            List your day here for better tomorrow
          </p>
        </div>
        <div className="grid grid-cols-3 gap-x-3">
          {Object.entries(metrics).map(([key, value], index) => {
            return (
              <div key={index} className="border ">
                <p className="text-md font-semibold">{key}</p>
                <p>{value}</p>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
