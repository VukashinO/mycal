import React from 'react';
import './Search.css';

const Search = props =>

    (
        <form onSubmit={props.handleSubmit} className="searchField" style={{ margin: 'auto', maxWidth: '300px', padding: '10px' }}>

            <input onChange={props.onChange} type="text" value={props.value}
                placeholder="search food"
            />
            <button><i className="fa fa-search"></i></button>

        </form>

    );

export default Search;