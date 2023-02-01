import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { useAntMenuItems, useCurrentItemKey } from "./nav-config";
export function NavBar(props: {}) {
  const items = useAntMenuItems();
  const currentItem = useCurrentItemKey();
  const navigate = useNavigate();

  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={["4"]}
      items={items}
      onClick={({ key }) => {
        navigate(key);
      }}
      selectable={false}
      selectedKeys={currentItem ? [currentItem] : []}
    />
  );
}
