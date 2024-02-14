import { gql } from '@apollo/client';

// Запросы данных
export const BIK_QUERY = gql`
    query ProjectQuery {
        biks {
            id
            Bik
            name
            correspondent_account
        }
    }
`;
export const ORGANIZATION_QUERY = gql`
    query OrganizationsQuery {
        organizations {
            id
            name
            full_name
            legal_form{
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
            Bik{
                id
                Bik
                name
            }
            payment_account
            director{
                id
                first_name
                last_name
            }
        }
    }
`;
export const PROJECT_QUERY = gql`
    query ProjectQuery {
        projects {
            number
            name
            date_signing
            duration
            date_end
            date_completion
        }
    }
`;

export const CURRENT_USER_QUERY = gql`
    query CurrentUser {
        currentUser {
            id
            name
            email
            role {
                id
                name
            }
        }
    }
`;

export const CONTACTS_QUERY = gql`
    query ContactsQuery {
        contacts {
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
    }
`;

export const PROJECT_STAGE_QUERY = gql`
    query ProjectStage {
        projectStages{
            id
            project{
                id
                name
            }
            stage{
                id
                name
            }
            progress
            date_start
            duration
        }
    }
`;

// Запросы групп данных
export const CONTACT_FORM_QUERY = gql`
    query ContactsFormQuery {
        organizations {
            id
            name
        }
        positionsNames {
            id
            name
        }
    }
`;
export const ORGANIZATION_FORM_QUERY = gql`
    query OrganizationsFormQuery {
        legalForms{
            id
            name
        }
        biks{
            id
            Bik
        }
        contacts{
            id
            first_name
            last_name
            patronymic
        }
    }
`;
export const PROJECT_FORM_QUERY = gql`
    query ProjectFormQuery {
        positionsNames {
            id
            name
        }
        projectStatuses
        {
            id
            name
        }
        organizations
        {
            id
            name
        }
        typeProjectDocuments
        {
            id
            name
        }
        facilitys
        {
            id
            name
        }
    }
`;

// Мутации
export const ADD_BIK_MUTATION = gql`
    mutation AddBik(
        $name: String!,
        $BIK:String!,
        $correspondent_account: String!
        ) {
        addBik(
            BIK: $BIK
            name: $name
            correspondent_account: $correspondent_account
        ) {
            id
            name
            Bik
            correspondent_account
        }
    }
`;
export const UPDATE_BIK_MUTATION = gql`
    mutation UpdateBik(
        $id: ID!,
        $name: String!,
        $BIK_id: String!,
        $correspondent_account: String!
) {
        updateBik(
            id: $id
            BIK: $BIK
            name: $name
            correspondent_account: $correspondent_account


        ) {
            id
            name
            Bik
            correspondent_account
        }
    }
`;
export const DELETE_CONTACT_MUTATION = gql`
    mutation DeletContact($id: ID! ) {
        deleteContact(
            id: $id
        ) {
            id
            first_name
            last_name
            patronymic
            birth_day
            work_phone
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
    }
`;
export const DELETE_ORGANIZATION_MUTATION = gql`
    mutation DeletOrganization($id: ID! ) {
        deleteOrganization(
            id: $id
        ) {
            name
            full_name
            legal_form{
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
            Bik{
                id
                name
            }
            payment_account
            director{
                id
                first_name
                last_name
            }
        }
    }
`;
export const ADD_CONTACT_MUTATION = gql`
    mutation AddContact($first_name: String!, 
        $last_name: 
        String,
        $patronymic: String,
        $birth_day: String,
        $work_phone: String,
        $work_email: String,
        $mobile_phone: String, 
        $email: String,
        $position_id: ID, 
        $organization_id: ID ) {
        addContact(
            first_name: $first_name
            last_name: $last_name
            patronymic: $patronymic
            birth_day: $birth_day
            work_phone: $work_phone
            work_email: $work_email
            mobile_phone: $mobile_phone
            email: $email
            position_id: $position_id
            organization_id: $organization_id
        ) {
            id
            first_name
            last_name
            patronymic
            birth_day
            work_phone
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
    }
`;
export const UPDATE_CONTACT_MUTATION = gql`
    mutation AddContact($id: ID!, $first_name: 
    String!, $last_name: String,$patronymic: String,
        $birth_day: String,
        $work_phone: String,
        $work_email: String,
        $mobile_phone: String,
        $email: String, 
        $position_id: ID, 
        $organization_id: ID ) {
        updateContact(
            id: $id
            first_name: $first_name
            last_name: $last_name
            patronymic: $patronymic
            birth_day: $birth_day
            work_phone: $work_phone
            work_email: $work_email
            mobile_phone: $mobile_phone
            email: $email
            position_id: $position_id
            organization_id: $organization_id
        ) {
            id
            first_name
            last_name
            patronymic
            birth_day
            work_phone
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
    }
`;
export const ADD_ORGANIZATION_MUTATION = gql`
    mutation AddOrganization(
        $legal_form: ID!,
        $name: String!,
        $full_name: String!,
        $address_legal: String,
        $office_number_legal: String,
        $address_mail: String,
        $office_number_mail: String,
        $phone_number: String,
        $fax_number: String,
        $email: String,
        $INN: String,
        $OGRN: String,
        $OKPO: String,
        $KPP: String,
        $BIK_id: ID,
        $payment_account: String,
        $director_id: ID
    ) {
        addOrganization(
            legal_form_id: $legal_form 
            name: $name
            full_name: $full_name
            address_legal: $address_legal
            office_number_legal: $office_number_legal
            address_mail: $address_mail
            office_number_mail: $office_number_mail
            phone_number: $phone_number
            fax_number: $fax_number
            email: $email
            INN: $INN
            OGRN: $OGRN
            OKPO: $OKPO
            KPP: $KPP
            BIK_id: $BIK_id
            payment_account: $payment_account
            director_id: $director_id
        ) {
            name
            full_name
            legal_form{
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
            Bik{
                id
                name
            }
            payment_account
            director{
                id
                first_name
                last_name
            }
        }
    }
`;

