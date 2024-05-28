import React, {useState, useEffect} from 'react';
import {Cascader} from 'antd';
import {useQuery} from "@apollo/client";
import {FACILITYS_QUERY} from "../../../../graphql/queries";

const {SHOW_CHILD} = Cascader;

const FacilitiesCascader = ({value, onChange}) => {
    const [cascaderFacility, setCascaderFacility] = useState([]);

    const {loading: loadingFacility} = useQuery(FACILITYS_QUERY, {
        onCompleted: (data) => setCascaderFacility(sortFacilitysForCascader(data.facilities))
    });

    const sortFacilitysForCascader = (facilities) => {
        return facilities.map(facility => {
            const subselectionFacilities = facility.subselection_facility.map(subFacility => {
                const groupFacilities = subFacility.group_facility.map(groupFacility => {
                    const facilities = groupFacility.facilities.map(facility => ({
                        key: facility.id,
                        label: facility.name,
                        value: [facility.id, facility.code],
                    }));

                    return {
                        key: groupFacility.id,
                        label: groupFacility.name,
                        value: [groupFacility.id, groupFacility.code],
                        children: facilities
                    };
                });

                return {
                    key: subFacility.id,
                    label: subFacility.name,
                    value: [subFacility.id, subFacility.code],
                    children: groupFacilities
                };
            });

            return {
                key: facility.id,
                label: facility.name,
                value: [facility.id, facility.code],
                children: subselectionFacilities
            };
        });
    };

    return (
        <Cascader
            style={{width: "100%"}}
            showCheckedStrategy={SHOW_CHILD}
            popupMatchSelectWidth={false}
            options={cascaderFacility}
            multiple
            value={value}
            onChange={(value, selectedOptions) => {
                onChange && onChange(value);
            }}
            expandTrigger="hover"
            maxTagCount="responsive"
        />
    );
};

export default FacilitiesCascader;
