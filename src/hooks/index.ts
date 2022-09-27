import { useState } from "react";

/**
 * Returns state of a request and function to call it
 * @param fn
 */
export const useRequest = <D, R extends any[]>(
  fn: (...rest: R) => Promise<D>
) => {
  const [data, setData] = useState<D>();
  const [errors, setErrors] = useState(null);
  const [isFetching, setFetching] = useState(false);

  const request = (...rest: Parameters<typeof fn>) => {
    if (isFetching) {
      return;
    }

    setFetching(true);

    return fn(...rest)
      .then((data) => {
        setData(data);
        return data;
      })
      .catch((errors) => {
        setErrors(errors);
      })
      .finally(() => {
        setFetching(false);
      });
  };

  return { request, data, isFetching, errors };
};
