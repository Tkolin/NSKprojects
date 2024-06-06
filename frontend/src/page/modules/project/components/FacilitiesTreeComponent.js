import React, { useEffect, useState } from 'react';
import { Form, Tree } from 'antd';
import { useQuery } from "@apollo/client";
import { FACILITYS_QUERY } from "../../../../graphql/queries";
import LoadingSpinnerStyles from "../../../../components/style/LoadingSpinnerStyles";

const FacilitiesTreeComponent = ({ value = { checkedKeys: [] }, onChange }) => {
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    const [facility, setFacility] = useState([]);

    const { loading: loadingFacility } = useQuery(FACILITYS_QUERY, {
        onCompleted: (data) => setFacility(sortFacilitiesForCascader(data.facilities))
    });

    if (loadingFacility) {
        return <LoadingSpinnerStyles />;
    }

    // Функция для форматирования чисел с заданной длиной
    const formatNumber = (number, length) => {
        return number.toString().padStart(length, '0');
    };

    const sortFacilitiesForCascader = (facilities, parentKey = '', level = 0) => {
        return facilities.map((facility) => {
            const key = parentKey ? `${parentKey}-${formatNumber(facility.code, 2)}` : formatNumber(facility.code, 2);
            const subselectionFacilities = facility.subselection_facility.map((subFacility) => {
                const subKey = `${key}-${formatNumber(subFacility.code, 2)}`;
                const groupFacilities = subFacility.group_facility.map((groupFacility) => {
                    const groupKey = `${subKey}-${formatNumber(groupFacility.code, 3)}`;
                    const facilities = groupFacility.facilities.map((innerFacility) => ({
                        key: `${groupKey}-${formatNumber(innerFacility.code, 3)}`,
                        title: innerFacility.name,
                        value: [innerFacility.id, innerFacility.code],
                    }));

                    return {
                        key: groupKey,
                        title: groupFacility.name,
                        value: [groupFacility.id, groupFacility.code],
                        children: facilities
                    };
                });

                return {
                    key: subKey,
                    title: subFacility.name,
                    value: [subFacility.id, subFacility.code],
                    children: groupFacilities
                };
            });

            return {
                key: key,
                title: facility.name,
                value: [facility.id, facility.code],
                children: subselectionFacilities
            };
        });
    };

    const findFacilityByKey = (data, key) => {
        for (let item of data) {
            if (item.key === key) {
                return item;
            }
            if (item.children) {
                const found = findFacilityByKey(item.children, key);
                if (found) {
                    return found;
                }
            }
        }
        return null;
    };

    const onExpand = (expandedKeysValue) => {
        console.log('onExpand', expandedKeysValue);
        setExpandedKeys(expandedKeysValue);
        setAutoExpandParent(false);
    };

    const isLeafNode = (node) => {
        return !node.children || node.children.length === 0;
    };

    const onCheck = (checkedKeysValue) => {
        console.log('onCheck', checkedKeysValue);
        const newCheckedKeys = checkedKeysValue.filter(key => key.toString().length === 13);
        const checkedObjects = newCheckedKeys
            .map(key => findFacilityByKey(facility, key))
            .filter(node => node && isLeafNode(node));
        onChange({ ...value, checkedKeys: checkedKeysValue, checkedObjects });
    };


    return (
        <Tree
            checkable
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onCheck={(checkedKeysValue) => onCheck(checkedKeysValue)}
            checkedKeys={value.checkedKeys}
            className="draggable-tree"
            treeData={facility}
        />
    );
};

export default FacilitiesTreeComponent;
