import { SourcesList } from "../components/sources/SourcesList";
import { SourceFormModal } from "../components/sources/SourceFormModal";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { LoadingSpinner } from "../components/shared/LoadingSpinner";
import { useSources } from "../hooks/useSources";
import { Plus } from "react-feather";

export const SourcesPage = () => {
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
      <div className="p-6 flex items-center justify-center min-h-64">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-muted-foreground mt-4">Loading your sources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-card-foreground">Sources</h2>
        <button
          onClick={handleAddClick}
          className="btn-primary px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
        >
          <Plus className="h-5 w-5 transition-transform group-hover:rotate-90 group-hover:scale-110" />
          <span>Add Source</span>
        </button>
      </div>

      <SourcesList
        sources={sources}
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
          formData={formData}
          onChange={setFormData}
          onCancel={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {ConfirmationModalComponent}
    </div>
  );
};
