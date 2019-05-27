import React from 'react';

const Search = props => 

     (
      <form onSubmit={props.handleSubmit}>
             <input  onChange={props.onChange} type="text" value={props.value}/>
             <button className="btn btn-primary">submit</button>
           
     </form>
 
    );

export default Search;