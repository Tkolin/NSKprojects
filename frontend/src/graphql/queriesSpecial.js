import {gql} from "@apollo/client";

export const STATUS_PROJECTS_QUERY = gql`
    query StagesQuery {
        projectsStatistic  {
            project_ids
            status {
                name_key
                name
            }
        }
    }
`;