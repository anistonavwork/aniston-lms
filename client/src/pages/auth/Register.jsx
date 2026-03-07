import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../features/auth/authSlice";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const Register = () => {

  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const [designations, setDesignations] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roleCategory: "",
    designationId: "",
    customRole: ""
  });

  const [successMessage, setSuccessMessage] = useState("");

  /* =============================
     FETCH DESIGNATIONS
  ============================= */

  useEffect(() => {

    const fetchDesignations = async () => {

      try {

        const res = await axiosInstance.get("/admin/designations");

        setDesignations(res.data);

      } catch {

        toast.error("Failed to load designations");

      }

    };

    fetchDesignations();

  }, []);


  /* =============================
     HANDLE INPUT CHANGE
  ============================= */

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  /* =============================
     HANDLE SUBMIT
  ============================= */

  const handleSubmit = (e) => {

    e.preventDefault();

    const finalRole =
      formData.roleCategory === "Other"
        ? formData.customRole
        : formData.roleCategory;

    dispatch(
      registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        business_category: finalRole,
        designation_id:
          formData.roleCategory === "Employees"
            ? formData.designationId
            : null,
        custom_role:
          formData.roleCategory === "Other"
            ? formData.customRole
            : null
      })
    );

  };


  /* =============================
     SUCCESS / ERROR HANDLING
  ============================= */

  useEffect(() => {

    if (error) {

      toast.error(error);

    }

    if (!loading && !error) {

      toast.success("Registration successful! Waiting for admin approval.");

    }

  }, [loading, error]);


  /* =============================
     UI
  ============================= */

  return (

    <div className="flex items-center justify-center min-h-[90vh]">

      <div className="w-full max-w-md border rounded-lg p-8 shadow-sm">

        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* NAME */}

          <div>

            <label className="block text-sm font-medium mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
              required
            />

          </div>


          {/* EMAIL */}

          <div>

            <label className="block text-sm font-medium mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
              required
            />

          </div>


          {/* PASSWORD */}

          <div>

            <label className="block text-sm font-medium mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
              required
            />

          </div>


          {/* CATEGORY */}

          <div>

            <label className="block text-sm font-medium mb-2">
              Select Your Category
            </label>

            <select
              name="roleCategory"
              value={formData.roleCategory}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
              required
            >

              <option value="">Select Category</option>

              <option value="Employees">
                Employees
              </option>

              <option value="System Integrators">
                System Integrators
              </option>

              <option value="Dealers">
                Dealers
              </option>

              <option value="Distributors">
                Distributors
              </option>

              <option value="AV Engineers">
                AV Engineers
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>


          {/* DESIGNATION (ONLY FOR EMPLOYEES) */}

          {formData.roleCategory === "Employees" && (

            <div>

              <label className="block text-sm font-medium mb-2">
                Select Designation
              </label>

              <select
                name="designationId"
                value={formData.designationId}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                required
              >

                <option value="">
                  Select Designation
                </option>

                {designations.map((d) => (

                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>

                ))}

              </select>

            </div>

          )}


          {/* CUSTOM ROLE */}

          {formData.roleCategory === "Other" && (

            <div>

              <label className="block text-sm font-medium mb-2">
                Enter Custom Role
              </label>

              <input
                type="text"
                name="customRole"
                value={formData.customRole}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                required
              />

            </div>

          )}


          {/* SUBMIT BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md hover:opacity-90 transition disabled:opacity-60"
          >

            {loading ? "Submitting..." : "Submit Request"}

          </button>

        </form>

      </div>

    </div>

  );

};

export default Register;