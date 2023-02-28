import { useEffect } from 'react';

const useFilterSearch = (
  stateFilter,
  categoryFilter,
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
    if (localStorage.getItem('defaultList')) {
      nonDefaultData = JSON.parse(localStorage.getItem('nonDefaultList'));
    }
    if (stateFilter === ' ' && categoryFilter === ' ' && searchText === ' ') {
      setDataSource(defaultData);
    }

    if (stateFilter !== ' ' && categoryFilter === ' ' && searchText === ' ') {
      if (stateFilter === 'Waiting for recycling' || stateFilter === 'Recycled') {
        const filteredEvents = nonDefaultData.filter(({ state }) => state === stateFilter);
        setDataSource(filteredEvents);
      } else {
        const filteredEvents = defaultData.filter(({ state }) => state === stateFilter);
        setDataSource(filteredEvents);
      }
    }

    if (stateFilter === ' ' && categoryFilter !== ' ' && searchText === ' ') {
      const filteredEvents = defaultData.filter(({ category }) => category === categoryFilter);
      setDataSource(filteredEvents);
    }

    if (searchText !== ' ') {
      const filteredEvents = defaultData
        .filter(({ assetCode, assetName }) => {
          assetCode = assetCode.toLowerCase();
          assetName = assetName.toLowerCase();
          return (
            assetCode.includes(searchText.toLowerCase()) ||
            assetName.includes(searchText.toLowerCase())
          );
        })
        .concat(
          nonDefaultData.filter(({ assetCode, assetName }) => {
            assetCode = assetCode.toLowerCase();
            assetName = assetName.toLowerCase();
            return (
              assetCode.includes(searchText.toLowerCase()) ||
              assetName.includes(searchText.toLowerCase())
            );
          })
        );
      if (filteredEvents.length === 0) {
        setDataSource(filteredEvents);
        setCustomizeEmpty(true);
      } else {
        setCustomizeEmpty(false);
        setDataSource(filteredEvents);
      }
    }

    if (stateFilter !== ' ' && categoryFilter !== ' ' && searchText === ' ') {
      if (stateFilter === 'Waiting for recycling' || stateFilter === 'Recycled') {
        const filteredEvents = nonDefaultData.filter(
          ({ state, category }) => state === stateFilter && category === categoryFilter
        );
        setDataSource(filteredEvents);
      } else {
        const filteredEvents = defaultData.filter(
          ({ state, category }) => state === stateFilter && category === categoryFilter
        );
        setDataSource(filteredEvents);
      }
    }

    if (stateFilter !== ' ' && searchText !== ' ') {
      if (stateFilter === 'Waiting for recycling' || stateFilter === 'Recycled') {
        const filteredEvents = nonDefaultData.filter(({ state, assetCode, assetName }) => {
          assetCode = assetCode.toLowerCase();
          assetName = assetName.toLowerCase();
          return (
            state === stateFilter &&
            (assetCode.includes(searchText.toLowerCase()) ||
              assetName.includes(searchText.toLowerCase()))
          );
        });
        if (filteredEvents.length === 0) {
          setDataSource(filteredEvents);
          setCustomizeEmpty(true);
        } else {
          setCustomizeEmpty(false);
          setDataSource(filteredEvents);
        }
      } else {
        const filteredEvents = defaultData.filter(({ state, assetCode, assetName }) => {
          assetCode = assetCode.toLowerCase();
          assetName = assetName.toLowerCase();
          return (
            state === stateFilter &&
            (assetCode.includes(searchText.toLowerCase()) ||
              assetName.includes(searchText.toLowerCase()))
          );
        });
        if (filteredEvents.length === 0) {
          setDataSource(filteredEvents);
          setCustomizeEmpty(true);
        } else {
          setCustomizeEmpty(false);
          setDataSource(filteredEvents);
        }
      }
    }

    if (categoryFilter !== ' ' && searchText !== ' ') {
      const filteredEvents = defaultData
        .filter(({ category, assetCode, assetName }) => {
          assetCode = assetCode.toLowerCase();
          assetName = assetName.toLowerCase();
          return (
            category === categoryFilter &&
            (assetCode.includes(searchText.toLowerCase()) ||
              assetName.includes(searchText.toLowerCase()))
          );
        })
        .concat(
          nonDefaultData.filter(({ category, assetCode, assetName }) => {
            assetCode = assetCode.toLowerCase();
            assetName = assetName.toLowerCase();
            return (
              category === categoryFilter &&
              (assetCode.includes(searchText.toLowerCase()) ||
                assetName.includes(searchText.toLowerCase()))
            );
          })
        );
      if (filteredEvents.length === 0) {
        setDataSource(filteredEvents);
        setCustomizeEmpty(true);
      } else {
        setCustomizeEmpty(false);
        setDataSource(filteredEvents);
      }
    }

    if (stateFilter !== ' ' && categoryFilter !== ' ' && searchText !== ' ') {
      if (stateFilter === 'Waiting for recycling' || stateFilter === 'Recycled') {
        const filteredEvents = nonDefaultData.filter(
          ({ state, category, assetCode, assetName }) => {
            assetCode = assetCode.toLowerCase();
            assetName = assetName.toLowerCase();
            return (
              state === stateFilter &&
              category === categoryFilter &&
              (assetCode.includes(searchText.toLowerCase()) ||
                assetName.includes(searchText.toLowerCase()))
            );
          }
        );
        if (filteredEvents.length === 0) {
          setDataSource(filteredEvents);
          setCustomizeEmpty(true);
        } else {
          setCustomizeEmpty(false);
          setDataSource(filteredEvents);
        }
      } else {
        const filteredEvents = defaultData.filter(({ state, category, assetCode, assetName }) => {
          assetCode = assetCode.toLowerCase();
          assetName = assetName.toLowerCase();
          return (
            state === stateFilter &&
            category === categoryFilter &&
            (assetCode.includes(searchText.toLowerCase()) ||
              assetName.includes(searchText.toLowerCase()))
          );
        });
        if (filteredEvents.length === 0) {
          setDataSource(filteredEvents);
          setCustomizeEmpty(true);
        } else {
          setCustomizeEmpty(false);
          setDataSource(filteredEvents);
        }
      }
    }
    setSearchValue('');
  }, [stateFilter, categoryFilter, searchValue, deleteSuccess]);
};

export default useFilterSearch;
