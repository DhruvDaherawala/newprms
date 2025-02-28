import { useState, useEffect } from "react";
import axios from "axios";

const formInputStyle =
  "w-full p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-200";
const cardStyle = "p-2 border rounded-lg bg-gray-100";

export default function PropertyMasterForm() {
  // Pull API URL from Vite environment
  const API_URL = import.meta.env.VITE_API_URL; 

  // States
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [childCount, setChildCount] = useState(0);
  const [formData, setFormData] = useState({
    propertyName: "",
    ownerName: "",
    address: "",
    documents: null,
    childProperties: [],
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Fetch all properties on mount
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      // Note: Ensure your API_URL ends with a slash or handle it accordingly
      // Example: VITE_API_URL="http://localhost:3001/api/"
      // Then we do: `${API_URL}property`
      const response = await axios.get(`${API_URL}property`);
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  // Form Handlers for Creating a New Property
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, documents: e.target.files[0] }));
  };

  const handleChildCountChange = (e) => {
    const count = parseInt(e.target.value, 10) || 0;
    setChildCount(count);
    setFormData((prev) => ({
      ...prev,
      childProperties: Array(count).fill({
        floor: "",
        title: "",
        description: "",
        rooms: "",
        washroom: "",
        gas: "",
        electricity: "",
        deposit: "",
        rent: "",
      }),
    }));
  };

  const handleChildChange = (index, e) => {
    const { name, value } = e.target;
    const updatedChildren = [...formData.childProperties];
    updatedChildren[index] = { ...updatedChildren[index], [name]: value };
    setFormData((prev) => ({ ...prev, childProperties: updatedChildren }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      const textData = {
        propertyName: formData.propertyName,
        ownerName: formData.ownerName,
        address: formData.address,
        childProperties: formData.childProperties,
      };
      form.append("formData", JSON.stringify(textData));
      if (formData.documents) {
        form.append("documents", formData.documents);
      }
      await axios.post(`${API_URL}property`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Property data saved successfully!");
      fetchProperties();
      setFormData({
        propertyName: "",
        ownerName: "",
        address: "",
        documents: null,
        childProperties: [],
      });
      setChildCount(0);
      setShowForm(false);
    } catch (error) {
      console.error("Error saving property data:", error);
      alert("Failed to save property data!");
    }
  };

  // Property Details Modal
  const handleDetailsClick = async (prop) => {
    try {
      const response = await axios.get(`${API_URL}property/with-children/${prop.id}`);
      setSelectedProperty(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching property details:", error);
      alert("Failed to load property details.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Properties Listing */}
      <div className="bg-white shadow rounded-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Registered Properties</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            {showForm ? "Close Form" : "Add Property"}
          </button>
        </div>
        {properties.length === 0 ? (
          <p className="text-gray-600">No properties found.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 w-24"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {properties.map((prop) => (
                <tr key={prop.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {prop.ownerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {prop.propertyName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {prop.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-indigo-600 hover:text-indigo-900"
                      onClick={() => handleDetailsClick(prop)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Property Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Add New Property</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <input
                type="text"
                name="propertyName"
                placeholder="Property Title"
                value={formData.propertyName}
                onChange={handleInputChange}
                className={formInputStyle}
              />
              <input
                type="text"
                name="ownerName"
                placeholder="Property Owner"
                value={formData.ownerName}
                onChange={handleInputChange}
                className={formInputStyle}
              />
            </div>
            <textarea
              name="address"
              placeholder="Property Description"
              value={formData.address}
              onChange={handleInputChange}
              className={`${formInputStyle} h-32`}
            />
            <div className="grid grid-cols-2 gap-6">
              <input type="file" onChange={handleFileChange} className={formInputStyle} />
              <input
                type="number"
                min="0"
                name="childCount"
                placeholder="Number of Floors"
                value={childCount}
                onChange={handleChildCountChange}
                className={formInputStyle}
              />
            </div>
            {childCount > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full bg-gray-200 rounded-lg text-sm mt-4">
                  <thead>
                    <tr className="bg-indigo-500 text-white">
                      <th className="p-3 rounded-tl-lg">Floor</th>
                      <th className="p-3">Title</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Rooms</th>
                      <th className="p-3">Washroom</th>
                      <th className="p-3">Gas</th>
                      <th className="p-3">Electricity</th>
                      <th className="p-3">Deposit</th>
                      <th className="p-3 rounded-tr-lg">Rent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: childCount }, (_, index) => (
                      <tr key={index}>
                        {[
                          "floor",
                          "title",
                          "description",
                          "rooms",
                          "washroom",
                          "gas",
                          "electricity",
                          "deposit",
                          "rent",
                        ].map((field) => (
                          <td key={field} className="p-3">
                            <input
                              type="text"
                              name={field}
                              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                              onChange={(e) => handleChildChange(index, e)}
                              className={formInputStyle}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-4 rounded-lg hover:bg-indigo-700 transition"
            >
              Submit
            </button>
          </form>
        </div>
      )}

      {/* Modal for Property Details */}
      {isModalOpen && selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={closeModal}
          refreshProperties={fetchProperties}
          apiUrl={API_URL} // Pass API_URL down
        />
      )}
    </div>
  );
}

function PropertyDetailModal({ property, onClose, refreshProperties, apiUrl }) {
  const [activeView, setActiveView] = useState("property"); // "property" or "child"
  const [isPropertyEditing, setIsPropertyEditing] = useState(false);
  const [isChildEditing, setIsChildEditing] = useState(false);
  const [localProperty, setLocalProperty] = useState(property);

  const cardStyle = "p-2 border rounded-lg bg-gray-100";
  const formInputStyle =
    "w-full p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-200";

  // Handle changes for property details
  const handlePropertyChange = (field, value) => {
    setLocalProperty((prev) => ({ ...prev, [field]: value }));
  };

  // Handle changes for child properties
  const handleChildChange = (index, field, value) => {
    const updatedChildren = localProperty.childProperties.map((child, idx) =>
      idx === index ? { ...child, [field]: value } : child
    );
    setLocalProperty((prev) => ({ ...prev, childProperties: updatedChildren }));
  };

  /**
   * Save the property details using the same "formData" approach as POST.
   * If you want to allow updating documents, you'd handle file inputs here.
   * For simplicity, let's keep the "documents" as text. 
   * If you want to update the file, you'd do the same approach as create (FormData).
   */
  const saveProperty = async () => {
    try {
      // Prepare form data as JSON string
      const form = new FormData();
      const dataToSend = {
        propertyName: localProperty.propertyName,
        ownerName: localProperty.ownerName,
        address: localProperty.address,
        documents: localProperty.documents, // or a file if you're updating it
        childProperties: localProperty.childProperties,
      };

      form.append("formData", JSON.stringify(dataToSend));

      // If you want to allow file upload for "documents", do:
      // form.append("documents", theFile);

      await axios.put(`${apiUrl}property/${localProperty.id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Property updated successfully!");
      refreshProperties();
      setIsPropertyEditing(false);
    } catch (error) {
      console.error("Error updating property:", error);
      alert("Failed to update property!");
    }
  };

  /**
   * For child properties only (if you want a separate endpoint).
   * If your backend updates child properties on the same PUT route,
   * you can just use saveProperty() again.
   */
  const saveChildProperties = async () => {
    try {
      // If your backend is the same route, just call saveProperty().
      // Otherwise, if you have a separate route: 
      await axios.put(`${apiUrl}property/${localProperty.id}/child_properties`, {
        childProperties: localProperty.childProperties,
      });
      alert("Child properties updated successfully!");
      setIsChildEditing(false);
    } catch (error) {
      console.error("Error updating child properties:", error);
      alert("Failed to update child properties!");
    }
  };

  // Renders the property details (non-child)
  const renderPropertyView = () => (
    <div>
      <div className="space-y-4">
        <div>
          <label className="font-semibold">Property ID:</label>
          <p className={cardStyle}>{localProperty.id}</p>
        </div>
        <div>
          <label className="font-semibold">Owner Name:</label>
          {isPropertyEditing ? (
            <input
              type="text"
              value={localProperty.ownerName || ""}
              onChange={(e) => handlePropertyChange("ownerName", e.target.value)}
              className={formInputStyle}
            />
          ) : (
            <p className={cardStyle}>{localProperty.ownerName}</p>
          )}
        </div>
        <div>
          <label className="font-semibold">Property Title:</label>
          {isPropertyEditing ? (
            <input
              type="text"
              value={localProperty.propertyName || ""}
              onChange={(e) => handlePropertyChange("propertyName", e.target.value)}
              className={formInputStyle}
            />
          ) : (
            <p className={cardStyle}>{localProperty.propertyName}</p>
          )}
        </div>
        <div>
          <label className="font-semibold">Address:</label>
          {isPropertyEditing ? (
            <textarea
              value={localProperty.address || ""}
              onChange={(e) => handlePropertyChange("address", e.target.value)}
              className={`${formInputStyle} h-24`}
            />
          ) : (
            <p className={cardStyle}>{localProperty.address}</p>
          )}
        </div>
        <div>
          <label className="font-semibold">Documents:</label>
          {isPropertyEditing ? (
            <input
              type="text"
              value={localProperty.documents || ""}
              onChange={(e) => handlePropertyChange("documents", e.target.value)}
              className={formInputStyle}
            />
          ) : (
            <p className={cardStyle}>{localProperty.documents || "No document"}</p>
          )}
        </div>
      </div>
      <div className="mt-4 flex justify-end space-x-3">
        {isPropertyEditing ? (
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={saveProperty}>
            Save
          </button>
        ) : (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setIsPropertyEditing(true)}
          >
            Edit
          </button>
        )}
        <button
          className="bg-indigo-500 text-white px-4 py-2 rounded"
          onClick={() => {
            setActiveView("child");
            setIsChildEditing(false);
          }}
        >
          Child Properties
        </button>
      </div>
    </div>
  );

  // Renders the child properties in a card layout
  const renderChildPropertiesView = () => (
    <div>
      <div className="space-y-6">
        {localProperty.childProperties && localProperty.childProperties.length > 0 ? (
          localProperty.childProperties.map((child, index) => (
            <div key={index} className="border p-4 rounded-lg bg-gray-50">
              <div>
                <label className="font-semibold">Floor:</label>
                {isChildEditing ? (
                  <input
                    type="text"
                    value={child.floor || ""}
                    onChange={(e) => handleChildChange(index, "floor", e.target.value)}
                    className={formInputStyle}
                  />
                ) : (
                  <p className={cardStyle}>{child.floor}</p>
                )}
              </div>
              <div>
                <label className="font-semibold">Title:</label>
                {isChildEditing ? (
                  <input
                    type="text"
                    value={child.title || ""}
                    onChange={(e) => handleChildChange(index, "title", e.target.value)}
                    className={formInputStyle}
                  />
                ) : (
                  <p className={cardStyle}>{child.title}</p>
                )}
              </div>
              <div>
                <label className="font-semibold">Description:</label>
                {isChildEditing ? (
                  <input
                    type="text"
                    value={child.description || ""}
                    onChange={(e) => handleChildChange(index, "description", e.target.value)}
                    className={formInputStyle}
                  />
                ) : (
                  <p className={cardStyle}>{child.description}</p>
                )}
              </div>
              <div>
                <label className="font-semibold">Rooms:</label>
                {isChildEditing ? (
                  <input
                    type="text"
                    value={child.rooms || ""}
                    onChange={(e) => handleChildChange(index, "rooms", e.target.value)}
                    className={formInputStyle}
                  />
                ) : (
                  <p className={cardStyle}>{child.rooms}</p>
                )}
              </div>
              <div>
                <label className="font-semibold">Washroom:</label>
                {isChildEditing ? (
                  <input
                    type="text"
                    value={child.washroom || ""}
                    onChange={(e) => handleChildChange(index, "washroom", e.target.value)}
                    className={formInputStyle}
                  />
                ) : (
                  <p className={cardStyle}>{child.washroom}</p>
                )}
              </div>
              <div>
                <label className="font-semibold">Gas:</label>
                {isChildEditing ? (
                  <input
                    type="text"
                    value={child.gas || ""}
                    onChange={(e) => handleChildChange(index, "gas", e.target.value)}
                    className={formInputStyle}
                  />
                ) : (
                  <p className={cardStyle}>{child.gas}</p>
                )}
              </div>
              <div>
                <label className="font-semibold">Electricity:</label>
                {isChildEditing ? (
                  <input
                    type="text"
                    value={child.electricity || ""}
                    onChange={(e) => handleChildChange(index, "electricity", e.target.value)}
                    className={formInputStyle}
                  />
                ) : (
                  <p className={cardStyle}>{child.electricity}</p>
                )}
              </div>
              <div>
                <label className="font-semibold">Deposit:</label>
                {isChildEditing ? (
                  <input
                    type="text"
                    value={child.deposit || ""}
                    onChange={(e) => handleChildChange(index, "deposit", e.target.value)}
                    className={formInputStyle}
                  />
                ) : (
                  <p className={cardStyle}>{child.deposit}</p>
                )}
              </div>
              <div>
                <label className="font-semibold">Rent:</label>
                {isChildEditing ? (
                  <input
                    type="text"
                    value={child.rent || ""}
                    onChange={(e) => handleChildChange(index, "rent", e.target.value)}
                    className={formInputStyle}
                  />
                ) : (
                  <p className={cardStyle}>{child.rent}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No child properties available.</p>
        )}
      </div>
      <div className="mt-4 flex justify-end space-x-3">
        <button
          className="bg-indigo-500 text-white px-4 py-2 rounded"
          onClick={() => setActiveView("property")}
        >
          Back
        </button>
        {isChildEditing ? (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={saveChildProperties}
          >
            Save Child Properties
          </button>
        ) : (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setIsChildEditing(true)}
          >
            Edit Child Properties
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
      <div className="bg-white w-[600px] max-h-[90vh] overflow-y-auto p-6 rounded-lg shadow-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">Property Details</h2>
        {activeView === "property" ? renderPropertyView() : renderChildPropertiesView()}
      </div>
    </div>
  );
}
