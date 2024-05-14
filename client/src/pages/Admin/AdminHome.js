import React from "react";
import Layout from "../../components/shared/Layout/Layout";
import { useSelector } from "react-redux";

const AdminHome = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <Layout>
      <div className="container">
        <div className="d-felx flex-column mt-4">
          <h1>
            Welcome Admin <i className="text-success">{user?.name}</i>
          </h1>
          <h3>Manage Smart Health Monitoring App </h3>
          <hr />
          <p>
          Welcome to the Admin Panel of the Smart Health Monitoring and Blood Donation System!

        This platform represents a pioneering approach to addressing critical healthcare needs and enhancing emergency response capabilities. Our primary focus is on efficiently fulfilling urgent blood requirements and reducing the time required to locate blood donors during emergencies.
        </p>
        
        <p>
          Admin Functions:

        <li>User Management: Manage user accounts, including donors, recipients, and healthcare professionals.</li>
          
        <li>Blood Donation Management: Monitor blood donation activities, track inventory, and facilitate donation drives.
        </li>
        <li>Emergency Response: Coordinate emergency responses, including matching donors with recipients in critical situations.
        </li>
        <li>Health Data Analytics: Analyze health data collected from donors and recipients to identify trends and insights for improved healthcare delivery.
        </li>
Thank you for being part of our journey towards a healthier and more connected community.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AdminHome;
