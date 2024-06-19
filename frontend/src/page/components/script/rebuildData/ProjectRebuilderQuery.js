import 'react-phone-number-input/style.css';
import dayjs from "dayjs";

export const facilitiesToFullCode = (faclility) => {
    if (!(faclility && faclility?.group_facility && faclility?.group_facility?.subselection_facility

        && faclility?.group_facility?.subselection_facility
            ?.selection_facility))
        return "";

    return `${faclility?.group_facility?.subselection_facility?.selection_facility.code.toString().padStart(2, '0')}-` +
        `${faclility?.group_facility?.subselection_facility?.code.toString().padStart(2, '0')}-` +
        `${faclility?.group_facility?.code.toString().padStart(3, '0')}-` +
        `${faclility?.code?.toString().padStart(3, '0')}`
}


export const rebuildProjectResultQuery = (data) => {
    return {
        ...data,
        date_range: {
            dateEnd: data?.date_end ? dayjs(data?.date_end) : null,
            dateStart: data?.date_signing ? dayjs(data?.date_signing) : null,
            duration: data?.duration ?? null
        },
        date_create: data?.date_create ? dayjs(data?.date_create) : null,
        date_end: data?.date_end ? dayjs(data?.date_end) : null,
        date_signing: data?.date_signing ? dayjs(data?.date_signing) : null,
        delegates_id: data?.delegations?.map(k => k?.id),
        facility_id: {
            checkedKeys: data?.facilities?.map(k => facilitiesToFullCode(k)),
            checkedObjects: data?.facilities?.map(k =>
                ({
                    key: facilitiesToFullCode(k),
                    title: k.name,
                    value: [k.id
                        , k.code
                    ]
                })
            )
        },
        organization_customer: {selected: data?.organization_customer?.id, output: data?.organization_customer?.name},
        status_id: data?.status?.id,
        type_project_document_id: data?.type_project_document?.id,
        group_type_project_document_id: data?.type_project_document?.group?.id,
    }
        ;
};
export const rebuildStagesResultQuery = (data) => {
    let f = 1;
    return data?.map((row,) => ({
        ...row,
        date_range: {
            dateStart: row?.date_start ? dayjs(row?.date_start) : null,
            dateEnd: row?.date_end ? dayjs(row?.date_end) : null,
            duration: row?.duration ?? null
        },
        stage: {selected: row?.stage?.id, output: row?.stage?.name},
    }));
};
export const rebuildIrdsResultQuery = (data) => {
    return data?.map((row, index) => ({
        ...row,
        receivedDate: row.receivedDate ? dayjs(row.receivedDate?.[1]).format("YYYY-MM-DD") : null,
        IRD: {selected: row?.IRD?.id, output: row?.IRD?.name},

    }));
};
export const rebuildStagesToQuery = (data, project) => {
    if (!data)
        return [];
    const dataArray = Object.values(data);

    return dataArray?.map((row, index) => ({
        id: row?.id ?? null,
        project_id: project?.id ?? null,
        date_start: row.date_range?.dateStart ? dayjs(row.date_range?.dateStart).format("YYYY-MM-DD") : null,
        date_end: row.date_range?.dateEnd ? dayjs(row.date_range?.dateEnd).format("YYYY-MM-DD") : null,
        duration: row?.date_range?.duration ?? null,
        stage_id: row?.stage?.selected ?? null,
        number: index + 1,
        price: row?.price ?? null,
        percent: row?.percent ?? null,
        progress: row?.progress ?? null,
        price_to_paid: row?.price_to_paid ?? null,
    }));
};
export const rebuildIrdToQuery = (data, project) => {
    if (!data)
        return [];
    const dataArray = Object.values(data);
    return dataArray?.map((row, index) => ({
        id: row?.id ?? null,
        project_id: project?.id ?? null,
        ird_id: row?.IRD?.selected ?? null,
        stageNumber: row?.stageNumber ? parseInt(row?.stageNumber) : null,
        applicationProject: row?.applicationProject ? parseInt(row?.applicationProject) : null,
        receivedDate: row?.receivedDate ? dayjs(row?.receivedDate).format("YYYY-MM-DD") : null,
    }));
};
export const rebuildProjectToQuery = (data) => {
    console.log("rebuildProjectToQuery", data);
    if (!data)
        return [];

    return {
        id: data?.id ?? null,
        number: data?.number,
        name: data?.name,
        organization_customer_id: data?.organization_customer?.selected,
        type_project_document_id: data?.type_project_document_id,
        date_signing: data?.date_range?.dateStart ? dayjs(data?.date_range?.dateStart).format("YYYY-MM-DD") : null,
        duration: data?.date_range?.duration,
        date_end: data?.date_range?.dateEnd ?  dayjs(data?.date_range?.dateEnd).format("YYYY-MM-DD") : null,
        date_create: data?.date_signing ?  dayjs(data?.date_signing).format("YYYY-MM-DD") : null,
        status_id: data?.status_id,
        date_completion: data?.date_completion ?  dayjs(data?.date_completion).format("YYYY-MM-DD") : null,
        price: data?.price,
        prepayment: data?.prepayment,
        facility_id: data?.facility_id?.checkedObjects?.map(row => row?.value[0] ?? null) ?? null,
        delegates_id: null //data?.delegates_id,
    };
};

