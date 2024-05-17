import {gql} from '@apollo/client';
export const TASKS_QUERY_COMPACT = gql`
    query TasksQueryCompact    {
        tasks    {
            items {
                id
                name
            }
        }
    }
`;
export const REFERENCES_QUERY_COMPACT = gql`
    query ReferencesQueryCompact   {
        references   {
            items {
                id
                name
            }
         }
    }
`;
export const TECHNICAL_SPECIFICATION_QUERY_COMPACT = gql`
    query TechnicalSpecificationQueryCompact {
        typeTechnicalSpecification  {
            id
        }
    }
`;
export const SECTION_REFERENCES_QUERY_COMPACT = gql`
    query SectionReferenceQueryCompact {
        sectionReferences  {
            items{
                id
                name
            }
        }
    }
`;
export const GROUP_TYPE_PROJECTS_QUERY_COMPACT = gql`
    query GroupTypeProjectsQueryCompact {
        groupTypeProjects  {
            id
            name
        }
    }
`;
export const BANKS_QUERY_COMPACT = gql`
    query BanksQueryCompact   {
        banks 
        {
            items{
                id
                name
            }
        }
    }
`;
export const PASSPORTS_PLACE_ISSUES_QUERY_COMPACT = gql`
    query PPIQueryCompact  {
        passportPlaceIssues   {
            items{
                id
                name
            }
        }
    }
`;
export const PROJECT_STATUSES_QUERY_COMPACT = gql`
    query ProjectStatusesQueryCompact {
        projectStatuses  {
            id
            name
        }
    }
`;
export const TYPES_PAYMENT_QUERY_COMPACT = gql`
    query TypePaymentsQueryCompact {
        TypePayments {
            id
            name
        }
    }
`;
export const ORGANIZATIONS_QUERY_COMPACT = gql`
    query OrganizationsQuery  {
        organizations{
            items {
                id
                name
            }
        }
    }
`;
export const ORGANIZATIONS_SHORT_QUERY_COMPACT = gql`
    query OrganizationsQueryCompact  {
        organizations  {
            items {
                id
                name
            }
        }
    }
`;
export const IRDS_QUERY_COMPACT = gql`
    query IrdQueryCompact {
        irds  {
            items {
                id
                name
            }
        }
    }
`;
export const TYPES_PROJECTS_QUERY_COMPACT = gql`
    query TypeProjectsQueryCompact {
        typeProjects  {
            items {
                id
                name
            }
        }
    }
`;
export const PROJECTS_QUERY_COMPACT = gql`
    query ProjectQueryCompact  {
        projects  {
            items{
                id
                name
            }
        }
    }
`;
export const PPI_QUERY_COMPACT = gql`
    query PpiQueryCompact {
        passportPlaceIssues {
            items{
                id
                name
                }
        }
    }
`;
export const PERSONS_QUERY_COMPACT = gql`
    query PersonQueryCompact {
        persons {
            items {
                id
                passport{
                    firstname
                    lastname
                    patronymic
                    birth_date
                }
            }
        }
    }
`;

export const STAGES_QUERY_COMPACT = gql`
    query StagesQueryCompact {
        stages  {
            items {
                id
                name
            }
        }
    }
`;
export const CONTACTS_QUERY_COMPACT = gql`
    query ContactsQueryCompact  {
        contacts {
            items {
                id
                first_name
                last_name
                patronymic
                birth_day
            }
        }
    }
`;
export const FACILITYS_QUERY_COMPACT = gql`
    query FacilitiesQueryCompact   {
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


export const PAYMENTS_QUERY_COMPACT = gql`
    query BikQueryCompact {
        tasks  {
            items {
                id
                name
            }
        }
    }
`;
export const LEGAL_FORM_QUERY_COMPACT = gql`
    query LegalFormsCompact {
        legalForms   {
            id
            name
        }
    }
`;
export const BIKS_QUERY_COMPACT = gql`
    query BiksFormsCompact {
        biks   {
            items {
                id
                name
            }
        }
    }
`;
export const POSITIONS_QUERY_COMPACT = gql`
    query PositionsQueryCompact   {
        positions  {
            items {
                id
                name
            }
            count
        }
    }
`;