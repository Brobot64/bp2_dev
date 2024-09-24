import React from "react";
import { FaDownload } from "react-icons/fa6";

interface User {
    id: number;
    name: string;
    email: string;
    role_id: number;
    is_active: boolean;
    updated_at: string;
    created_at: string;
    first_login_at: string;
    profession: string;
    patients: number;
    lastLogin: string;
}

const exportCSV = (data: User[]) => {
  const headers = ['Name', 'Email', 'Is Active'];

  const rows = data.map(({ name, email, is_active, }) => [
    name, email ?? '', is_active ?? ''
  ]);

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += headers.join(",") + "\n"; // Add headers
  csvContent += rows.map(e => e.join(",")).join("\n"); // Add data rows

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "exported_data.csv");
  document.body.appendChild(link);

  link.click(); // Trigger download
  document.body.removeChild(link); // Cleanup
};

interface ExportCsvProps {
  data: User[];
  selectedUsers: number[]; // Array of selected user IDs
}

const ExportCsv: React.FC<ExportCsvProps> = ({ data, selectedUsers }) => {
  // Filter users whose ID is in the selectedUsers array
  const filteredData = data.filter(user => selectedUsers.includes(user.id));

  return (
    <div className="flex justify-center items-center flex-col gap-2">
        <h1>Export Users</h1>
      <button className="flex items-center gap-2 py-2 px-5 rounded-full bg-slate-300 hover:bg-black hover:text-white" onClick={() => exportCSV(filteredData)}>
        <FaDownload/>
        Export As CSV
      </button>
    </div>
  );
};

export default ExportCsv;
