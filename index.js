module.exports = setStateLoading;

const defaultPromise = (
  typeof self !== 'undefined' && self.Promise
  || typeof window !== 'undefined' && window.Promise
  || typeof global !== 'undefined' && global.Promise
);

const defaultOpts = {
  loading: 'loading',
  data: 'data',
  error: 'error',
}

function setStateLoading(fn, opts) {
  if (!this.setState) throw new Error('Need a {setState} object as [this]');
  if (typeof fn !== 'function') throw new Error('Need a function');

  const Promise = setStateLoading.Promise || defaultPromise;

  opts = Object.assign({}, defaultOpts, setStateLoading.options, opts);

  if (this.state && this.state[opts.loading]) return this.state[opts.loading];

  let promise = fn.call(this);
  if (!promise || !promise.then) throw new Error('fn must return a promise');

  promise = promise.then(data => {
    if (data[opts.error] && opts.rejectIfDataContainsError) {
      if (data[opts.error] instanceof Error) {
        throw data[opts.error];
      } else {
        return Promise.reject(data);
      }
    }
    const stateArg = {};
    stateArg[opts.data] = data;
    stateArg[opts.loading] = null;
    this.setState(stateArg);
  }).catch(error => {
    const stateArg = {};
    stateArg[opts.error] = error;
    stateArg[opts.loading] = null;
    this.setState(stateArg);
  });

  const stateArg = {};
  if (this.state && this.state[opts.loading])
    stateArg[opts.loading] = this.state[opts.loading].then(() => promise);
  else
    stateArg[opts.loading] = promise;
  this.setState(stateArg);

  return stateArg[opts.loading];
}