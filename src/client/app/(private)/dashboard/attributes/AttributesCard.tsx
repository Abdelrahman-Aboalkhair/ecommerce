import { ChevronDown, ChevronRight, Plus, Tag, Trash2 } from "lucide-react";
import { useState } from "react";

interface AttributeCardProps {
  attribute: {
    id: string;
    name: string;
    categories?: {
      id: string;
      category?: { name: string };
      isRequired: boolean;
    }[];
    values?: { id: string; value: string }[];
  };
  onDelete: () => void;
  onAddValue: (attributeId: string) => void;
  newValue: string;
  setNewValue: (value: string) => void;
  isCreatingValue: boolean;
  onDeleteValue: (valueId: string) => void;
}

const AttributeCard = ({
  attribute,
  onDelete,
  onAddValue,
  newValue,
  setNewValue,
  isCreatingValue,
  onDeleteValue,
}: AttributeCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddValue = () => {
    onAddValue(attribute.id);
    setShowAddForm(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
      {/* Card Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {attribute.name}
              </h3>
            </div>

            {/* Categories */}
            <div className="space-y-1">
              {(attribute.categories || []).map((catRel) => (
                <div
                  key={catRel.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <Tag size={14} className="text-gray-400" />
                  <span className="font-medium text-gray-700">
                    {catRel.category?.name || "Unknown Category"}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      catRel.isRequired
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {catRel.isRequired ? "Required" : "Optional"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 hover:bg-red-100 text-red-600 rounded-full transition-colors"
              aria-label="Delete attribute"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700">
            Values ({attribute.values?.length || 0})
          </span>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
            aria-label="Add new value"
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        {/* Values Display */}
        {isExpanded && (
          <div className="space-y-2 mb-4">
            {(attribute.values || []).length > 0 ? (
              attribute.values?.map((value) => (
                <div
                  key={value.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-200"
                >
                  <span className="text-sm text-gray-700">{value.value}</span>
                  <button
                    onClick={() => onDeleteValue(value.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full transition-colors"
                    aria-label={`Delete value ${value.value}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">
                No values added yet
              </p>
            )}
          </div>
        )}

        {/* Quick Preview of Values */}
        {!isExpanded && (attribute.values ?? []).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {attribute.values?.slice(0, 3).map((value) => (
              <span
                key={value.id}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {value.value}
              </span>
            ))}
            {(attribute.values ?? []).length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                +{(attribute.values ?? []).length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Add Value Form */}
        {showAddForm && (
          <div className="border-t pt-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Enter value..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                aria-label="New value input"
              />
              <button
                onClick={handleAddValue}
                disabled={isCreatingValue || !newValue.trim()}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                aria-label="Add value"
              >
                {isCreatingValue ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttributeCard;
