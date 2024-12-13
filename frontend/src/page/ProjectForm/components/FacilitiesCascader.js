import { useQuery } from "@apollo/client";
import { Cascader } from "antd";
import React, { useState } from "react";
import { FACILITYS_QUERY } from "../../../graphql/queries";

const { SHOW_CHILD } = Cascader;

const FacilitiesCascader = ({ value, onChange }) => {
  const [cascaderFacility, setCascaderFacility] = useState([]);

  const { loading: loadingFacility } = useQuery(FACILITYS_QUERY, {
    onCompleted: (data) =>
      setCascaderFacility(sortFacilitysForCascader(data.facilities)),
  });

  const sortFacilitysForCascader = (facilities) => {
    return facilities.map((facility) => {
      const facilitySubselections = facility.facility_subselection.map(
        (subFacility) => {
          const facilityGroups = subFacility.facility_group.map(
            (FacilityGroup) => {
              const facilities = FacilityGroup.facilities.map((facility) => ({
                key: facility.id,
                label: facility.name,
                value: [facility.id, facility.code],
              }));

              return {
                key: FacilityGroup.id,
                label: FacilityGroup.name,
                value: [FacilityGroup.id, FacilityGroup.code],
                children: facilities,
              };
            }
          );

          return {
            key: subFacility.id,
            label: subFacility.name,
            value: [subFacility.id, subFacility.code],
            children: facilityGroups,
          };
        }
      );

      return {
        key: facility.id,
        label: facility.name,
        value: [facility.id, facility.code],
        children: facilitySubselections,
      };
    });
  };

  return (
    <Cascader
      style={{ width: "100%" }}
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
