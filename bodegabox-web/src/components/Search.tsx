import { useEffect, useRef, useState } from "react";
import { Option } from "../types";

type SearchProps = {
    searchRef: React.RefObject<HTMLInputElement | null>;
    search: string;
    setSearch: (value: string) => void;
    setSelected: (selected: any | null) => void;
    searchMethod: (input: string) => Promise<Option[]>;
    noResultsMessage?: string;
    noResultsAction?: () => void;
};

export function Search({ searchRef, search, setSearch, setSelected, searchMethod, noResultsMessage, noResultsAction }: SearchProps) {
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const [results, setResults] = useState<Option[]>([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if(search.trim().length < 2) {
            setResults([]);
            return;
        }
        const delayDebounce = setTimeout(() => {
        setLoading(true);
        searchMethod(search)
            .then(data => setResults(data))
            .catch(error => console.error("Failed Search:", error))
            .finally(() => setLoading(false));
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [search]);

    return (
        <div style={{ position: "relative" }} ref={searchContainerRef}>
            <input
                type="search"
                placeholder="Type to Search..."
                value={search}
                ref={searchRef}
                onChange={(e) => {
                    setSelected(null);
                    setSearch(e.target.value);
                    setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                className="input-field"
            />
            {showResults && (
                <div className="floating-results">
                {loading ? (
                    <div>Loading...</div>
                ) : (
                        <ul>
                            {search.length >= 2 ? 
                                results.length > 0 ?
                                results.map((result) => (
                                    <li 
                                        key={result.value} 
                                        onClick={() => {
                                            setSelected(result.obj? result.obj : result.value);
                                            setSearch(result.label);
                                            setShowResults(false);
                                        }}
                                    >{result.label}</li>
                                ))
                                :
                                <li onClick={noResultsAction ? () => {noResultsAction(); setShowResults(false);} : () => {}}>
                                    {noResultsMessage ? noResultsMessage : 'No Results...'}
                                </li>
                                :
                                null
                            }
                        </ul>
                )}
                </div>
            )}
        </div>
    );
}