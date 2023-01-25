import React, {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { basicAuth, getToken, revokeToken } from "../api/auth";
import { User } from "../api/rest";
import { getCurrentUser } from "../api/user";

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
  async function login(
    username: string,
    password: string,
    redirectWhenSuccess?: string
  ): Promise<boolean> {
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
  }

  // Call the logout endpoint and then remove the user
  // from the state.
  async function logout(redirectWhenSuccess?: string): Promise<boolean> {
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
  }

  // Make the provider update only when it should.
  // We only want to force re-renders if the user,
  // loading or error states change.
  //
  // Whenever the `value` passed into a provider changes,
  // the whole tree under the provider re-renders, and
  // that can be very costly! Even in this case, where
  // you only get re-renders when logging in and out
  // we want to keep things very performant.
  const memoedValue = useMemo<AuthContextType>(
    () => ({
      loginPagePath: props.loginPagePath,
      user,
      loading,
      error,
      login,
      logout,
    }),
    [user, loading, error, props.loginPagePath]
  );

  // Only render the underlying app after we
  // assert for the presence of a current user.
  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && props.children}
    </AuthContext.Provider>
  );
}

/**
 * get the authentication context
 * @returns authentication context
 */
export function useAuth() {
  return useContext(AuthContext);
}

/**
 * Get the authentication context if the user is login.
 * Otherwise, redirect to the login page. The login page
 * can be defined in the properties of {@link AuthProvider}.
 *
 * @param loginPagePath the path to the login page
 * @returns authentication context
 */
export function useRequireLogin() {
  const navigate = useNavigate();
  let res = useContext(AuthContext);

  useEffect(() => {
    if (!res.user) {
      navigate(res.loginPagePath);
    }
  }, [res.user, navigate, res.loginPagePath]);
  return res;
}
