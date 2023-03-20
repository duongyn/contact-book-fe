import { useEffect } from 'react';

const useFilterSearch = (
  searchText,
  searchValue,
  deleteSuccess,
  setSearchValue,
  setDataSource,
  setCustomizeEmpty
) => {
  let defaultData = [];
  let nonDefaultData = [];
  useEffect(() => {
    if (localStorage.getItem('defaultList')) {
      defaultData = JSON.parse(localStorage.getItem('defaultList'));
    }
    if (localStorage.getItem('nonDefaultList')) {
      nonDefaultData = JSON.parse(localStorage.getItem('nonDefaultList'));
    }
    if (searchText.length == 0) {
      setDataSource(defaultData);
    }

    if (searchText !== ' ') {
      const filteredEvents = defaultData
        .filter(({subjectName }) => {
          subjectName = subjectName.toLowerCase();
          return (
            subjectName.includes(searchText.toLowerCase())
          );
        });
      if (filteredEvents.length == 0) {
        setDataSource(filteredEvents);
        setCustomizeEmpty(true);
      } else {
        setCustomizeEmpty(false);
        setDataSource(filteredEvents);
      }
    }

  }, [searchValue, deleteSuccess]);
};

export default useFilterSearch;
