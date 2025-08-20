import type { Source } from "../../store/features/sourcesSlice";
import { SourceCard } from "./SourceCard";

interface SourcesListProps {
  sources: Source[];
  onEdit: (sourceId: string) => void;
  onDelete: (sourceId: string, name: string) => void;
}

export const SourcesList: React.FC<SourcesListProps> = ({
  sources,
  onEdit,
  onDelete,
}) => {
  if (!sources || sources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <p className="text-muted-foreground text-lg mb-6 font-medium">
          ✨ No sources available yet. Click <strong>Add Source</strong> to get
          started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sources.map((source) => (
        <SourceCard
          key={source.id}
          source={source}
          onEdit={() => onEdit(source.id)}
          onDelete={() => onDelete(source.id, source.name)}
        />
      ))}
    </div>
  );
};
