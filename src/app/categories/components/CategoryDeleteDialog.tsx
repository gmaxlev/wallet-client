import CategoryDto from "../../../api/resources/category/Category.dto";
import { useInject } from "../../../ioc/container";
import { ConfirmState } from "../../../hooks/useConfirm";
import { useCallback, useEffect, useState, memo } from "react";
import StrictDeleteDialog from "../../../components/StrictDeleteDialog/StrictDeleteDialog";
import { useTranslation } from "react-i18next";
import { CategoriesService } from "../services/CategoriesService";

interface Props {
  confirmState: ConfirmState<CategoryDto>;
  after?: () => unknown;
}

export default memo(function CategoryDeleteDialog({
  confirmState,
  after,
}: Props) {
  const [state, setState] = useState({
    header: "",
    name: "",
  });

  const { t } = useTranslation("app");

  const categoriesService = useInject<CategoriesService>(CategoriesService);

  const action = useCallback(() => {
    return categoriesService.remove(confirmState.target?.id as number);
  }, [confirmState.target]);

  useEffect(() => {
    if (confirmState.target) {
      setState({
        header: t("categories.delete.question", {
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
      content={<strong>{t("categories.delete.warningCancel")}</strong>}
      label={t("categories.delete.fields.name.label")}
    />
  );
});
