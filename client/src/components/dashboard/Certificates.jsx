import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [level2Passed, setLevel2Passed] = useState(false);
  const [loading, setLoading] = useState(true);
   
  const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "/anistonlms";

  useEffect(() => {
    const init = async () => {
      try {
        /* =========================
           LOAD EXISTING CERTIFICATES
        ========================= */

        const certRes = await axiosInstance.get("/certificates/my-certificates");
        setCertificates(certRes.data);

        /* =========================
           CHECK LEVEL 2 ASSESSMENT
        ========================= */

        const assessRes = await axiosInstance.get("/assessment/result/2");

        if (assessRes.data && assessRes.data.passed) {
          setLevel2Passed(true);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const generateCertificate = async () => {
    try {
      const res = await axiosInstance.post("/certificates/generate", {
        level: 2,
      });

      toast.success("Certificate generated");

      setCertificates([res.data]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate certificate");
    }
  };

  if (loading) {
    return <p>Loading certificates...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Certificates</h2>

      {certificates.length === 0 && (
        <>
          {level2Passed ? (
            <button
              onClick={generateCertificate}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Generate Certificate
            </button>
          ) : (
            <p className="text-gray-600">
              Complete and pass the Level 2 assessment to unlock your certificate.
            </p>
          )}
        </>
      )}

      <div className="space-y-4 mt-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <p>Level {cert.level} Certificate</p>

            <a
              href={`${BASE_URL}${cert.certificate_url}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certificates;