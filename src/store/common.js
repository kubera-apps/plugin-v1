import { create } from "zustand";

export const useCommonStore = create((set) => ({
  pageData: undefined,
  pluginData: undefined,
  exchangeRate: undefined,
  setPageData: (propertiesToUpdate) =>
    set((state) => ({
      ...state,
      pageData: {
        ...(state.pageData || {}),
        ...propertiesToUpdate,
        // Temporarily setting this value hard-coded
        multipleOption: [
          {
            label: "-1x",
            value: 1,
          },
        ],
      },
    })),
  setPluginData: (propertiesToUpdate) =>
    set((state) => ({
      ...state,
      pluginData: { ...(state.pluginData || {}), ...propertiesToUpdate },
    })),
  setExchangeRate: (exchangeRate) =>
    set((state) => ({
      ...state,
      exchangeRate,
    })),
}));

//////////////////////////////////////////////////////////////////////////////////////////////////
// Using this we can retrieve values from hook as:                                              //
// const appSelector = state => CommonStore.selectors.get(state, ['pageData', 'setPageData']);  //
// const [pageData, setPageData] = CommonStore.useCommonStore(appSelector);                     //
//////////////////////////////////////////////////////////////////////////////////////////////////
export const selectors = {
  get: (state, propertiesArray = Object.keys(state)) => {
    return propertiesArray.map((key) => state[key]);
  },
};
