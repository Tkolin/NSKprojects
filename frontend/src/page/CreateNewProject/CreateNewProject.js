import { Button, Steps } from "antd";
import React, { useContext, useEffect, useState } from "react";
import {
  StyledBlockLarge,
  StyledBlockRegular,
} from "../components/style/BlockStyles";
import StageToProjectForm from "../ProjectStagesForm";

import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../../NotificationProvider";
import ProjectForm from "../ProjectForm/Index";
import IrdsProjectForm from "../ProjectIrdsForm";
import ProjectDetails from "./components/ProjectDetails";

const CreateNewProject = ({ project }) => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const { openNotification } = useContext(NotificationContext);

  // const [editProjectId, setProjectId] = useState(projectId);

  // const [updateProject, {data: project, loading}] = useLazyQuery(PROJECTS_QUERY_BY_ID, {
  //     variables: {id: editProjectId},
  //     onCompleted: (data) => {
  //         openNotification('topRight', 'success', `Данные подгружены.`);
  //         console.log(data);
  //         if (current === 0) next()
  //     },
  //     onError: (error) => {
  //         openNotification('topRight', 'error', `Ошибка при загрузке данных: ${error.message}`);
  //     },
  // });
  useEffect(() => {
    setCurrent(0);
  }, []);

  // useEffect(() => {
  //     editProjectId && updateProject();
  // }, [editProjectId]);
  // const {token} = theme.useToken();

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const onChangeStep = (value) => {
    setCurrent(value);
  };

  // const contentStyle = {
  //     lineHeight: '260px',
  //     color: token.colorTextTertiary,
  //     backgroundColor: token.colorFillAlter,
  //     borderRadius: token.borderRadiusLG,
  //     border: `1px dashed ${token.colorBorder}`,
  //     marginTop: 16,
  // };

  return (
    <>
      <Steps
        type="navigation"
        size="small"
        current={current}
        // onChange={onChangeStep}
        className="site-navigation-steps"
        items={[
          {
            title: "Этап 1",
            status: "Требует сохранения",
            description: "Заполнение основной информации.",
          },
          {
            title: "Этап 2",
            status: "Требует сохранения",
            description: "Указание этапов проекта.",
          },
          {
            title: "Этап 3",
            status: "Требует сохранения",
            description: "Указание ИРД по проекту.",
          },
          {
            title: "Этап 4",
            status: "Требует сохранения",
            description: "Вывод документов.",
          },
        ]}
      />
      <div style={contentStyle}>
        {current === 0 ? (
          <StyledBlockRegular label={"Основные данные об проекте"}>
            <ProjectForm
              onCompleted={(value) => {
                setProjectId(value.id);
                next();
              }}
              project={project?.projects?.items[0] ?? null}
            />
          </StyledBlockRegular>
        ) : current === 1 ? (
          <StyledBlockLarge label={"Этапы"}>
            <StageToProjectForm
              onCompleted={() => next()}
              project={project?.projects?.items[0] ?? null}
            />
          </StyledBlockLarge>
        ) : current === 2 ? (
          <StyledBlockLarge label={"Ирд"}>
            <IrdsProjectForm
              onCompleted={() => next()}
              project={project?.projects?.items[0] ?? null}
            />
          </StyledBlockLarge>
        ) : current === 3 ? (
          <>
            <ProjectDetails project={project.projects.items[0]} />
          </>
        ) : (
          <></>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
        {current < 4 - 1 && (
          <Button type="primary" onClick={() => next()}>
            Вперёд
          </Button>
        )}
        {current === 4 - 1 && (
          <Button
            type="primary"
            onClick={() => {
              // setProjectId(null);
              setCurrent(0);
              navigate("/reports/project");
            }}
          >
            Завершить
          </Button>
        )}
        {/*{current > 0 && (*/}
        {/*    // <Button*/}
        {/*    //     style={{*/}
        {/*    //         margin: '0 8px',*/}
        {/*    //     }}*/}
        {/*    //     onClick={() => prev()}*/}
        {/*    // >*/}
        {/*    //     Назад*/}
        {/*    // </Button>*/}
        {/*)}*/}
      </div>
    </>
  );
};

export default CreateNewProject;
