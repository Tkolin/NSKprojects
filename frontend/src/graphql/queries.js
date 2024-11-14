import { gql } from "@apollo/client";

export const FENRIR_QUERY = gql`
  query FenrirQuery($queryOptions: QueryOptions) {
    fenrirs(queryOptions: $queryOptions) {
      items {
        id
        name
        description
        models
      }
      count
    }
  }
`;
export const CHECK_STATUS_PROJECT_QUERY = gql`
  query CheckStatusProject($projectId: ID) {
    checkStatusProject(projectId: $projectId) {
      id
      title
      type
      content
      link_text
      link_button
    }
  }
`;
export const DELAY_TYPES_QUERY = gql`
  query DelayTypeQuery {
    delayTypes {
      key
      name
      description
      type
      content
      content_number
    }
  }
`;
export const TASKS_QUERY = gql`
  query TasksQuery($queryOptions: QueryOptions) {
    tasks(queryOptions: $queryOptions) {
      items {
        id
        name
      }
      count
    }
  }
`;
export const PROJECT_TASKS_QUERY = gql`
  query ProjectTasksQuery($projectId: ID!) {
    projectTasksQuery(projectId: $projectId) {
      items {
        id
        task {
          id
          name
        }
        date_start
        date_end
        stage_number
        project_task_inherited_id
      }
    }
  }
`;

export const REFERENCES_QUERY = gql`
  query ReferencesQuery($queryOptions: QueryOptions) {
    references(queryOptions: $queryOptions) {
      items {
        id
        name
        content {
          # массив
          key
          name
          value
          description
        }
      }
      count
    }
  }
`;

export const FORMULA_BY_KEY_QUERY = gql`
  query FormulaByKey($keys: [String!]) {
    formulaByKey(keys: $keys) {
      items {
        id
        latex_formula
        original_formula
        rpn_formula
        name_key
        name
        description
        variable_data {
          description
          name_key
          name
          formula_id
          id
        }
      }
      count
    }
  }
`;

export const ORGANIZATIONS_QUERY = gql`
  query OrganizationsQuery($queryOptions: QueryOptions, $organizationId: ID) {
    organizations(
      queryOptions: $queryOptions
      organizationId: $organizationId
    ) {
      items {
        id
        name
        full_name
        legal_form {
          id
          name
        }
        address_legal
        office_number_legal
        address_mail
        office_number_mail
        phone_number
        fax_number
        email
        INN
        OGRN
        OKPO
        KPP
        bik {
          id
          BIK
          name
        }
        payment_account
        director {
          id
          first_name
          last_name
          patronymic
        }
        employees {
          id
          first_name
          last_name
          work_email
          work_phone
          mobile_phone
          email
          patronymic
          birth_day
          position {
            id
            name
          }
        }
      }
      count
    }
  }
`;

export const IRDS_QUERY = gql`
  query IrdQuery($queryOptions: QueryOptions) {
    irds(queryOptions: $queryOptions) {
      items {
        id
        name
      }
      count
    }
  }
`;
export const TYPES_PROJECTS_QUERY = gql`
  query TypeProjectsQuery($queryOptions: QueryOptions) {
    typeProjects(queryOptions: $queryOptions) {
      items {
        id
        name
        code
        group {
          id
          name
          technical_specification {
            id
            name
          }
        }
      }
      count
    }
  }
`;
export const PROJECTS_QUERY = gql`
  query ProjectQuery(
    $queryOptions: QueryOptions
    $projectId: ID
    $projectStatuses: [String]
  ) {
    projects(
      queryOptions: $queryOptions
      projectId: $projectId
      projectStatuses: $projectStatuses
    ) {
      items {
        id
        number
        name
        duration
        date_start
        contract_file_id
        kp_file_id
        prepayment_file_id
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
        organization_customer {
          id
          name
        }
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
      count
    }
  }
`;
export const PPI_QUERY = gql`
  query PpiQuery($queryOptions: QueryOptions) {
    passportPlaceIssues(queryOptions: $queryOptions) {
      items {
        id
        name
        code
      }
      count
    }
  }
`;
export const PERSONS_QUERY = gql`
  query PersonQuery($queryOptions: QueryOptions) {
    persons(queryOptions: $queryOptions) {
      items {
        id
        passport {
          id
          first_name
          last_name
          patronymic
          serial
          number
          address_registration
          address_residential
          passport_place_issue {
            id
            name
          }
          birth_date
          date
        }
        SHILS
        INN
        payment_account
        phone_number
        email
        email_sibnipi
        bank {
          id
          name
        }
        bik {
          id
          BIK
          name
        }
      }
      count
    }
  }
`;
export const PERSONS_SHORT_QUERY = gql`
  query PersonQuery($queryOptions: QueryOptions) {
    persons(queryOptions: $queryOptions) {
      items {
        id
        passport {
          id
          first_name
          last_name
          patronymic
        }
      }
      count
    }
  }
`;

