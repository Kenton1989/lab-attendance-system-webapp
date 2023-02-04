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

export function useRootPageTitle(newTitle: string | string[]) {
  const { title, setTitle } = useRootPage();

  useEffect(() => {
    let newTitleArr: string[];
    if (Array.isArray(newTitle)) {
      newTitleArr = newTitle;
    } else {
      newTitleArr = [newTitle];
    }

    if (
      newTitleArr.length === title.length &&
      newTitleArr.every((v, i) => v === title[i])
    ) {
      return;
    }

    setTitle(newTitleArr);
  }, [title, newTitle, setTitle]);
}
