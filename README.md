# set-state-loading

Sets the state of your component as `{loading, data, error}` accordingly as you do an async operation, like fetch.

Sugar for turning all of this:

```js
this.setState({ loading: true })
fetch('/api').then(data => {
  this.setState({ data, loading: null })
}).catch(error => {
  this.setState({ error, loading: null })
})
```
Into this:
```js
setStateLoading.call(this, () => fetch('/api'));
```
And instead of `setState({ loading: true })` it makes it a promise which is more useful.

## Install

```sh
npm install set-state-loading --save
```

## Usage

```js
import setStateLoading from 'set-state-loading';

class MyComponent extends React.Component {
  componentDidMount(){
    setStateLoading.call(this, () => fetch('/data-api'));
    // Must be called with `this`
    // or this::setStateLoading(...) (using ESNext bind::operator)
  }
}
```
This will do the following things in that order:

1. Sets a "loading" state with a promise:

    ```js
    this.setState({loading: <a promise>});
    ```

    This maybe used as an indicator, or awaited upon.

    ```js
    render(){
      if (this.state.loading) {
        ...
      }
    }
    ```
    or
    ```js
    async componentDidUpdate(){
      await this.state && this.state.loading
      // ...
    }
    ```

    The promise will fulfill when the async operation (fetch in this eg.) has been fulfilled or rejected and "loading" state has been removed.

2. When the async operation (fetch in this eg.)'s promise fulfills, it'll remove the loading state and set the data state to the resolved result

    ```js
    this.setState({
      loading: null,
      data: <returned data>
    });
    ```

3. In case of a rejection it'll do the same but with the error

    ```js
    this.setState({
      loading: null,
      error: <caught error>
    });
    ```

### API

```
setStateLoading.call(this, fn [,opts]);

// or using ESNext bind operator

this::setStateLoading.call(fn [,opts]);
```

* **`this`** `[object](required)` The "`this`" of a react-like component. It must have a `setState` method.

* **`fn`** `[function](required)` The main loading function that will either return the `data` or result in `error`. Called with `this` above.

  Note: `fn` will **not be called** if `this.state.loading` is truthy. Therefore `setStateLoading` is safe to be called repeatedly.

* **`opts`** `[object]`

  * **`loading`** `[string](default:'loading')` Label to use when setting the state before the async operation fulfills/rejects.
  * **`data`** `[string](default:'data')` 〃 after the async operation fulfills
  * **`error`** `[string](default:'error')` 〃 〃 rejects

  * **`rejectIfDataContainsError`** `[boolean]` Treat the resolved promise as a rejection **if** the data contains an **`[error]`** property.


  Options may also be configured by attaching to the `setStateLoading.options`

  ```js
  import setStateLoading from 'set-state-loading'

  setStateLoading.options = {loading: 'fetching'}

  setStateLoading.call(this, fn)

  ```
