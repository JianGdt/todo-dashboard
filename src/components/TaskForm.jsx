/* eslint-disable react/prop-types */

const TaskForm = ({
  title,
  setTitle,
  description,
  setDescription,
  expiryDate,
  setExpiryDate,
  isSaving,
  handleSave,
  onClose,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded-lg font-semibold"
        placeholder="Task Title"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded-lg"
        placeholder="Task Description"
      />
      <input
        type="date"
        value={expiryDate}
        onChange={(e) => setExpiryDate(e.target.value)}
        className="w-full p-2 border rounded-lg"
      />
      {isSaving && <p className="text-gray-500 text-sm">Saving...</p>}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition"
        >
          Save
        </button>
        <button onClick={onClose} className="bg-gray-400 text-white px-3 py-2 rounded-lg">
          Cancel
        </button>
      </div>
    </div>
  );
};


export default TaskForm;
