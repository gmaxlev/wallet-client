import { useEffect } from "react";
import { MetaService } from "./MetaService";
import { useInject } from "../ioc/container";

export default function useTitle(title: string) {
  const meta = useInject<MetaService>(MetaService);

  useEffect(() => {
    meta.pushTitle(title);
    document.title = `${meta.titleStack[meta.titleStack.length - 1]} | Wallet`;
    return () => {
      meta.popTitle();
      document.title = `${
        meta.titleStack[meta.titleStack.length - 1]
      } | Wallet`;
    };
  }, [title, meta]);
}
