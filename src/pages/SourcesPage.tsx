import { SourcesList } from "../components/sources/SourcesList";
import { SourceFormModal } from "../components/sources/SourceFormModal";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { LoadingSpinner } from "../components/shared/LoadingSpinner";
import { useSources, type SourceFormData } from "../hooks/useSources";

export const SourcesPage = () => {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const sources = useSelector((state: RootState) => state.sources.sources);

  const {
    sourcesSlice,
    showForm,
    setShowForm,
    editingSourceId,
    handleAddClick,
    handleEditClick,
    handleFormSubmit,
    handleDeleteClick,
    ConfirmationModalComponent,
  } = useSources();

  const initialData = editingSourceId
    ? (() => {
        const source = sources.find((s) => s.id === editingSourceId);
        if (!source) return null;
        return {
          name: source.name,
          type: source.type,
          currency: source.currency,
          initial_balance: source.initial_balance,
          notes: source.notes ?? "",
        } as SourceFormData;
      })()
    : null;

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
          className="flex items-center space-x-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
        >
          <span>Add Source</span>
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
          initialData={initialData}
          onCancel={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Render the modal from the hook */}
      {ConfirmationModalComponent}
    </div>
  );
};
