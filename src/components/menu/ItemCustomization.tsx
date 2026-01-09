import { Flame, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddOn {
  id: string;
  name: string;
  price: number;
}

interface ItemCustomizationProps {
  spiceLevel: number;
  onSpiceLevelChange: (level: number) => void;
  selectedAddOns: string[];
  onAddOnToggle: (addonId: string) => void;
}

const ADD_ONS: AddOn[] = [
  { id: "extra-sauce", name: "Extra Sauce", price: 50 },
  { id: "cheese", name: "Extra Cheese", price: 100 },
  { id: "fries", name: "Add Fries", price: 150 },
  { id: "coleslaw", name: "Coleslaw", price: 80 },
  { id: "egg", name: "Fried Egg", price: 60 },
];

const SPICE_LEVELS = [
  { level: 0, label: "No Spice", emoji: "🍃" },
  { level: 1, label: "Mild", emoji: "🌶️" },
  { level: 2, label: "Medium", emoji: "🌶️🌶️" },
  { level: 3, label: "Hot", emoji: "🔥" },
];

const ItemCustomization = ({
  spiceLevel,
  onSpiceLevelChange,
  selectedAddOns,
  onAddOnToggle,
}: ItemCustomizationProps) => {
  const getAddOnPrice = (id: string) => ADD_ONS.find((a) => a.id === id)?.price || 0;

  return (
    <div className="space-y-5">
      {/* Spice Level */}
      <div>
        <label className="text-sm font-medium text-foreground/80 mb-3 block flex items-center gap-2">
          <Flame className="w-4 h-4 text-accent" />
          Spice Level
        </label>
        <div className="grid grid-cols-4 gap-2">
          {SPICE_LEVELS.map((s) => (
            <button
              key={s.level}
              onClick={() => onSpiceLevelChange(s.level)}
              className={cn(
                "py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 border",
                spiceLevel === s.level
                  ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                  : "bg-secondary border-border hover:border-primary/50 hover:bg-secondary/80"
              )}
            >
              <span className="block text-base mb-0.5">{s.emoji}</span>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Add-ons */}
      <div>
        <label className="text-sm font-medium text-foreground/80 mb-3 block flex items-center gap-2">
          <Plus className="w-4 h-4 text-primary" />
          Add-ons
        </label>
        <div className="flex flex-wrap gap-2">
          {ADD_ONS.map((addon) => {
            const isSelected = selectedAddOns.includes(addon.id);
            return (
              <button
                key={addon.id}
                onClick={() => onAddOnToggle(addon.id)}
                className={cn(
                  "flex items-center gap-2 py-2 px-3 rounded-full text-xs font-medium transition-all duration-200 border",
                  isSelected
                    ? "bg-primary/20 border-primary text-primary"
                    : "bg-secondary border-border hover:border-primary/50"
                )}
              >
                {isSelected && <Check className="w-3 h-3" />}
                {addon.name}
                <span className="text-foreground/50">+KES {addon.price}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { ADD_ONS };
export default ItemCustomization;
