import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import useRequest from "../../hooks/useRequest";
import UserFriendlyError from "../UserFriendlyError/UserFriendlyError";
import { ConfirmState } from "../../hooks/useConfirm";
import React, { useCallback, useEffect, useState, memo } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";

interface Props {
  confirmState: ConfirmState<any>;
  action: () => unknown;
  header: React.ReactNode;
  label: string;
  name: string;
  content?: React.ReactNode;
  after?: () => unknown;
}

export default memo(function AccountDeleteDialog({
  header,
  content,
  label,
  confirmState,
  after,
  action,
  name,
}: Props) {
  const [input, setInput] = useState("");
  const [confirmed, setConfirm] = useState(false);

  const { t } = useTranslation();

  const { request, isFetching, error, reset } = useRequest(async () => {
    await action();

    try {
      if (after) {
        await after();
      }
    } catch (e) {}

    confirmState.setDone();
  });

  useEffect(() => {
    if (confirmState.target) {
      reset();
      setInput("");
      setConfirm(false);
    }
  }, [confirmState.target, reset]);

  const onClose = useCallback(() => {
    if (!isFetching) {
      confirmState.deleteTarget();
    }
  }, [isFetching, confirmState]);

  const isDisabled = isFetching || confirmState.isDone;

  const confirmedDeleting = input === name;

  return (
    <Dialog
      open={!!confirmState.target && !confirmState.isDone}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>{header}</DialogTitle>
      <DialogContent>
        <UserFriendlyError serverData={error} sx={{ mt: 0 }} />
        {content && <DialogContentText>{content}</DialogContentText>}
        {confirmed && (
          <TextField
            label={label}
            fullWidth
            value={input}
            onChange={(event) => setInput(event.target.value)}
            autoFocus
            disabled={isDisabled}
            sx={{ mt: 3 }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus disabled={isDisabled}>
          {t("strictDeleteDialog.cancel")}
        </Button>

        {confirmed ? (
          <LoadingButton
            onClick={() => request()}
            color={"error"}
            disabled={!confirmedDeleting}
            loading={isDisabled}
            startIcon={<DeleteIcon />}
          >
            {t("strictDeleteDialog.confirm")}
          </LoadingButton>
        ) : (
          <LoadingButton
            onClick={() => setConfirm(true)}
            color={"error"}
            disabled={isDisabled}
            loading={isDisabled}
            startIcon={<DeleteIcon />}
          >
            {t("strictDeleteDialog.remove")}
          </LoadingButton>
        )}
      </DialogActions>
    </Dialog>
  );
});
