import { ReactNode, useEffect } from "react";

interface Props {
  children: ReactNode;
  onMount: () => void;
  onDestroyed: () => void;
}

export default function RouteContainer(props: Props) {
  useEffect(() => {
    props.onMount();
    return () => props.onDestroyed();
  });
  return <div>{props.children}</div>;
}
