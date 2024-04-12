import React, {useEffect, useState} from 'react';
import {useQuery} from "@apollo/client";
import {PPI_QUERY, PROJECTS_QUERY} from "./graphql/queries";
import {Button} from "antd";

function Test() {
    const [refetchS, setRefetch] = useState(false);
    const {
        loading: loadingTasks,
        error: errorTasks,
        refetch: refetchTasks,
        data: data,
    } = useQuery(PPI_QUERY, {
        variables: { projectId:  24, refetch: refetchS },
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
            console.log("onCompleted ");
        },
        onError: (data) =>{
          console.log("onError");
        },
    });

    return <Button onClick={()=>setRefetch(!refetchS)} loading={loadingTasks}>Оновить</Button>;
}

export default Test;