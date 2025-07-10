/**
 * AppMenu.tsx
 *
 * Responsive navigation menu component using Ant Design Menu and Drawer.
 * Handles navigation between main app pages and adapts to mobile/desktop layouts.
 * Used in the App header.
 */
import { Menu, Drawer, Button, Grid } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMemo, useState } from 'react';

interface MenuItem {
  label: string;
  key: string;
}

interface AppMenuProps {
  items: MenuItem[];
}

const { useBreakpoint } = Grid;

const AppMenu: React.FC<AppMenuProps> = ({ items }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const selectedKey = useMemo(() => {
    const found = items.find(item => item.key === location.pathname);
    return found ? found.key : '/';
  }, [location.pathname, items]);

  if (!screens.md) {
    return (
      <>
        <Button
          type="text"
          icon={<MenuOutlined style={{ color: '#fff', fontSize: 24 }} />}
          onClick={() => setDrawerOpen(true)}
          style={{ marginLeft: 0 }}
        />
        <Drawer
          title="Menu"
          placement="left"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          styles={{ body: { padding: 0 } }}
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={items}
            onClick={({ key }) => {
              setDrawerOpen(false);
              navigate(key);
            }}
          />
        </Drawer>
      </>
    );
  }

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[selectedKey]}
      items={items}
      onClick={({ key }) => navigate(key)}
      style={{ minWidth: 0, flex: 1 }}
    />
  );
};

export default AppMenu; 