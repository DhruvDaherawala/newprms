import React, { useEffect, useState } from "react";
import axios from "axios";

const formInputStyle =
  "w-full p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-200";

const RentalAllocation = () => {
  // --- State variables ---
  const [allocations, setAllocations] = useState([]);
  const [properties, setProperties] = useState([]);
  const [renters, setRenters] = useState([]);
  const [childProperties, setChildProperties] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  // Form state (for create/update)
  const [formData, setFormData] = useState({
    allocation_id: "",
    renter_id: "",
    property_id: "",
    childproperty_id: "",
    allocation_date: "",
    remarks: "",
    rent_agreement: null,
    other_document: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // --- Fetch data on component mount ---
  useEffect(() => {
    fetchAllocations();
    fetchProperties();
    fetchRenters();
    fetchChildProperties();
  }, []);

  // --- API calls ---
  const fetchAllocations = async () => {
    try {
      const response = await axios.get(`${API_URL}allocations`);
      setAllocations(response.data);
    } catch (err) {
      console.error("Error fetching allocations:", err);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${API_URL}property`);
      setProperties(response.data);
    } catch (err) {
      console.error("Error fetching properties:", err);
    }
  };

  const fetchRenters = async () => {
    try {
      const response = await axios.get(`${API_URL}renter`);
      setRenters(response.data);
    } catch (err) {
      console.error("Error fetching renters:", err);
    }
  };

  const fetchChildProperties = async () => {
    try {
      const response = await axios.get(`${API_URL}childproperty`);
      setChildProperties(response.data);
    } catch (err) {
      console.error("Error fetching child properties:", err);
    }
  };

  // --- Handlers ---
  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateNew = () => {
    setFormData({
      allocation_id: "",
      renter_id: "",
      property_id: "",
      childproperty_id: "",
      allocation_date: "",
      remarks: "",
      rent_agreement: null,
      other_document: null,
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (allocation) => {
    setFormData({
      allocation_id: allocation.allocation_id || allocation.id,
      renter_id: allocation.renter_id || allocation.renterId,
      property_id: allocation.property_id || allocation.propertyId,
      childproperty_id: allocation.childproperty_id || "",
      allocation_date: allocation.allocation_date || allocation.startDate || "",
      remarks: allocation.remarks || "",
      rent_agreement: null,
      other_document: null,
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (allocation) => {
    if (!window.confirm("Are you sure you want to delete this allocation?"))
      return;
    try {
      const allocationId = allocation.allocation_id || allocation.id;
      await axios.delete(`${API_URL}allocations/${allocationId}`);
      alert("Allocation deleted!");
      fetchAllocations();
    } catch (err) {
      console.error("Error deleting allocation:", err);
      alert("Failed to delete allocation.");
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();
      fd.append("renter_id", formData.renter_id);
      fd.append("property_id", formData.property_id);
      fd.append("childproperty_id", formData.childproperty_id);
      fd.append("allocation_date", formData.allocation_date);
      fd.append("remarks", formData.remarks);
      if (formData.rent_agreement) {
        fd.append("rent_agreement", formData.rent_agreement);
      }
      if (formData.other_document) {
        fd.append("other_document", formData.other_document);
      }

      if (isEditing) {
        const allocationId = formData.allocation_id;
        await axios.put(`${API_URL}allocations/${allocationId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Allocation updated successfully!");
      } else {
        await axios.post(`${API_URL}allocations`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Allocation created successfully!");
      }

      setShowForm(false);
      fetchAllocations();
    } catch (err) {
      console.error("Error saving allocation:", err);
      alert("Failed to save allocation.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Allocations Listing */}
      <div className="bg-white shadow rounded-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Allocations</h2>
          <button
            onClick={handleCreateNew}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            Add New Allocation
          </button>
        </div>
        {allocations.length === 0 ? (
          <p className="text-gray-600">No allocations found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Allocation ID
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Renter
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Child Property
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Allocation Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rent Agreement
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Other Document
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remarks
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allocations.map((alloc) => (
                  <tr
                    key={alloc.allocation_id || alloc.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-2">
                      {alloc.allocation_id || alloc.id}
                    </td>
                    <td className="px-4 py-2">
                      {alloc.renter_id || alloc.renterId}
                    </td>
                    <td className="px-4 py-2">
                      {alloc.property_id || alloc.propertyId}
                    </td>
                    <td className="px-4 py-2">
                      {alloc.childproperty_id || "-"}
                    </td>
                    <td className="px-4 py-2">
                      {alloc.allocation_date || alloc.startDate || "-"}
                    </td>
                    <td className="px-4 py-2">
                      {alloc.rent_agreement ? (
                        <a
                          href={`${API_URL}uploads/${alloc.rent_agreement}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          View
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {alloc.other_document ? (
                        <a
                          href={`${API_URL}uploads/${alloc.other_document}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          View
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {alloc.remarks || "-"}
                    </td>
                    <td className="px-4 py-2">
                      {alloc.status || "Active"}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(alloc)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(alloc)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Allocation Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
            {isEditing ? "Edit Allocation" : "Add New Allocation"}
          </h2>
          <form onSubmit={handleSubmitForm} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block font-medium mb-2">Renter</label>
                <select
                  name="renter_id"
                  value={formData.renter_id}
                  onChange={handleFormChange}
                  className={formInputStyle}
                >
                  <option value="">-- Select Renter --</option>
                  {renters.map((r) => (
                    <option
                      key={r.renter_id || r.id}
                      value={r.renter_id || r.id}
                    >
                      {r.renterName || r.renter_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-2">Property</label>
                <select
                  name="property_id"
                  value={formData.property_id}
                  onChange={handleFormChange}
                  className={formInputStyle}
                >
                  <option value="">-- Select Property --</option>
                  {properties.map((p) => (
                    <option
                      key={p.property_id || p.id}
                      value={p.property_id || p.id}
                    >
                      {p.propertyName || p.property_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-2">
                  Child Property (Floor/Unit)
                </label>
                <select
                  name="childproperty_id"
                  value={formData.childproperty_id}
                  onChange={handleFormChange}
                  className={formInputStyle}
                >
                  <option value="">-- Select Child Property --</option>
                  {childProperties.map((cp) => (
                    <option
                      key={cp.childproperty_id || cp.id}
                      value={cp.childproperty_id || cp.id}
                    >
                      {cp.title || cp.name || "-"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-2">
                  Allocation Date
                </label>
                <input
                  type="date"
                  name="allocation_date"
                  value={formData.allocation_date}
                  onChange={handleFormChange}
                  className={formInputStyle}
                />
              </div>
              <div>
                <label className="block font-medium mb-2">Remarks</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleFormChange}
                  className={`${formInputStyle} h-32`}
                ></textarea>
              </div>
              <div>
                <label className="block font-medium mb-2">
                  Rent Agreement (File)
                </label>
                <input
                  type="file"
                  name="rent_agreement"
                  onChange={handleFormChange}
                  className={formInputStyle}
                />
              </div>
              <div>
                <label className="block font-medium mb-2">
                  Other Document (File)
                </label>
                <input
                  type="file"
                  name="other_document"
                  onChange={handleFormChange}
                  className={formInputStyle}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {isEditing ? "Update Allocation" : "Create Allocation"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default RentalAllocation;
