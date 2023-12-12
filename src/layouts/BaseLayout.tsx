import type { SyntheticEvent, ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { Tabs, Tab, Box, Typography, Link } from '@mui/material';
import { styled } from '@mui/material/styles';

import ActionMenu from '@/components/menus/ActionMenu';
import WeiGangLogo from '@/components/WeiGangLogo';

import RouterConfig from '@/routers/router.config';
import type { TabMenuItems } from '@/types/router.type';

const StyledTabs = styled(Tabs)(() => ({
  '.MuiTabs-indicator': {
    backgroundColor: 'inherit',
  },
  button: {
    fontWeight: 700,
  },
}));

export default function BaseLayout({ children }: { children?: ReactNode }) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [Menus, SetMenus] = useState<TabMenuItems[]>([]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };
  const initMenus = () => {
    const menuList: TabMenuItems[] | undefined = RouterConfig[0]?.children?.map(
      ({ label = t('baseLayout.menu', '菜单'), path, redirect }) => {
        return {
          label: label,
          path,
          onClick: () => {
            navigate(redirect || path);
          },
        };
      },
    );

    SetMenus(menuList || []);
  };
  useEffect(() => {
    initMenus();
  }, []);
  useEffect(() => {
    const idx = Menus.findIndex((item) => item.path === location.pathname);
    setSelectedTab(idx >= 0 ? idx : 0);
  }, [location, Menus]);

  return (
    <Box className="pt2 px4 flex flex-col" style={{ backgroundColor: '#dde9ff' }}>
      <ActionMenu className="sticky top-0 flex-basis-30px z2" style={{ backgroundColor: '#dde9ff' }}></ActionMenu>
      <Box className="flex-1 flex-basis-[calc(100vh-72px)] flex flex-col">
        <Box className="flex justify-between">
          <StyledTabs
            value={selectedTab}
            onChange={handleChange}
            variant="scrollable"
            aria-label="scrollable auto tabs"
          >
            {Menus.map((item: TabMenuItems, idx: number) => (
              <Tab
                onClick={item.onClick}
                key={idx}
                label={item.label}
                sx={idx == selectedTab ? { backgroundColor: '#f8f9fd' } : {}}
                className={idx == selectedTab ? 'rounded-t-md!' : ''}
              />
            ))}
          </StyledTabs>

          <WeiGangLogo className="-top-16px relative z2 hidden sm:block" />
        </Box>

        <Outlet />
        {children}
      </Box>
      <Box className="flex-basis-20px flex justify-center items-center py2 box-border flex-wrap">
        <Typography mr={1} sx={{ color: 'text.secondary' }}>
          {t('baseLayout.footer.powered', '@浙江炜冈科技股份有限公司 版权所有')}
        </Typography>
        <Typography mr={1} sx={{ color: 'text.secondary' }}>
          {t('baseLayout.footer.tel', '电话：0577-63170107')}
        </Typography>
        <Typography mr={1} sx={{ color: 'text.secondary' }}>
          <Link href="mailto:weigang@weigang.cc" underline="none">
            {t('baseLayout.footer.mail', '邮箱：weigang@weigang.cc')}
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