export const UPDATE_ORGANIZATION_MUTATION = gql`
    mutation AddOrganization($id: ID!,
        $legal_form_id: ID!,
        $name: String!,
        $full_name: String!,
        $address_legal: String,
        $office_number_legal: String,
        $address_mail: String,
        $office_number_mail: String,
        $phone_number: String,
        $fax_number: String,
        $email: String,
        $INN: String,
        $OGRN: String,
        $OKPO: String,
        $KPP: String,
        $BIK_id: ID,
        $payment_account: String,
        $director_id: ID!
    ) {
        updateOrganization(
            id: $id
            legal_form_id: $legal_form_id
            name: $name
            full_name: $full_name
            address_legal: $address_legal
            office_number_legal: $office_number_legal
            address_mail: $address_mail
            office_number_mail: $office_number_mail
            phone_number: $phone_number
            fax_number: $fax_number
            email: $email
            INN: $INN
            OGRN: $OGRN
            OKPO: $OKPO
            KPP: $KPP
            BIK_id: $BIK_id
            payment_account: $payment_account
            director_id: $director_id
        ) {
            name
            full_name
            legal_form{
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
            Bik{
                id
                name
            }
            payment_account
            director{
                id
                first_name
                last_name
            }
        }
    }
`;
export const ADD_PROJECT_MUTATION = gql`
    mutation AddProject(
        $number: String!, 
        $name: String!, 
        $organization_customer_id: ID, 
        $type_project_document_id: ID, 
        $facility_id: ID,
        $date_signing: String,
        $duration: Int, 
        $date_end: String, 
        $status_id: ID, 
        $date_completion: String ) {
        addProject(
            number: $number
            name: $name
            organization_customer_id: $organization_customer_id
            type_project_document_id: $type_project_document_id
            facility_id: $facility_id
            date_signing: $date_signing
            duration: $duration
            date_end: $date_end
            status_id: $status_id
            date_completion: $date_completion
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
            facility
            {
                id
                name
            }
            date_signing
            duration
            date_end
            status
            {
                id
                name
            }
            date_completion
        }
    }
`;
export const UPDATE_PROJECT_MUTATION = gql`
    mutation UpdateProject($number: String!, $name: String!, $organization_customer_id: ID, $type_project_document_id: ID, $facility_id: ID,
        $date_signing: String, $IAD_id: ID, $duration: String, $date_end: String, $status_id: ID, $date_completion: String ) {
        updateProject(
            number: $number
            name: $name
            organization_customer_id: $organization_customer_id
            type_project_document_id: $type_project_document_id
            facility_id: $facility_id
            date_signing: $date_signing
            IAD_id: $IAD_id
            duration: $duration
            date_end: $date_end
            status_id: $status_id
            date_completion: $date_completion
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
            facility
            {
                id
                name
            }
            date_signing
            IAD
            {
                id
                name
            }
            duration
            date_end
            status
            {
                id
                name
            }
            date_completion
        }
    }
`;
export const REGISTER_MUTATION = gql`
    mutation Register($input: RegisterInput!) {
        register(input: $input) {
            user {
                id
                name
                email
            }
            access_token
        }
    }
`;
export const LOGIN_MUTATION = gql`
    mutation Login($input: LoginInput!) {
        login(input: $input) {
            user {
                id
                name
                email
                role {
                    id
                    name
                }
            }
            access_token
        }
    }
`;

