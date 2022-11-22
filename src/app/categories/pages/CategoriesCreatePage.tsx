import { useTranslation } from "react-i18next";
import useTitle from "../../../meta/useTitle";
import { useInject } from "../../../ioc/container";
import { CategoriesService } from "../services/CategoriesService";
import { useFormik } from "formik";
import CategoryNameValidation from "../validations/category.name.validation";
import CategoryDescriptionValidation from "../validations/category.description.validation";
import useRequest from "../../../hooks/useRequest";
import CategoryCreateDto from "../../../api/resources/category/CategoryCreate.dto";
import CustomBreadcrumbs from "../../../components/CustomBreadcrumbs/CustomBreadcrumbs";
import React, { useMemo, useState } from "react";
import { Container, FormGroup, Grid, TextField } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { RoutingService } from "../../../router/RoutingService";
import CategoryIcon from "@mui/icons-material/Category";
import { getValidationFieldProps } from "../../../common/validation-utils";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import AddIcon from "@mui/icons-material/Add";
import UserFriendlyError from "../../../components/UserFriendlyError/UserFriendlyError";
import { useNavigate } from "react-router-dom";
export default function CategoriesCreatePage() {
  const { t } = useTranslation("app");

  const [created, setCreated] = useState(false);

  useTitle(t("categories.create.title"));

  const routingService = useInject<RoutingService>(RoutingService);
  const categoriesService = useInject<CategoriesService>(CategoriesService);

  const navigate = useNavigate();

  const { request, isFetching, error } = useRequest(
    async (data: CategoryCreateDto) => {
      const category = await categoriesService.create(data);
      setCreated(true);
      navigate(routingService.generatePath("categories"), {
        state: { created: { id: category.data.id } },
      });
    }
  );

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    onSubmit(values) {
      return request(values);
    },
    validationSchema: Yup.object({
      name: CategoryNameValidation,
      description: CategoryDescriptionValidation.validation,
    }),
  });

  const breadcrumbs = useMemo(
    () => [
      {
        to: routingService.generatePath("categories"),
        text: t("sections.categories"),
        Icon: CategoryIcon,
      },
    ],
    []
  );

  const isDisabled = isFetching || created;

  return (
    <Container>
      <Grid container justifyContent={"center"}>
        <Grid xs={12} md={10} xl={8} item>
          <CustomBreadcrumbs
            chain={breadcrumbs}
            current={t("categories.create.title")}
          />
          <UserFriendlyError
            serverData={error}
            unknownMessage={t("categories.create.error")}
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
                {t("categories.create.button")}
              </LoadingButton>
            </FormGroup>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
}
