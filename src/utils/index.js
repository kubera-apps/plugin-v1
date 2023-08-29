import get from "lodash.get";

export const getFormattedValue = (value, keepAsNumber = false) => {
  const formattedValue = Math.round(value);

  return !isNaN(formattedValue) && isFinite(formattedValue) && formattedValue !== Math.floor(0)
    ? !keepAsNumber
      ? formattedValue.toLocaleString()
      : formattedValue
    : 0;
};

export const isActiveElementInput = () => {
  const activeElementTagName = get(document, "activeElement.tagName");
  console.log("plugin:::useEffect:::handleOnFormChange", activeElementTagName);

  return /input/i.test(activeElementTagName);
};
