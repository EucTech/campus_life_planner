import { SearchBar } from "../SearchBar";

export default function SearchBarExample() {
  return (
    <div className="p-4 max-w-2xl">
      <SearchBar
        onSearch={(pattern, isRegex, caseInsensitive) =>
          console.log("Search:", { pattern, isRegex, caseInsensitive })
        }
      />
    </div>
  );
}
