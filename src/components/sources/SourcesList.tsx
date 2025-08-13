import type { Source } from "../../store/features/sourcesSlice";
import { SourceCard } from "./SourceCard";

interface SourcesListProps {
  sources: Source[];
  darkMode: boolean;
  onEdit: (sourceId: string) => void;
  onDelete: (sourceId: string, name: string) => void;
}

export const SourcesList: React.FC<SourcesListProps> = ({
  sources,
  darkMode,
  onEdit,
  onDelete,
}) => {
  if (!sources || sources.length === 0) {
    return (
      <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
        No sources available. Click "Add Source" to create one.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sources.map((source) => (
        <SourceCard
          key={source.id}
          source={source}
          darkMode={darkMode}
          onEdit={() => onEdit(source.id)}
          onDelete={() => onDelete(source.id, source.name)}
        />
      ))}
    </div>
  );
};
