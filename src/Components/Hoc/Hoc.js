import AuthUserContext from './Context';
import WithAuthentication from './WithAuthentication';
import WithAuthorization from './WithAuthorization';

export { AuthUserContext, WithAuthentication, WithAuthorization };

// App comp can now use the new context to provide the user to the comp that are interested in it