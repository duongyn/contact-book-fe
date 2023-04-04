import { Menu } from 'antd';

const FilterMenu = data => {
  return <Menu onClick={data.handleFilter} items={data.menuList} />;
};

export default FilterMenu;
