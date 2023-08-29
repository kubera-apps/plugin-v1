import { useEffect } from "react";

import { CommonStore } from "../store";

const appSelector = (state) =>
  CommonStore.selectors.get(state, [
    "pluginData",
    "setPageData",
    "setPluginData",
    "setExchangeRate",
  ]);

export const useMessageListeners = () => {
  const [pluginData, setPageData, setPluginData, setExchangeRate] =
    CommonStore.useCommonStore(appSelector);

  const handleOnFormChange = (propertiesToUpdate) => {
    const value = { ...pluginData, ...propertiesToUpdate };
    window.parent.postMessage(
      {
        type: "set_plugin_data",
        value,
      },
      "*",
    );
  };

  useEffect(() => {
    ///////////////////////////////////////////////////////////////////////
    // For local testing                                                 //
    // This code is to show UI when running app directly (Not in Iframe) //
    ///////////////////////////////////////////////////////////////////////
    if (window === window.top) {
      setTimeout(() => {
        setPageData({
          portfolioId: "446b2f23-e629-44b3-9a87-43dbd0e4c168",
          fundMatchingScores: [
            {
              name: "S&P 500",
              Symbol: "SSO.UP",
              score: 15.731696969266098,
            },
            {
              name: "Nasdaq 100",
              Symbol: "QLD.UP",
              score: 1.9869022245671109,
            },
            {
              name: "Dow Jones",
              Symbol: "DDM.UP",
              score: 1.1197599318118836,
            },
          ],
          longEquityTotal: 30.610317444228087,
          shortEquityTotal: 0.0002633984650126738,
          assetsTotal: 57.9630071434058,
          cashOnHand: 14.147647668791766,
          currencySymbol: "฿",
        });
      }, 300);
    }
    ///////////////////////////////////////////////////////////////////////

    // Handle Request Data
    window.parent.postMessage(
      {
        type: "get_plugin_data",
        iframeHeight: 800,
      },
      "*",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Handle Receive Data
    const onReceiveMessage = (e) => {
      if (e.data) {
        // eslint-disable-next-line default-case
        switch (e.data.type) {
          case "response_get_plugin_data":
            console.log("plugin:::response_get_plugin_data", e.data);
            setPageData(e.data.value);
            setExchangeRate(e.data.exchangeRate);
            setPluginData(e.data.pluginData);
            break;
        }
      }
    };
    window.addEventListener("message", onReceiveMessage, false);

    return () => {
      window.removeEventListener("message", onReceiveMessage, false);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return handleOnFormChange;
};
