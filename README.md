## Available Scripts

In the project directory, you can run:

### `npm start` or `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### Deployment `npm run deploy` or `yarn deploy`

This will deploy changes to github

## Code

### Zustand store
To manage state within the code we use Zustand. Path `/store`

To get values/methods from store:
```
  const appSelector = (state) => CommonStore.selectors.get(state, ["pageData", "setPageData"]);

  const AnyComponent = () => {
    const [pageData, setPageData] = CommonStore.useCommonStore(appSelector);
    .
    .
    .
  };
```

## useMessageListeners

This initializes the receive and send message listeners. Returns a method which can be used to send message

```
  const handleOnFormChange = useMessageListeners();

  handleOnFormChange({ a: 1, b: 2 });
```