export const GET_CURRENT_USER = gql`
  query CurrentUser {
    currentUser {
      user {
        id
        name
        email
      }
      permissions {
        description
        name_key
        name
      }
      roles {
        description
        name_key
        name
      }
      access_token
    }
  }
`;

export const STAGES_QUERY = gql`
  query StagesQuery($queryOptions: QueryOptions) {
    stages(queryOptions: $queryOptions) {
      items {
        id
        name
      }
      count
    }
  }
`;
export const CONTACTS_QUERY = gql`
  query ContactsQuery($queryOptions: QueryOptions) {
    contacts(queryOptions: $queryOptions) {
      items {
        id
        first_name
        last_name
        patronymic
        birth_day
        work_phone
        work_email
        mobile_phone
        email
        position {
          id
          name
        }
        organization {
          id
          name
        }
      }
      count
    }
  }
`;
export const USERS_QUERY = gql`
  query UsersQuery($queryOptions: QueryOptions) {
    users(queryOptions: $queryOptions) {
      items {
        id
        email
        roles {
          name_key
          name
          description
          permissions {
            name_key
            name
            description
          }
        }
        person {
          id
        }
        organization {
          id
          name
        }
      }
      count
    }
  }
`;
export const ROLES_TABLE = gql`
  query RolesQuery($queryOptions: QueryOptions) {
    roles(queryOptions: $queryOptions) {
      items {
        name
        description
        permissions {
          name
          description
        }
      }
      count
    }
  }
`;
export const CONTACTS_SHORT_QUERY = gql`
  query ContactsQuery($queryOptions: QueryOptions, $organizationId: ID) {
    contacts(queryOptions: $queryOptions, organizationId: $organizationId) {
      items {
        id
        first_name
        last_name
        patronymic
      }
      count
    }
  }
`;

export const FACILITYS_QUERY = gql`
  query FacilitiesQuery {
    facilities {
      id
      name
      code
      subselection_facility {
        id
        name
        code
        group_facility {
          id
          name
          code
          facilities {
            id
            name
            code
          }
        }
      }
    }
  }
`;

export const PAYMENTS_QUERY = gql`
  query BikQuery {
    tasks {
      items {
        id
        name
      }
      count
    }
  }
`;

export const POSITIONS_QUERY = gql`
  query PositionsQuery($queryOptions: QueryOptions) {
    positions(queryOptions: $queryOptions) {
      items {
        id
        name
      }
      count
    }
  }
`;
export const LEGAL_FORM_QUERY = gql`
  query LegalForms {
    legalForms {
      id
      name
    }
  }
`;
export const BIKS_QUERY = gql`
  query BiksForms($queryOptions: QueryOptions) {
    biks(queryOptions: $queryOptions) {
      items {
        id
        name
        BIK
        correspondent_account
      }
      count
    }
  }
`;
export const PROJECT_IRDS_QUERY = gql`
  query ProjectIrds($projectId: ID) {
    projectIrds(projectId: $projectId) {
      id
      project_id
      ird_id

      ird {
        id
        name
      }
      received_date
      stage_number
      application_project
      is_broken
      is_viewed
      acceptance_date
    }
  }
`;

export const PROJECT_DELAYS_QUERY = gql`
  query ProjectDelay($projectId: ID) {
    projectDelay(projectId: $projectId) {
      id
      date_start
      date_end
      delay_type {
        name
      }
    }
  }
`;
