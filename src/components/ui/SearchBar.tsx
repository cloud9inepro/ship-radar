import { useStore } from '../../store/useStore'
import { Search } from 'lucide-react'

const SearchBar = () => {
  const searchQuery = useStore(state => state.searchQuery)
  const setSearchQuery = useStore(state => state.setSearchQuery)

  return (
    <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
      <Search size={14} className="text-white/40 shrink-0" />
      <input
        type="text"
        placeholder="SEARCH VESSEL"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className="
          w-full bg-transparent text-white text-xs tracking-widest
          placeholder:text-white/30 outline-none
        "
      />
    </div>
  )
}

export default SearchBar