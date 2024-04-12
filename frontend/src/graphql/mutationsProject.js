import {gql} from "@apollo/client";
import ProjectFileDownload from "../page/script/ProjectFileDownload";
import StagesProjectFileDownload from "../page/script/StagesProjectFileDownload";
import React from "react";

export const ADD_PROJECT_MUTATION = gql`
    mutation AddProject(
        $data: ProjectInput
        $tasks: [ProjectTasksInput]
        $stages: [ProjectStageInput]
        $irds: [ProjectIrdInput]
    ) {
        addProject(
            data: $data


            tasks : $tasks
            stages: $stages
            irds: $irds

        ) {
            id
            number
            name
            organization_customer
            {
                id
                name
            }
            type_project_document
            {
                id
                name
            }
            facilities {
                id
                name
                code
                group_facility {
                    id
                    name
                    code
                    subselection_facility {
                        id
                        name
                        code
                        selection_facility {
                            id
                            name
                            code
                        }
                    }
                }
            }
            date_signing
            duration
            date_end
            date_create
            status
            {
                id
                name
            }
            date_completion
            delegations {
                id
                first_name
                last_name
                patronymic
            }
            project_stages {
                id
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
            project_irds {
                id
                stageNumber
                applicationProject
                IRD {
                    id
                    name
                }
                receivedDate
            }
            price
        }
    }
`;
export const UPDATE_PROJECT_MUTATION = gql`
    mutation UpdateProject(
        $data: ProjectInput

        $tasks: [ProjectTasksInput]
        $stages: [ProjectStageInput]
        $irds: [ProjectIrdInput]
    ) {
        updateProject(
            data: $data



            tasks : $tasks
            stages: $stages
            irds: $irds
        ) {
            id
            number
            name
            organization_customer
            {
                id
                name
            }
            type_project_document
            {
                id
                name
            }
            facilities {
                id
                name
                code
                group_facility {
                    id
                    name
                    code
                    subselection_facility {
                        id
                        name
                        code
                        selection_facility {
                            id
                            name
                            code
                        }
                    }
                }
            }
            date_signing
            date_end
            date_create
            duration
            status
            {
                id
                name
            }
            date_completion
            delegations {
                id
                first_name
                last_name
                patronymic
            }
            project_stages {
                id
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
            project_irds {
                id
                stageNumber
                applicationProject
                IRD {
                    id
                    name
                }
                receivedDate
            }
            price
        }
    }
`;
export const UPDATE_IRDS_TO_PROJECT_MUTATION = gql`
    mutation UpdateStagesToProject(
        $data: [IrdToProject]
    ) {
        updateIrdsToProject(
            items: $data
        )
    }
`;

export const UPDATE_STAGES_TO_PROJECT_MUTATION = gql`
    mutation UpdateIrdsToProject(
        $data: [StageToProject]
    ) {
        updateStagesToProject(
            items: $data
        )
    }
`;
export const UPDATE_TASKS_TO_PROJECT_MUTATION = gql`
    mutation UpdateTasksToProject(
        $data: [TasksToProject]
    ) {
        updateTasksToProject(
            items: $data
        )
    }
`;
export const UPDATE_PAYMENTS_TO_PROJECT_MUTATION = gql`
    mutation UpdatePaymentsToProject(
        $ProjectId: ID!,
    ) {
        updatePaymentsToProject(
            project: $ProjectId
        )
    }
`;
export const IRDS_PROJECT_DOWNLOAD = gql`
    mutation IrdsProjectFileDownload(
        $id: ID!,
    ) {
        projectIrdsFileDownload(
            projectId: $id
        )
        {
            url
        }
    }
`;
export const PAYMENT_INVOICE_PROJECT_DOWNLOAD = gql`
    mutation IrdsProjectFileDownload(
        $id: ID!,
        $stageNumber: ID!

    ) {
        projectPaymentInvoiceFileDownload(
            projectId: $id
            stageNumber: $stageNumber

        )
        {
            url
        }
    }
`;
export const ACT_RENDERING_PROJECT_DOWNLOAD = gql`
    mutation IrdsProjectFileDownload(
        $id: ID!,
        $stageNumber: Int
    ) {
        projectActRenderingFileDownload(
            projectId: $id
            stageNumber: $stageNumber

        )
        {
            url
        }
    }`;
export const TASK_EXECUTOR_CONTRACT_DOWNLOAD = gql`
    mutation TaskExecutorContractDownload(
        $projectId: ID!,
        $executorId: ID!
    ) {
        taskExecutorContractFileDownload(
            projectId: $projectId
            executorId: $executorId

        )
        {
            url
        }
    }
`;
export const STAGE_PROJECT_DOWNLOAD = gql`
    mutation ProjectFileDownload(
        $id: ID!,
    ) {
        projectStagesFileDownload(
            projectId: $id
        )
        {
            url
        }
    }
`;
export const CONTRACT_PROJECT_DOWNLOAD = gql`
    mutation StagesProjectFileDownload(
        $id: ID!,
    ) {
        projectOrderFileDownload(
            projectId: $id
        )
        {
            url
        }
    }
`;
