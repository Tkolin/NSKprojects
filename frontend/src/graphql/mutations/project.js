import { gql } from "@apollo/client";

export const ADD_PROJECT_MUTATION = gql`
  mutation AddProject($data: ProjectInput) {
    createProject(data: $data) {
      id
      number
      name
      duration
      date_start
      contract_file_id
      kp_file_id
      prepayment_file_id
      start_file_url
      requirements {
        comment
      }
      prepayment_date
      project_contract_history {
        file_id
        date_document
        type
        number
      }
      project_kp_history {
        file_id
        type
        date_document
        number
      }
      leader {
        id
        passport {
          id
          first_name
          last_name
          patronymic
        }
      }
      organization_customer {
        id
        name
        full_name
      }
      date_first_ird_completed
      type_project_document {
        id
        code
        name
        template_project_id
        group {
          id
          code
          name
        }
      }
      facilities {
        id
        name
        code
        facility_group {
          id
          name
          code
          facility_subselection {
            id
            name
            code
            facility_selection {
              id
              name
              code
            }
          }
        }
      }
      date_signing
      date_start
      date_end
      prepayment
      status {
        name
        name_key
      }
      date_completion
      delegations {
        id
        first_name
        last_name
        patronymic
      }

      project_irds {
        id
        stage_number
        application_project
        ird {
          id
          name
        }
        received_date
        is_broken
        is_viewed
        acceptance_date
      }
      project_stages {
        number
        stage {
          id
          name
          task_id
        }
        date_start
        duration
        offset
        date_end
        percent
        price
        payment_file_id
        work_act_file_id
        payment_date
        work_act_singing_date
      }
      project_tasks {
        id
        work_hours
        project_id
        task_id
        is_delay
        status
        task {
          id
          name
        }
        project_task_inherited_id
        date_start
        date_end
        offset
        duration
        executor_orders {
          id
          number
        }
        stage_number
        executor {
          id
          passport {
            id
            first_name
            last_name
            patronymic
          }
        }
        price
        description
      }
      price
    }
  }
`;

export const UPDATE_PROJECT_MUTATION = gql`
  mutation UpdateProject($id: ID, $data: ProjectInput) {
    updateProject(id: $id, data: $data) {
      id
      number
      name
      duration
      date_start
      contract_file_id
      kp_file_id
      prepayment_file_id
      start_file_url
      requirements {
        comment
      }
      prepayment_date
      project_contract_history {
        file_id
        date_document
        type
        number
      }
      project_kp_history {
        file_id
        type
        date_document
        number
      }
      leader {
        id
        passport {
          id
          first_name
          last_name
          patronymic
        }
      }
      organization_customer {
        id
        name
        full_name
      }
      date_first_ird_completed
      type_project_document {
        id
        code
        name
        template_project_id
        group {
          id
          code
          name
        }
      }
      facilities {
        id
        name
        code
        facility_group {
          id
          name
          code
          facility_subselection {
            id
            name
            code
            facility_selection {
              id
              name
              code
            }
          }
        }
      }
      date_signing
      date_start
      date_end
      prepayment
      status {
        name
        name_key
      }
      date_completion
      delegations {
        id
        first_name
        last_name
        patronymic
      }

      project_irds {
        id
        stage_number
        application_project
        ird {
          id
          name
        }
        received_date
        is_broken
        is_viewed
        acceptance_date
      }
      project_stages {
        number
        stage {
          id
          name
          task_id
        }
        date_start
        duration
        offset
        date_end
        percent
        price
        payment_file_id
        work_act_file_id
        payment_date
        work_act_singing_date
      }
      project_tasks {
        id
        work_hours
        project_id
        task_id
        is_delay
        status
        task {
          id
          name
        }
        project_task_inherited_id
        date_start
        date_end
        offset
        duration
        executor_orders {
          id
          number
        }
        stage_number
        executor {
          id
          passport {
            id
            first_name
            last_name
            patronymic
          }
        }
        price
        description
      }
      price
    }
  }
`;
export const SET_IRD_TEMPLATE_TO_PROJECT_MUTATION = gql`
  mutation SetIrdTempProject($projectId: ID!, $templateProjectId: ID!) {
    setTemplateProjectIrds(
      projectId: $projectId
      templateProjectId: $templateProjectId
    ) {
      id
      project_stages {
        project_id
        stage_id
        number
        stage {
          id
          name
        }
        date_start
        duration
        date_end
        percent
        price
      }
    }
  }
`;
export const PROJECT_TS_SYNC_MUTATION = gql`
  mutation ProjectTSChapterSync($projectId: ID!, $chapterIds: [ID]!) {
    projectTSChapterSync(projectId: $projectId, chapterIds: $chapterIds) {
      id
    }
  }
`;

