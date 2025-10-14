import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Slash } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SearchBarProps {
  onSearch?: (pattern: string, isRegex: boolean, caseInsensitive: boolean) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Search tasks..." }: SearchBarProps) {
  const [searchValue, setSearchValue] = useState("");
  const [isRegex, setIsRegex] = useState(false);
  const [caseInsensitive, setCaseInsensitive] = useState(true);
  const [error, setError] = useState("");

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setError("");

    if (isRegex && value) {
      try {
        new RegExp(value, caseInsensitive ? "i" : "");
        onSearch?.(value, isRegex, caseInsensitive);
      } catch (e) {
        setError("Invalid regex pattern");
      }
    } else {
      onSearch?.(value, isRegex, caseInsensitive);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={placeholder}
            className={cn("pl-9", error && "border-destructive")}
            data-testid="input-search"
          />
          {isRegex && (
            <Slash className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch
            id="regex-toggle"
            checked={isRegex}
            onCheckedChange={setIsRegex}
            data-testid="switch-regex"
          />
          <Label htmlFor="regex-toggle" className="text-sm">
            Regex mode
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="case-toggle"
            checked={caseInsensitive}
            onCheckedChange={setCaseInsensitive}
            data-testid="switch-case"
          />
          <Label htmlFor="case-toggle" className="text-sm">
            Case insensitive
          </Label>
        </div>
      </div>
      {error && (
        <p className="text-sm text-destructive" role="status" data-testid="search-error">
          {error}
        </p>
      )}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
