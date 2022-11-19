import { useMemo, useState } from "react";
import useVersion from "./useVersion";

export interface ConfirmState<D> {
  target: D | null;
  version: number;
  isDone: boolean;
  setTarget: (target: D) => void;
  deleteTarget: () => void;
  setDone: () => void;
}

export default function useConfirm<D>() {
  const [target, setTarget] = useState<D | null>(null);
  const [isDone, setDone] = useState(false);
  const [version, updateVersion] = useVersion();

  return useMemo<ConfirmState<D>>(
    () => ({
      target,
      version,
      isDone,
      setTarget: (target: D) => {
        setDone(false);
        setTarget(target);
      },
      deleteTarget: () => {
        setTarget(null);
      },
      setDone: () => {
        setDone(true);
        updateVersion();
      },
    }),
    [target, version, isDone, updateVersion]
  );
}
