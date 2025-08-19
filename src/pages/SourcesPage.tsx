import { SourcesList } from "../components/sources/SourcesList";
import { SourceFormModal } from "../components/sources/SourceFormModal";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { LoadingSpinner } from "../components/shared/LoadingSpinner";
import { useSources } from "../hooks/useSources";
import { Plus } from "react-feather";

export const SourcesPage = () => {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const sources = useSelector((state: RootState) => state.sources.sources);

  const {
    sourcesSlice,
    showForm,
    setShowForm,
    formData,
    setFormData,
    handleAddClick,
    handleEditClick,
    handleFormSubmit,
    handleDeleteClick,
    ConfirmationModalComponent,
  } = useSources();

  if (sourcesSlice.loading) {
    return (
      <div className="p-6">
        <div
          className={`text-center ${darkMode ? "text-white" : "text-gray-900"}`}
        >
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2
          className={`text-3xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Sources
        </h2>
        <button
          onClick={handleAddClick}
          className={`group flex items-center gap-2 px-4 py-2 rounded-xl shadow-md transition-all
    ${
      darkMode
        ? "bg-gray-800 hover:bg-gray-700 text-white"
        : "bg-blue-600 hover:bg-blue-700 text-white"
    }`}
        >
          <Plus className="h-5 w-5 transition-transform group-hover:rotate-90 group-hover:scale-110" />
          <span className="hidden md:inline font-medium">Add Source</span>
        </button>
      </div>

      <SourcesList
        sources={sources}
        darkMode={darkMode}
        onEdit={(sourceId: string) => {
          const source = sources.find((s) => s.id === sourceId);
          if (source) handleEditClick(source);
        }}
        onDelete={(sourceId: string) => {
          const source = sources.find((s) => s.id === sourceId);
          if (source) handleDeleteClick(source);
        }}
      />

      {showForm && (
        <SourceFormModal
          visible={showForm}
          darkMode={darkMode}
          formData={formData} // <-- pass controlled formData
          onChange={setFormData} // <-- pass setter from hook
          onCancel={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {ConfirmationModalComponent}
    </div>
  );
};
