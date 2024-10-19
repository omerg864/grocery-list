import './SearchBar.css';
import { useState } from 'react';
import { IoIosSearch } from "react-icons/io";


interface SearchBarProps {
    onSearch: (search: string) => void
    style?: React.CSSProperties
    placeholder?: string
}
function SearchBar(props: SearchBarProps) {

    const [search, setSearch] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        props.onSearch(e.target.value);
    }

  return (
    <div className="search-bar-wrapper">
        <input placeholder={props.placeholder} style={{...props.style}} className='search-bar' type='text' value={search} onChange={handleChange} />
        <IoIosSearch size={"1.2rem"} className='search-bar-icon'/>
    </div>
  )
}

export default SearchBar