export const SET_STAGE_TEMPLATE_TO_PROJECT_MUTATION = gql`
  mutation SetStageTempProject($projectId: ID!, $templateProjectId: ID!) {
    setTemplateProjectStages(
      projectId: $projectId
      templateProjectId: $templateProjectId
    ) {
      id
      project_stages {
        project_id
        stage_id
        number
        stage {
          id
          name
        }
        date_start
        duration
        date_end
        percent
        price
      }
    }
  }
`;
export const PROJECT_TASKS_DETAIL_UPDATE = gql`
  mutation ProjectTaskDetailUpdate($data: TaskToProjectDetailInput!) {
    projectTaskDetailUpdate(data: $data) {
      id
      price
      task_id
      offset
      duration
      work_hours

      executor {
        id
        passport {
          id
          first_name
          last_name
          patronymic
        }
      }
    }
  }
`;
export const PROJECT_TASKS_STRUCTURE_UPDATE = gql`
  mutation ProjectTasksStructureUpdate(
    $data: [TaskToProjectStructureInput]!
    $project_id: ID!
  ) {
    projectTasksStructureUpdate(data: $data, project_id: $project_id) {
      id
      project_tasks {
        id
        work_hours
        is_delay
        task_id
        project_task_inherited_id
        task {
          id
          name
        }
        executor {
          id
          passport {
            first_name
            last_name
            patronymic
          }
        }
        date_start
        duration
        offset
        date_end
        stage_number
      }
    }
  }
`;

export const PROJECT_IRDS_SYNC_MUTATION = gql`
  mutation ProjectIrdsSync($data: [IrdToProjectInput]!) {
    projectIrdsSync(items: $data) {
      id
      project_irds {
        id
        ird_id
        project_id
        ird {
          id
          name
        }
        received_date
        stage_number
        application_project
      }
    }
  }
`;
export const PROJECT_TASK_UP_MUTATION = gql`
  mutation ProjectTaskUp($taskId: ID!) {
    projectTaskUp(taskId: $taskId) {
      id
      status
    }
  }
`;

export const PROJECT_STAGE_SYNC_MUTATION = gql`
  mutation ProjectStagesSync($data: [StageToProjectInput]!) {
    projectStagesSync(items: $data) {
      id
      project_stages {
        stage_id
        project_id
        number
        stage {
          id
          name
          task_id
        }
        date_start
        duration
        date_end
        percent
        price
      }
    }
  }
`;

export const CHANGE_STATUS_PROJECT = gql`
  mutation ProjectStagesSync(
    $projectId: ID!
    $statusKey: String!
    $dateStart: String
  ) {
    changeProjectStatus(
      projectId: $projectId
      statusKey: $statusKey
      dateStart: $dateStart
    ) {
      id
      date_start
      status {
        name_key
        name
      }
      status_id
    }
  }
`;
export const ARCHIVE_PROJECT = gql`
  mutation ProjectStagesSync($projectId: ID!, $date: String) {
    archivingProjectStatus(projectId: $projectId, date: $date) {
      id
      date_start
      status {
        name_key
        name
      }
      status_id
    }
  }
`;
export const UP_STATUS_PROJECT = gql`
  mutation ProjectStagesSync($projectId: ID!, $date: String!) {
    upProjectStatus(projectId: $projectId, date: $date) {
      id
      date_start
      status {
        name_key
        name
      }
      status_id
    }
  }
`;
export const CHANGE_TEMPLATE_TYPE_PROJECT = gql`
  mutation ChangeTemplateTypeProject($typeProject: ID!, $newTemplate: ID!) {
    changeTemplateTypeProject(
      typeProject: $typeProject
      newTemplate: $newTemplate
    ) {
      template_project_id
      id
    }
  }
`;

export const PAYMENT_INVOICE_PROJECT_DOWNLOAD = gql`
  mutation PaymentInvoiceProjectFileDownload(
    $id: ID!
    $stageNumber: ID
    $dateGenerated: String!
  ) {
    projectPaymentInvoiceFileDownload(
      projectId: $id
      stageNumber: $stageNumber
      dateGenerated: $dateGenerated
    ) {
      url
    }
  }
`;

export const ACT_RENDERING_PROJECT_DOWNLOAD = gql`
  mutation ActRenderingProjectFileDownload(
    $id: ID!
    $stageNumber: Int!
    $dateGenerated: String!
  ) {
    projectActRenderingFileDownload(
      projectId: $id
      stageNumber: $stageNumber
      dateGenerated: $dateGenerated
    ) {
      url
    }
  }
`;

export const GENERATED_COMMERCIAL_OFFER_MESSAGE = gql`
  mutation GeneratedCommercialOfferMessage(
    $projectId: ID!
    $dateOffer: String!
    $delegationId: ID!
  ) {
    generatedCommercialOfferMessage(
      projectId: $projectId
      dateOffer: $dateOffer
      delegationId: $delegationId
    ) {
      url
    }
  }
`;

export const TASK_EXECUTOR_CONTRACT_DOWNLOAD = gql`
  mutation TaskExecutorContractDownload($projectTasksIds: [ID]!) {
    taskExecutorContractFileDownload(projectTasksIds: $projectTasksIds) {
      url
    }
  }
`;

// export const STAGE_PROJECT_DOWNLOAD = gql`
//     mutation StageProjectFileDownload($id: ID!) {
//         projectStagesFileDownload(projectId: $id) {
//             url
//         }
//     }
// `;

export const CONTRACT_PROJECT_DOWNLOAD = gql`
  mutation ContractProjectFileDownload($id: ID!) {
    projectOrderFileDownload(projectId: $id) {
      url
    }
  }
`;
export const PROJECT_CONTRACT_GENERATED = gql`
  mutation ProjectContractGenerated($id: ID!, $dateCreateContract: String!) {
    projectContractGenerated(
      projectId: $id
      dateCreateContract: $dateCreateContract
    ) {
      id
      contract_file_id
      project_contract_history {
        file_id
        number
        date_document
      }
    }
  }
`;
