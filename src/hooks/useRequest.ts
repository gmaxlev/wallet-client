import { useCallback, useState } from "react";

const useRequest = <P extends unknown[], R extends Promise<unknown>>(
  fn: (...rest: P) => R
) => {
  const [data, setData] = useState<Awaited<R> | undefined>();

  const [error, setError] = useState<unknown>();

  const [isFetching, setFetching] = useState(false);

  const request = useCallback(
    (...rest: P) => {
      if (isFetching) {
        return;
      }

      setData(undefined);

      setError(null);

      setFetching(true);

      return fn(...rest)
        .then((result) => {
          setData(result as any);
          return result as Awaited<R>;
        })
        .catch((e) => {
          setError(e);
        })
        .finally(() => {
          setFetching(false);
        });
    },
    [fn, isFetching]
  );

  const reset = useCallback(() => {
    setData(undefined);
    setError(undefined);
    setFetching(false);
  }, []);

  return {
    request: request as (
      ...rest: Parameters<typeof fn>
    ) => ReturnType<typeof fn>,
    data: data as Awaited<ReturnType<typeof fn>> | undefined,
    isFetching: isFetching as boolean,
    error: error as unknown,
    reset,
  };
};

export default useRequest;
