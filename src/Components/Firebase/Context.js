import React from 'react';


// createContext() will create 2 contexts:
// 1.FirebaseContext.Provider will cr8 Fb instance at the top lvl of React comp three
// 2. FirebaseContext.Consumer retrive the Fb instance if it's need in the React component 

const FirebaseContext = React.createContext(null);


// it may be simpler to use a higher-order component. 
export const withFirebase = Component => props => (
  <FirebaseContext.Consumer>
    {firebase => <Component {...props} firebase={firebase} />}
  </FirebaseContext.Consumer>
);

export default FirebaseContext;