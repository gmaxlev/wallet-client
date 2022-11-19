import React, { useCallback, useEffect, useState } from "react";
import { Box } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { LoadingButton } from "@mui/lab";
import { PaginatedResponse } from "../../api/types";
import UserFriendlyError from "../UserFriendlyError/UserFriendlyError";

interface Props<T extends PaginatedResponse<unknown[]>> {
  initialData: T;
  update: (page: number) => Promise<T>;
  children: (data: T["data"]) => JSX.Element | JSX.Element[];
}

export default function ScrollPagination<
  T extends PaginatedResponse<unknown[]>
>({ children, initialData, update }: Props<T>) {
  const [error, setError] = useState<unknown>(null);
  const [data, setData] = useState(initialData);
  const [items, setItems] = useState<T["data"]>([]);
  const [isFetching, setFetching] = useState(false);

  const updateData = useCallback(async () => {
    setFetching(true);
    setError(null);
    try {
      setData(await update(data.page + 1));
    } catch (e) {
      setError(e);
      setFetching(false);
    }
  }, [data, update]);

  useEffect(() => {
    setItems((current) => {
      return current.concat(data.data);
    });
    setFetching(false);
  }, [data]);

  return (
    <>
      {children(items)}
      {!data.isFinish && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            m: 3,
            width: "100%",
          }}
        >
          <UserFriendlyError
            serverData={error}
            sx={{ width: "100%" }}
            unknownMessage="Не вдалося завантажити"
          />
          <LoadingButton
            variant={"outlined"}
            startIcon={<RefreshIcon />}
            onClick={updateData}
            disabled={isFetching}
            loading={isFetching}
          >
            Завантажити ще ({data.rest})
          </LoadingButton>
        </Box>
      )}
    </>
  );
}
