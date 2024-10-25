import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define the structure of the feature item fetched from the API
interface Feature {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

const ManageFeatures: React.FC = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [newFeature, setNewFeature] = useState<string>('');
  const [editFeature, setEditFeature] = useState<Feature | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [tempId, setTempId] = useState<number>(-1); // Temporary ID generator for new features

  // Fetch features from API
  const fetchFeatures = async () => {
    setLoading(true);
    try {
      const response = await axios.get<{ status: string; data: Feature[] }>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/features`);
      setFeatures(response.data.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch features.');
    } finally {
      setLoading(false);
    }
  };

  // Create a new feature and optimistically add it to the frontend before saving
  const createFeature = async () => {
    if (!newFeature.trim()) return;

    // Optimistically add the new feature to the frontend with a temporary ID
    const tempFeature: Feature = {
      id: tempId,
      name: newFeature,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    };

    setFeatures([...features, tempFeature]); // Add new feature to the list with a temporary ID
    setTempId(tempId - 1); // Decrement tempId for next new feature
    setNewFeature(''); // Reset input

    // Save new feature to the backend
    try {
      const response = await axios.post<Feature>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/features`, { name: newFeature });
      // Replace the temp feature with the saved feature from the backend
      setFeatures((prevFeatures) =>
        prevFeatures.map((feature) =>
            // @ts-ignore
          feature.id === tempFeature.id ? response.data.data : feature
        )
      );
      setSuccessMessage('Feature created successfully!');
      setError(null);
    } catch (error) {
      // Remove the temp feature if the request fails
      setFeatures((prevFeatures) => prevFeatures.filter((feature) => feature.id !== tempFeature.id));
      setError('Failed to create feature.');
      setSuccessMessage(null);
    }
  };

  // Edit a feature optimistically in the frontend
  const updateFeature = async () => {
    if (editFeature && editFeature.name.trim()) {
      // Optimistically update the feature in the frontend
      setFeatures((prevFeatures) =>
        prevFeatures.map((feature) =>
          feature.id === editFeature.id ? { ...feature, name: editFeature.name } : feature
        )
      );

      setSuccessMessage('Feature updated locally.');

      // Save updated feature to the backend
      try {
        const response = await axios.put<Feature>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/features/${editFeature.id}`, { name: editFeature.name });
        setFeatures((prevFeatures) =>
          prevFeatures.map((feature) =>
            // @ts-ignore
            feature.id === editFeature.id ? response.data.data : feature
          )
        );
        setSuccessMessage('Feature updated successfully!');
        setEditFeature(null); // Reset edit state
        setError(null);
      } catch (error) {
        setError('Failed to update feature.');
        setSuccessMessage(null);
      }
    }
  };

  // Delete a feature by ID
  const deleteFeature = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/features/${id}`);
      setFeatures(features.filter((feature) => feature.id !== id));
      setSuccessMessage('Feature deleted successfully!');
      setError(null);
    } catch (error) {
      setError('Failed to delete feature.');
      setSuccessMessage(null);
    }
  };

  // Fetch features on component mount
  useEffect(() => {
    fetchFeatures();
  }, []);

  return (
    <div>
      <h1 className='my-6 font-semibold text-2xl underline'>Subscription Features</h1>

      {/* Display success or error messages */}
      {error && <div className='w-full p-2 text-xs bg-red-300 text-red-900 font-semibold my-3'>{error}</div>}
      {successMessage && <div className='w-full p-2 text-xs bg-green-300 text-green-900 font-semibold my-3'>{successMessage}</div>}

      {/* Add New Feature */}
      <div className='mb-3 w-full border-b-2 border-dashed pb-3 border-gray-500'>
        <input
          type="text"
          className="outline-none font-normal leading-[17px] text-[14px]"
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          placeholder="Add new feature"
        />
        <button
          className="rounded-md border-[2px] border-black bg-black text-white text-[12px] py-1 px-2 mr-2 hover:text-black hover:bg-white transition"
          onClick={createFeature}
          disabled={!newFeature.trim()}
        >
          Add Feature
        </button>
      </div>

      {/* Loading state */}
      {loading && <p>Loading features...</p>}

      {/* Display List of Features */}
      {!loading && features.length > 0 && (
        <ol type="1" style={{ listStyle: '' }}>
          {features.map((feature, index) => (
            <li key={feature.id} className="my-2 flex items-center">
                <span className='font-bold text-xl mr-3'>{index + 1}.</span>
              {/* Edit or display feature name */}
              {editFeature && editFeature.id === feature.id ? (
                <input
                  type="text"
                  value={editFeature.name}
                  className="mr-2 outline-none border-b-2 border-blue-400"
                  onChange={(e) => setEditFeature({ ...editFeature, name: e.target.value })}
                />
              ) : (
                <span className="mr-4">{feature.name}</span>
              )}

              {/* Update or Edit Button */}
              {editFeature && editFeature.id === feature.id ? (
                <button
                  className="rounded-md border-[2px] border-green-400 bg-green-400 text-black text-[10px] py-1 px-3 mr-2 hover:text-green-800 hover:bg-white transition font-semibold"
                  onClick={updateFeature}
                  disabled={!editFeature.name.trim()}
                >
                  Save
                </button>
              ) : (
                <button
                  className="rounded-md border-[2px] border-blue-400 bg-blue-400 text-black text-[10px] py-1 px-3 mr-2 hover:text-blue-800 hover:bg-white transition font-semibold"
                  onClick={() =>
                    setEditFeature({
                      id: feature.id,
                      name: feature.name,
                      created_at: feature.created_at,
                      updated_at: feature.updated_at,
                      deleted_at: feature.deleted_at,
                    })
                  }
                >
                  Edit
                </button>
              )}

              {/* Delete Button */}
              <button
                className="rounded-md border-[2px] border-red-400 bg-red-400 text-black text-[10px] py-1 px-3 mr-2 hover:text-red-800 hover:bg-white transition font-semibold"
                onClick={() => deleteFeature(feature.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default ManageFeatures;
