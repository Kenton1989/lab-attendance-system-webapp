import {
  BarChartOutlined,
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
    makeItem("Courses", "/courses", <DatabaseOutlined />, ["admin", "staff"]),
    makeItem("Groups", "/groups", <DatabaseOutlined />, ["admin", "staff"]),
    makeItem("Sessions", "/sessions", <DatabaseOutlined />, ["admin", "staff"]),
    makeItem("Attendances", "/student_attendances", <CarryOutOutlined />, [
      "admin",
      "staff",
    ]),
    makeItem("Attendances (TA)", "/teacher_attendances", <CarryOutOutlined />, [
      "admin",
      "staff",
    ]),
    makeItem("Users", "/users", <UserOutlined />, ["admin", "staff"]),
    makeItem("Statistics", "/attendance_statistics", <BarChartOutlined />, [
      "admin",
      "staff",
    ]),
    makeItem("Settings", "/settings", <SettingOutlined />, ["admin", "staff"]),
    makeItem(
      "My Attendances",
      "/my_student_attendances",
      <CarryOutOutlined />,
      ["student"]
    ),
    makeItem(
      "My Attendances (TA)",
      "/my_teacher_attendances",
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
        userHasRole(auth.user, current.permittedRoles)
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
