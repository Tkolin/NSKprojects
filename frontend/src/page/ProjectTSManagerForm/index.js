import { useQuery } from "@apollo/client";
import { PROJECT_TS_QUERY } from "../../graphql/queriesByID";

const DataEntryForm = ({ projectId }) => {
  const {loading, data } = useQuery(PROJECT_TS_QUERY, {
    onCompleted: (data) => {
console.log(data);

    },
    onError: (error) => {},
  });
 
  return (
    <div>ы</div>
  );
};

export default DataEntryForm;
