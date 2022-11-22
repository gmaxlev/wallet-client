import { useFormik } from "formik";
import * as Yup from "yup";
import CategoryNameValidation from "../validations/category.name.validation";
import CategoryDescriptionValidation from "../validations/category.description.validation";
import useRequest from "../../../hooks/useRequest";
import { useInject } from "../../../ioc/container";
import { CategoriesService } from "../services/CategoriesService";
import CategoryDto from "../../../api/resources/category/Category.dto";
import { Alert, Box, Button, FormGroup, TextField } from "@mui/material";
import { getValidationFieldProps } from "../../../common/validation-utils";
import { LoadingButton } from "@mui/lab";
import AddIcon from "@mui/icons-material/Add";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CategoryUpdateDto from "../../../api/resources/category/CategoryUpdate.dto";
import UserFriendlyError from "../../../components/UserFriendlyError/UserFriendlyError";
import DeleteIcon from "@mui/icons-material/Delete";
import useConfirm from "../../../hooks/useConfirm";
import CategoryDeleteDialog from "./CategoryDeleteDialog";
import { useNavigate } from "react-router-dom";
import { RoutingService } from "../../../router/RoutingService";

interface Props {
  category: CategoryDto;
}

export default function CategoryEditControl({ category }: Props) {
  const { t } = useTranslation("app");

  const confirm = useConfirm<CategoryDto>();

  const categoriesService = useInject<CategoriesService>(CategoriesService);
  const routingService = useInject<RoutingService>(RoutingService);

  const navigate = useNavigate();

  const { request, isFetching, error, data } = useRequest(
    async (data: CategoryUpdateDto) => {
      return await categoriesService.update(category.id, data);
    }
  );

  const formik = useFormik({
    initialValues: {
      name: category.name,
      description: category.description,
    },
    onSubmit(values) {
      return request(values);
    },
    validationSchema: Yup.object({
      name: CategoryNameValidation,
      description: CategoryDescriptionValidation.validation,
    }),
  });

  useEffect(() => {
    if (data) {
      formik.setValues({
        name: data.data.name,
        description: data.data.description,
      });
    }
  }, [data]);

  const isDisabled = isFetching;

  const afterDelete = useCallback(
    () => navigate(routingService.generatePath("categories")),
    []
  );

  return (
    <>
      <CategoryDeleteDialog confirmState={confirm} after={afterDelete} />
      {data && (
        <Alert severity={"success"} sx={{ mb: 3 }}>
          {t("categories.update.success")}
        </Alert>
      )}
      <UserFriendlyError
        serverData={error}
        unknownMessage={t("categories.update.error")}
        sx={{ mt: 0 }}
      />
      <form onSubmit={formik.handleSubmit}>
        <FormGroup sx={{ mb: 1 }}>
          <TextField
            fullWidth
            label={t("categories.fields.name.label")}
            variant={"outlined"}
            disabled={isDisabled}
            {...getValidationFieldProps(formik, "name")}
            {...formik.getFieldProps("name")}
          />
        </FormGroup>
        <FormGroup sx={{ mb: 1 }}>
          <TextField
            fullWidth
            multiline
            label={t("categories.fields.description.label")}
            variant={"outlined"}
            disabled={isDisabled}
            {...getValidationFieldProps(formik, "description")}
            {...formik.getFieldProps("description")}
          />
        </FormGroup>
        <FormGroup>
          <LoadingButton
            type={"submit"}
            variant={"contained"}
            fullWidth
            size={"large"}
            startIcon={<AddIcon />}
            disabled={isDisabled}
            loading={isDisabled}
          >
            {t("categories.update.button")}
          </LoadingButton>
        </FormGroup>
      </form>
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Button
          variant={"text"}
          color={"error"}
          startIcon={<DeleteIcon />}
          disabled={isDisabled}
          onClick={() => confirm.setTarget(category)}
        >
          {t("categories.update.delete")}
        </Button>
      </Box>
    </>
  );
}
