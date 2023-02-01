import {
  BarChartOutlined,
  CalendarOutlined,
  CarryOutOutlined,
  DatabaseOutlined,
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { MenuProps } from "antd";
import { useMemo } from "react";
import { matchRoutes, useLocation } from "react-router-dom";
import { userHasRole } from "../../api";
import { useAuth } from "../auth-context";

type AntMenuItem = Required<MenuProps>["items"][number] & { key: string };

export type NavTabConfig = {
  permittedRoles?: string[];
  item: AntMenuItem;
};

export type NavConfig = {
  tabItems: Array<NavTabConfig>;
};

function makeAntItem(
  label: React.ReactNode,
  key: string,
  icon?: React.ReactNode,
  children?: AntMenuItem[],
  type?: "group"
): AntMenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

function makeItem(
  label: React.ReactNode,
  key: string,
  icon?: React.ReactNode,
  permittedRoles?: string[],
  children?: AntMenuItem[],
  type?: "group"
): NavTabConfig {
  return {
    permittedRoles,
    item: makeAntItem(label, key, icon, children, type),
  };
}

const CONFIG: NavConfig = {
  tabItems: [
    makeItem("Home", "/home", <HomeOutlined />, undefined),
    makeItem("Courses", "/courses", <DatabaseOutlined />, ["staff"]),
    makeItem("Groups", "/groups", <DatabaseOutlined />, []),
    makeItem("Sessions", "/sessions", <DatabaseOutlined />, []),
    makeItem("Attendances", "/student-attendances", <CarryOutOutlined />, [
      "staff",
    ]),
    makeItem("TA Attendances", "/teacher-attendances", <CarryOutOutlined />, [
      "staff",
    ]),
    makeItem("Users", "/users", <UserOutlined />, []),
    makeItem("Weeks", "/weeks", <CalendarOutlined />, []),
    makeItem("Statistics", "/attendance-statistics", <BarChartOutlined />, [
      "staff",
    ]),
    makeItem("Preferences", "/preferences", <SettingOutlined />, []),
    makeItem(
      "My Attendances",
      "/my-student-attendances",
      <CarryOutOutlined />,
      ["student"]
    ),
    makeItem(
      "My TA Attendances",
      "/my-teacher-attendances",
      <CarryOutOutlined />,
      ["teacher"]
    ),
  ],
};

const NO_ITEM: AntMenuItem[] = [];

export function useAntMenuItems(): AntMenuItem[] {
  const { auth } = useAuth();

  const res = useMemo((): AntMenuItem[] => {
    if (auth.loading || auth.user === undefined) {
      return NO_ITEM;
    }

    return CONFIG.tabItems.reduce((previous, current) => {
      if (
        current.permittedRoles === undefined ||
        userHasRole(auth.user, ["admin", ...current.permittedRoles])
      ) {
        return [...previous, current.item];
      }

      return previous;
    }, new Array<AntMenuItem>());
  }, [auth.user, auth.loading]);
  return res;
}

export function useCurrentItemKey(): string | undefined {
  const items = useAntMenuItems();
  const location = useLocation();

  const routes = useMemo(
    () => items.map(({ key }) => ({ path: key })),
    [items]
  );

  const match = useMemo(
    () => matchRoutes(routes, location),
    [routes, location]
  );

  return match?.length ? match[0].route.path : undefined;
}

export default CONFIG;
