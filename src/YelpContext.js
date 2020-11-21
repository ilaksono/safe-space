import React from 'react';
import useMapData from 'hooks/useMapData';
import useYelpData from "hooks/useYelpData";
import useRefinedData from 'hooks/useRefinedData';
import useApplicationData from 'hooks/useApplicationData';
import useAutoComplete from 'hooks/useAutoComplete';
import useFilter from 'hooks/useFilter';
import useTopSearch from 'hooks/useTopSearch';

export const YelpContext = React.createContext();

export function YelpProvider({ children }) {
  const { filters,
    filterClick,
    resetFilters,
    distanceFilterClick,
    populateCategories,
    getPriceFilterMode,
    setCategoriesSelected } = useFilter();
    
  const {getTops, tops} = useTopSearch();
  const {
    appState,
    submitHandle
  } = useApplicationData();
  const { results,
    setResults,
    yelpSearch,
    businessDetails,
    setBusinessDetails,
    getIndividualBusinessData } = useYelpData();

  const { refinedResults,
    setRefinedSeed,
    applyPriceFilter,
    applyAllFilters,
    applyDistanceFilter } = useRefinedData();
  const { mapState,
    addResults,
    hoverMarker,
    notHoverMarker,
    panTo,
    onUnmount,
    onMapLoad,
    mapRef,
    getCenterPan,
    populateCenter } = useMapData();
  const { autoComplete, resetAutoComplete, yelpAutoComplete } = useAutoComplete();
  return (
    <YelpContext.Provider value={{
      results,
      setResults,
      yelpSearch,
      businessDetails,
      setBusinessDetails,
      getIndividualBusinessData,
      appState,
      submitHandle,
      refinedResults,
      setRefinedSeed,
      applyPriceFilter,
      applyAllFilters,
      applyDistanceFilter,
      mapState,
      addResults,
      autoComplete,
      resetAutoComplete,
      yelpAutoComplete,
      resetFilters,
      filters,
      filterClick,
      distanceFilterClick,
      populateCategories,
      getPriceFilterMode,
      setCategoriesSelected,
      hoverMarker,
      notHoverMarker,
      panTo,
      onUnmount,
      onMapLoad,
      mapRef,
      populateCenter,
      getCenterPan,
      tops,
      getTops
    }}>
      {children}
    </YelpContext.Provider>
  );
}