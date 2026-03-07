import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const AdminAssessments = () => {

  const [results, setResults] = useState([]);

  useEffect(() => {

    const fetchResults = async () => {

      try {

        const res = await axiosInstance.get("/admin/assessments");

        setResults(res.data);

      } catch {

        toast.error("Failed to load assessment results");

      }

    };

    fetchResults();

  }, []);

  return (

    <div>

      <h2 className="text-2xl font-bold mb-6">
        Assessment Results
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full border">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Level</th>
              <th className="p-2 border">Score</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Date</th>
            </tr>

          </thead>

          <tbody>

            {results.map((r, i) => (

              <tr key={i}>

                <td className="border p-2">
                  {r.name}
                </td>

                <td className="border p-2">
                  {r.email}
                </td>

                <td className="border p-2">
                  Level {r.level}
                </td>

                <td className="border p-2">
                  {r.score}%
                </td>

                <td className="border p-2">

                  {r.passed
                    ? <span className="text-green-600">Passed</span>
                    : <span className="text-red-600">Failed</span>
                  }

                </td>

                <td className="border p-2">
                  {new Date(r.taken_at).toLocaleDateString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

};

export default AdminAssessments;