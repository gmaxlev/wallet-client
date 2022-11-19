import { AccountDto } from "../../../api/resources/account/Account.dto";
import { useInject } from "../../../ioc/container";
import { ConfirmState } from "../../../hooks/useConfirm";
import { useCallback, useEffect, useState, memo } from "react";
import StrictDeleteDialog from "../../../components/StrictDeleteDialog/StrictDeleteDialog";
import { useTranslation } from "react-i18next";
import { AccountsService } from "../services/AccountsService";

interface Props {
  confirmState: ConfirmState<AccountDto>;
  after?: () => unknown;
}

export default memo(function AccountDeleteDialog({
  confirmState,
  after,
}: Props) {
  const [state, setState] = useState({
    header: "",
    name: "",
  });

  const { t } = useTranslation("app");

  const accountsService = useInject<AccountsService>(AccountsService);

  const action = useCallback(() => {
    return accountsService.remove(confirmState.target?.id as number);
  }, [confirmState.target]);

  useEffect(() => {
    if (confirmState.target) {
      setState({
        header: t("accounts.delete.question", {
          name: confirmState.target.name,
        }),
        name: confirmState.target.name,
      });
    }
  }, [confirmState.target, t]);

  return (
    <StrictDeleteDialog
      confirmState={confirmState}
      action={action}
      after={after}
      header={state.header}
      name={state.name}
      content={
        <>
          {t("accounts.delete.warning")} <br />
          <strong>{t("accounts.delete.warningCancel")}</strong>
        </>
      }
      label={t("accounts.delete.fields.name.label")}
    />
  );
});
