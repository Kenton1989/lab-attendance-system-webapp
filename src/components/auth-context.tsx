import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { basicAuth, revokeToken } from "../api/auth";
import { User } from "../api/rest";
import { getCurrentUser } from "../api/user";
import { DEFAULT_404_PATH } from "./const";

interface AuthContextType {
  loginPagePath: string;
  user?: User;
  loading: boolean;
  error?: any;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// authentication information provider
export function AuthProvider(
  props: PropsWithChildren<{ loginPagePath: string }>
): JSX.Element {
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);

  // react-router hooks
  const location = useLocation();
  const navigate = useNavigate();

  // If we change page, reset the error state.
  useEffect(() => {
    if (error) setError(null);
  }, [location.pathname]);

  // Check if there is a currently active session
  // when the provider is mounted for the first time.
  //
  // If there is an error, it means there is no session.
  //
  // Finally, just signal the component that the initial load
  // is over.
  useEffect(() => {
    getCurrentUser()
      .then((user) => setUser(user))
      .finally(() => setLoadingInitial(false));
  }, []);

  // Flags the component loading state and posts the login
  // data to the server.
  //
  // Finally, just signal the component that loading the
  // loading state is over.
  const login = useCallback(
    async (
      username: string,
      password: string,
      redirectWhenSuccess?: string
    ): Promise<boolean> => {
      setLoading(true);
      try {
        let success = await basicAuth(username, password);
        if (!success) return false;

        let user = await getCurrentUser();
        setUser(user);

        if (redirectWhenSuccess) {
          navigate(redirectWhenSuccess);
        }

        return true;
      } catch (e) {
        setError(e);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  // Call the logout endpoint and then remove the user
  // from the state.
  const logout = useCallback(
    async (redirectWhenSuccess?: string): Promise<boolean> => {
      setLoading(true);
      try {
        let success = await revokeToken();
        if (!success) return false;

        setUser(undefined);

        if (redirectWhenSuccess) {
          navigate(redirectWhenSuccess);
        }

        return true;
      } catch (e) {
        setError(e);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  // Make the provider update only when it should.
  // We only want to force re-renders if the user,
  // loading or error states change.
  const memoedValue = useMemo<AuthContextType>(
    () => ({
      loginPagePath: props.loginPagePath,
      user,
      loading,
      error,
      login,
      logout,
    }),
    [user, loading, error, props.loginPagePath, login, logout]
  );

  // Only render the underlying app after we
  // assert for the presence of a current user.
  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && props.children}
    </AuthContext.Provider>
  );
}

export type UseAuthOptions = {
  loginRequired?: boolean; // if login is required
  redirectOnNoLogin?: string; // if login is required and user does not log in, where to redirect.
  rolesPermitted?: Array<string>; // if not undefined, role checking is performed. User must have at least one role in the list.
  redirectOnBadRole?: string; // if the user has not permitted role, where to redirect.
};

/**
 * Get the authentication context and perform some checking.
 * Perform redirecting if the auth checking failed.
 *
 * @param options auth checking options
 * @returns authentication context and if all auth checking passed.
 */
export function useAuth(options: UseAuthOptions = {}): {
  auth: AuthContextType;
  authOk: boolean;
} {
  let {
    loginRequired = false, // login is not required by default
    redirectOnNoLogin = undefined, // redirect to authContext.loginPath by default
    rolesPermitted = undefined, // no role checking by default
    redirectOnBadRole = DEFAULT_404_PATH, // redirect to 404 page by default
  } = options;

  if (rolesPermitted !== undefined) {
    loginRequired = true;
  }

  let auth = useContext(AuthContext);
  const navigate = useNavigate();
  let authOk = true;
  let redirect = "";

  if (loginRequired && !auth.user) {
    authOk = false;
    redirect = redirectOnNoLogin ?? auth.loginPagePath;
  } else if (rolesPermitted !== undefined) {
    authOk = auth.user!.roles!.some(({ name }) => {
      return rolesPermitted!.includes(name!);
    });
    redirect = redirectOnBadRole;
  }

  useEffect(() => {
    if (!authOk) {
      navigate(redirect);
    }
  });

  if (auth.error) {
    throw auth.error;
  }

  return { auth, authOk };
}
