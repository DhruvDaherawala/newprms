import { useState, useEffect } from "react";

export default function DetailModal({
  isOpen,
  title = "Details",
  rowData = {},
  onClose,
  onSave,
  onDelete,
}) {
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  // Update editData whenever rowData changes
  useEffect(() => {
    setEditData({ ...rowData });
  }, [rowData]);

  if (!isOpen) return null;

  const handleEditToggle = () => {
    setEditMode(!editMode);
    // Reset data when canceling edit
    if (editMode) {
      setEditData({ ...rowData });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editData);
    }
    setEditMode(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(rowData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl h-[500px] overflow-y-auto p-6 rounded-lg shadow-xl relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {Object.entries(rowData).map(([key, value]) => (
            <div key={key} className="border-b border-gray-200 py-3">
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {key}
              </label>
              {editMode ? (
                <input
                  type="text"
                  name={key}
                  value={editData[key] || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              ) : (
                <div className="text-gray-900">
                  {value?.toString() || "N/A"}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex justify-end space-x-3">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              >
                Save Changes
              </button>
              <button
                onClick={handleEditToggle}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEditToggle}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}