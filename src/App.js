import "./App.css";

import React, { useMemo, useRef } from "react";
import Select from "react-select";
import get from "lodash.get";

import { CommonStore } from "./store";
import { getFormattedValue } from "./utils";
import { useMessageListeners } from "./hooks";

const appSelector = (state) =>
  CommonStore.selectors.get(state, ["pageData", "pluginData", "exchangeRate"]);

function App() {
  const containerRef = useRef();

  // Get methods and values from store
  const [pageData, pluginData, exchangeRate] = CommonStore.useCommonStore(appSelector);
  // Setup message listeners
  const handleOnFormChange = useMessageListeners();

  const indexOptions = useMemo(() => {
    if (!pageData || !Array.isArray(pageData.fundMatchingScores)) return [];
    const sortedArray = [...pageData.fundMatchingScores];
    sortedArray.sort((a, b) => a.score - b.score);
    return sortedArray.map((indexOption, index) => ({
      label: `${indexOption.name}${index === 0 ? " (Recommended)" : ""}`,
      value: indexOption.Symbol,
      sortKey: indexOption.score,
    }));
  }, [pageData]);

  if (!pageData) {
    return "Loading...";
  }

  const exchangeRateValue = get(exchangeRate, "value", 1);
  const hedgeAmount =
    getFormattedValue(get(pluginData, "hedgeAmount", 0), true) * exchangeRateValue;
  const selectedIndexValue = get(pluginData, "selectedIndexValue");
  const currencySymbol = get(pageData, "currencySymbol", "$");

  // Show error if the Hedge Amount entered in form is more than cash in hand
  const cashGreaterError = `${
    hedgeAmount <= getFormattedValue(pageData.cashOnHand, true) ? "" : " error"
  }`;

  // Calculating hedge + short as the Hedge value
  const hedgePlusShort = getFormattedValue(hedgeAmount + pageData.shortEquityTotal, true);

  const handleIndexChange = (option) => {
    handleOnFormChange({ selectedIndexValue: option, hedgeAmount });
  };

  const handleHedgeAmountChange = (e) => {
    handleOnFormChange({ hedgeAmount: getFormattedValue(e.currentTarget.value, true) });
  };

  return (
    <div className="container" ref={containerRef}>
      <div className="left-sub-container">
        <h2>Unhedged</h2>

        <div className="value-label">Portfolio</div>
        <div className="value">
          <span className="currency">{currencySymbol}</span>
          {getFormattedValue(pageData.assetsTotal)}
        </div>

        <div className="value-label">Long Equities</div>
        <div className="value">
          <span className="currency">{currencySymbol}</span>
          {getFormattedValue(pageData.longEquityTotal)}
        </div>

        <div className="value-label">Cash</div>
        <div className="value">
          <span className="currency">{currencySymbol}</span>
          {getFormattedValue(pageData.cashOnHand)}
        </div>

        <div className="horizontal-rule" />

        <div className="value-label">Hedge</div>
        <div className="value">
          <span className="currency">{currencySymbol}</span>
          {getFormattedValue(pageData.shortEquityTotal)}
        </div>

        <div className="horizontal-rule" />

        <div className="value-label">Net Equity Exposure</div>
        <div className="value">
          <span className="currency">{currencySymbol}</span>
          {getFormattedValue(pageData.longEquityTotal - pageData.shortEquityTotal)}
        </div>

        <div className="value-label">% of Equity Hedged</div>
        <div className="value">
          {getFormattedValue((pageData.shortEquityTotal / pageData.longEquityTotal) * 100, true)}%
        </div>

        <div className="value-label">Net Equity, % of Portfolio</div>
        <div className="value" style={{ marginBottom: 0 }}>
          {getFormattedValue(
            ((pageData.longEquityTotal - pageData.shortEquityTotal) / pageData.assetsTotal) * 100,
            true,
          )}
          %
        </div>
      </div>

      <div className="center-sub-container">
        <h3>SET MY HEDGE</h3>
        <div className="value-label-sm">SELECT INDEX</div>
        <Select
          className="react-select"
          classNamePrefix="react-select"
          options={indexOptions}
          defaultValue={indexOptions[0]}
          value={selectedIndexValue || indexOptions[0]}
          sortBy="score"
          onChange={handleIndexChange}
          isSearchable={false}
          isDisabled={indexOptions.length === 0}
        />
        <div className="value-label-sm">LEVERAGE MULTIPLE</div>
        <Select
          className="react-select"
          classNamePrefix="react-select"
          options={get(pageData, "multipleOption", [])}
          defaultValue={get(pageData, "multipleOption[0]")}
          sortBy="score"
          menuIsOpen={false}
          isSearchable={false}
        />
        <div className="value-label-sm">HEDGE AMOUNT</div>
        <input
          className={`plugin-input${cashGreaterError}`}
          value={hedgeAmount ? getFormattedValue(hedgeAmount, true) : ""}
          onChange={handleHedgeAmountChange}
        />
        <div className={`value-label-sm-error${cashGreaterError}`}>
          Should be lesser than available cash
        </div>

        <div className="value-label-sm" style={{ marginBottom: 0 }}>
          FUND FROM
        </div>
        <div className="value-m">
          Cash: {currencySymbol}
          {getFormattedValue(pageData.cashOnHand)}
        </div>
      </div>

      <div className="right-sub-container">
        <h2>Hedged</h2>

        <div className="value-label">Portfolio</div>
        <div className="value">
          <span className="currency">{currencySymbol}</span>
          {getFormattedValue(pageData.assetsTotal)}
        </div>

        <div className="value-label">Long Equities</div>
        <div className="value">
          <span className="currency">{currencySymbol}</span>
          {getFormattedValue(pageData.longEquityTotal)}
        </div>

        <div className="value-label">Cash</div>
        <div className="value">
          <span className="currency">{currencySymbol}</span>
          {getFormattedValue(pageData.cashOnHand - hedgeAmount)}
        </div>

        <div className="horizontal-rule" />

        <div className="value-label">Hedge</div>
        <div className="value">
          <span className="currency">{currencySymbol}</span>
          {getFormattedValue(hedgeAmount + pageData.shortEquityTotal)}
        </div>

        <div className="horizontal-rule" />

        <div className="value-label">Net Equity Exposure</div>
        <div className="value">
          <span className="currency">{currencySymbol}</span>
          {getFormattedValue(pageData.longEquityTotal - hedgePlusShort)}
        </div>

        <div className="value-label">% of Equity Hedged</div>
        <div className="value">
          {getFormattedValue((hedgePlusShort / pageData.longEquityTotal) * 100, true)}%
        </div>

        <div className="value-label">Net Equity, % of Portfolio</div>
        <div className="value" style={{ marginBottom: 0 }}>
          {getFormattedValue(
            ((pageData.longEquityTotal - hedgePlusShort) / pageData.assetsTotal) * 100,
            true,
          )}
          %
        </div>
      </div>
    </div>
  );
}

export default App;
