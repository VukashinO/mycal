import React from 'react';

const Search = props => 

     (
      <form onSubmit={props.handleSubmit} style={{textAlign:'center'}}>
            <h3>Search our food database</h3>
             <input  onChange={props.onChange} type="text" value={props.value}
             placeholder="search food"
             />
             <button className="btn btn-primary">submit</button>
           
     </form>
 
    );

export default Search;