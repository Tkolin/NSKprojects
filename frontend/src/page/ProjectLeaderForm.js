import { useMutation, useQuery } from "@apollo/client";
import { Card, Divider, Form } from "antd";
import React, { useContext, useEffect } from "react";

import { SET_NEW_PROJECT_LEADER } from "../graphql/mutations/projectSecondaryAtribute";
import { PERSONS_QUERY_COMPACT } from "../graphql/queries/queriesCompact";
import { NotificationContext } from "./../NotificationProvider";
import { CustomAutoComplete } from "./components/style/SearchAutoCompleteStyles";
import { ModalButton } from "./simplesForms/formComponents/ModalButtonComponent";

const ProjectLeaderForm = ({ cardProps, project, onCompleted }) => {
  const permissions = JSON.parse(localStorage.getItem("userPermissions")).map(
    (row) => row.name_key
  );
  // Первичные данные
  const { openNotification } = useContext(NotificationContext);
  const [form] = Form.useForm();
  useEffect(() => {
    if (project?.leader?.id)
      form.setFieldValue("leader", {
        output:
          project?.leader.passport.last_name +
          " " +
          project?.leader.passport.first_name +
          " " +
          project?.leader.passport.patronymic,
        selected: project?.leader.id,
      });
  }, [project]);
  // Данные
  const { data: dataPersons, loading: loadingPersons } = useQuery(
    PERSONS_QUERY_COMPACT
  );
  // Мутация
  const [mutate, { loading: loadingSave }] = useMutation(
    SET_NEW_PROJECT_LEADER,
    {
      onCompleted: (data) => {
        openNotification(
          "topRight",
          "success",
          `Назначен новый ответственный на проекте`
        );
        onCompleted && onCompleted(data?.updateIrd || data?.createIrd);
      },
      onError: (error) => {
        openNotification(
          "topRight",
          "error",
          `Ошибка SET_NEW_PROJECT_LEADER : ${error.message}`
        );
      },
    }
  );

  // Завершение
  const handleSubmit = () => {
    console.log(form.getFieldValue("leader"));
    mutate({
      variables: {
        personId: form.getFieldValue("leader")?.selected,
        projectId: project.id,
      },
    });
  };
  if (permissions.includes("read-project-payments"))
    return (
      <Card
        style={{ width: 400 }}
        {...cardProps}
        actions={[
          <ModalButton
            modalType={"green"}
            isMany={cardProps?.actions}
            loading={loadingSave}
            onClick={() => form.submit()}
            children={`Обновить`}
          />,
          ...(cardProps?.actions ?? []),
        ]}
        children={
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Divider>Назначьте главного на проекте</Divider>
            <Form.Item name={"leader"} label="ГИП">
              <CustomAutoComplete
                loading={loadingPersons}
                typeData="FIO"
                style={{ width: "100%" }}
                placeholder={"Выбор исполнителя..."}
                data={dataPersons?.persons?.items.map((row) => ({
                  ...row.passport,
                  id: row.id,
                }))}
              />
            </Form.Item>
          </Form>
        }
      />
    );
};

export default ProjectLeaderForm;
