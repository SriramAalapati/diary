import React, { useEffect, useState, useMemo } from "react";
import Layout from "../../layout/Layout";
import apiCaller from "/src/utils/apiCaller";
import { useUser } from "../../hooks/UserContext";

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {user} = useUser();
  // --- Data Fetching ---
  

  useEffect(() => {
    const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await apiCaller(`/getDashboardData?userId=${user.id}`);
      if (response.status === "Success") {
        setStats(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch dashboard data.");
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
    if(user && user.id){
      fetchDashboardData();
    }
  }, [user.id]);
  console.log("rerendering dashboard");
  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-20 text-gray-600">
          <i className="fa-solid fa-spinner fa-spin text-4xl"></i>
          <p className="mt-4">Loading your life summary...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg border">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b-4 border-indigo-600 pb-2 inline-block">
          Personal Dairy Summary 📊
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            name="Total Tasks"
            value={stats.totalTasks}
            icon="list-check"
            color="indigo"
          />
          {/* <MetricCard name="Total Goals" value={stats.totalGoals} icon="bullseye" color="yellow" /> */}
          <MetricCard
            name="Loan Balance Due"
            value={`${Number(stats.totalLoanBalance).toLocaleString("en-IN")}`}
            icon="hand-holding-dollar"
            color="green"
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
          Next Focus
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ActionList
            title="High Priority Tasks"
            icon="triangle-exclamation"
            color="red"
            items={stats.highPriorityTasks}
          />
        </div>
      </div>
    </Layout>
  );
};

// ===================================
// Helper Components
// ===================================

// --- GENERIC METRIC CARD ---
function MetricCard({ name, icon, value, color }) {
  const colorMap = {
    indigo: "bg-indigo-600",
    red: "bg-red-600",
    yellow: "bg-yellow-600",
    green: "bg-green-600",
  };
  const iconClass = `fa-solid fa-${icon}`;

  return (
    <div className="bg-white p-5 border rounded-xl shadow-md flex items-center space-x-4">
      <div
        className={`flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full ${colorMap[color]} text-white`}
      >
        <i className={`${iconClass} text-xl`} />
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
          {name}
        </p>
        <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
      </div>
    </div>
  );
}

// --- ACTION LIST ---
function ActionList({ title, icon, color, items }) {
  const colorMap = {
    red: "text-red-600 bg-red-50",
    orange: "text-yellow-600 bg-yellow-50",
  };
  const iconClass = `fa-solid fa-${icon}`;
  return (
    <div className="bg-white border rounded-xl shadow-lg p-5">
      <h3
        className={`text-lg font-bold ${
          colorMap[color].split(" ")[0]
        } mb-4 flex items-center`}
      >
        <i className={`${iconClass} mr-2`}></i> {title}
      </h3>
      <ul className="space-y-3">
        {items?.map((item) => (
          <li
            key={item.id}
            className="p-3 border-l-4 border-gray-200 hover:bg-gray-50 transition-colors rounded-sm flex justify-between items-center"
          >
            <div>
              <p className="font-medium text-gray-800">{item.task}</p>
              <p className="text-xs text-gray-500">{item.priority}</p>
            </div>
            <button
              className="text-indigo-500 hover:text-indigo-700 text-sm"
              title="Go to Item"
            >
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </li>
        ))}
        {items?.length === 0 && (
          <p className="text-gray-500 text-sm">Nothing urgent here! 🎉</p>
        )}
      </ul>
    </div>
  );
}

export default Dashboard;
