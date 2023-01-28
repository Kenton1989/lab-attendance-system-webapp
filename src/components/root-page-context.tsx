import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type RootPageContextType = {
  title: string[];
  setTitle: (title: string[]) => unknown;
};

const RootPageContext = createContext<RootPageContextType>({
  title: [],
  setTitle: () => {},
});

export function RootPageContextProvider(props: PropsWithChildren<{}>) {
  const [title, setTitle] = useState<string[]>([]);
  const value = useMemo(
    () => ({
      title,
      setTitle,
    }),
    [title, setTitle]
  );

  return (
    <RootPageContext.Provider value={value}>
      {props.children}
    </RootPageContext.Provider>
  );
}

export function useRootPage() {
  return useContext(RootPageContext);
}

export function useRootPageTitle(title: string | string[]) {
  const { setTitle } = useRootPage();

  useEffect(() => {
    if (Array.isArray(title)) {
      setTitle(title);
    } else {
      setTitle([title]);
    }
  }, [title, setTitle]);
}
