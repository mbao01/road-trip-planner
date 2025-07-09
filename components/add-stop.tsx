"use client"

import type { FC } from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useDebounce } from "@/hooks/use-debounce"
import { searchPlaces, getPlaceDetails, type PlaceSearchResult, type PlaceDetails } from "@/lib/google-maps-api"
import { Loader2, Search, X } from "lucide-react"

interface AddStopProps {
  dayId: number
  onAddStop: (dayId: number, location: PlaceDetails) => void
}

export const AddStop: FC<AddStopProps> = ({ dayId, onAddStop }) => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<PlaceSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingDetails, setIsFetchingDetails] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (debouncedQuery) {
      setIsLoading(true)
      searchPlaces(debouncedQuery)
        .then((res) => {
          setResults(res)
        })
        .catch((err) => {
          console.error("Failed to search places:", err)
          setResults([])
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setResults([])
    }
  }, [debouncedQuery])

  const handleSelect = async (location: PlaceSearchResult) => {
    setIsFetchingDetails(true)
    setQuery(location.name) // Show full name in input
    setResults([]) // Hide results list
    try {
      const details = await getPlaceDetails(location.id)
      onAddStop(dayId, details)
      setQuery("") // Clear input after adding
    } catch (err) {
      console.error("Failed to get place details:", err)
      // Optionally show a toast error to the user
    } finally {
      setIsFetchingDetails(false)
    }
  }

  const showResults = isFocused && (results.length > 0 || isLoading)

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Add stop"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)} // Delay to allow click on results
          className="pl-9"
          disabled={isFetchingDetails}
        />
        {(isLoading || isFetchingDetails) && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
        {query && !isLoading && !isFetchingDetails && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showResults && (
        <Card className="absolute z-10 w-full mt-1 p-2">
          {isLoading ? (
            <div className="flex items-center justify-center p-2">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ul>
              {results.map((location) => (
                <li key={location.id}>
                  <button
                    onMouseDown={() => handleSelect(location)} // use onMouseDown to fire before onBlur
                    className="w-full text-left p-2 rounded-md hover:bg-accent"
                  >
                    {location.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}
    </div>
  )
}
