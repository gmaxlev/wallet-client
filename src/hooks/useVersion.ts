import { useCallback, useState } from "react";

export default function useVersion() {
  const [state, setState] = useState(1);

  const updateVersion = useCallback(
    () => setState((prevState) => prevState + 1),
    []
  );

  return [state, updateVersion] as [number, () => void];
}
