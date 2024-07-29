import React, {useEffect, useState} from 'react';
import {AutoComplete, Button, Form, Skeleton, Space} from 'antd';
import {EditOutlined, PlusOutlined} from '@ant-design/icons';
import {StyledButtonGreen} from "./ButtonStyles";
import SkeletonInput from "antd/es/skeleton/Input";


const CustomAutoCompleteComponent = ({
                                         saveSelected = true,
                                         style,
                                         width,
                                         placeholder,
                                         loading,
                                         mode,
                                         size,
                                         data,
                                         value,
                                         onChange,
                                         onSelect,
                                         typeData,
    ...props
                                     }) => {
    const getName = (row, typeData) => {
        if (typeData === "FIO")
            return `${row.last_name || row.lastname} ${row.first_name || row.firstname} ${row.patronymic ?? ""}`;
        else if (typeData === "CODENAME")
            return `${row.code ?? row.BIK} - ${row.name}`
        return row.name;
    };


    const handleSearch = (txt) => {
        if (!data) return;
        const filteredOptions = data
            .filter(row => getName(row, typeData).toLowerCase().includes(txt.toLowerCase()))
            .map(row => ({
                value: getName(row, typeData),
                label: getName(row, typeData),
                data: row.id
            }));
        onChange && onChange({...value, options: filteredOptions, output: txt, selected: null});
    };
    useEffect(() => {
        !(value?.selected) && handleSearch("");
    }, [data]);
    return (
        <AutoComplete
            popupMatchSelectWidth={false}
            style={{...style, width: width, maxWidth: width}}
            allowClear
            showSearch

            status={ (value?.output?.length < 1) ? "1" : (value?.selected) ? "2" : "warning"}
            size={size ?? 'regular'}
            mode={mode
                ?? ''}
            filterOption={false}
            value={value?.output}
            options={ value?.options}
            onClear={() => onChange && onChange({...value, selected: null, output: null})}
            onSearch={handleSearch}
            onSelect={(variable, option) => {
                onSelect && onSelect({id: option.data, name: option.value});
                onChange && saveSelected ? onChange({
                    ...value,
                    selected: option.data,
                    output: option.label
                }) : onChange({...value, selected: null, output: null});

            }}
            placeholder={placeholder ?? "Начните ввод..."}
            {...props}
        />

    )
};

const BaseStyledButtonGreen = ({onClick, icon, style, disabled, size, ...props}) => (
    <StyledButtonGreen
        style={{
            ...style,
            marginBottom: 0,
        }}
        size={size ?? "regular"}
        type={"dashed"}
        icon={icon}
        disabled={disabled}
        onClick={() => onClick && onClick(true)}
        {...props}
    />
);
const BaseStyledButton = ({onClick, icon, style, disabled, ...props}) => (
    <Button
        style={{
            ...style,
            marginBottom: 0,
        }}
        type={"dashed"}
        icon={icon}
        disabled={disabled}
        onClick={() => onClick && onClick(true)}
        {...props}
    />
);
const CustomAutoCompleteAndCreate = ({

                                         firstBtnOnClick,
                                         onChange,
                                         size,
                                         ...props
                                     }) => {
    if (props?.loading)
        return <Skeleton.Input block style={{width: "100%"}} size={'small'} active/>
    return (<Space.Compact style={{width: "100%", marginBottom: 0}}>
            <CustomAutoCompleteComponent
                width={"calc(100% - 32px)"}
                onChange={onChange}
                {...props}/>
            <BaseStyledButtonGreen onClick={firstBtnOnClick}
                                   size={size}
                                   icon={<PlusOutlined/>}/>
        </Space.Compact>
    )
};
const CustomAutoComplete = ({
                                onChange,
                                ...props
                            }) => {
    if (props?.loading)
        return <Skeleton.Input block style={{width: "100%"}} size={'small'} active/>
    return (
        <CustomAutoCompleteComponent
            width={"calc(100%+64px)"}
            onChange={onChange}
            {...props}/>

    )
};
const CustomAutoCompleteAndCreateWitchEdit = ({
                                                  firstBtnOnClick,
                                                  secondBtnOnClick,
                                                  secondDisable,
                                                  onChange,
                                                  ...props
                                              }) => {
    if (props?.loading)
        return <Skeleton.Input block style={{width: "100%"}} size={'small'} active/>
    return (
        <Space.Compact style={{width: "100%", marginBottom: 0}}>
            <CustomAutoCompleteComponent
                width={"calc(100% - 64px)"}
                onChange={onChange}
                {...props}/>

            <BaseStyledButtonGreen onClick={firstBtnOnClick}
                                   icon={<PlusOutlined/>}
                                   type={'dashed'}/>
            <BaseStyledButton onClick={secondBtnOnClick}
                              icon={<EditOutlined/>}
                              disable={secondDisable}/>
        </Space.Compact>

    );
}
const CustomAutoCompleteExtension = ({
                                         visibleMode = "IGNORE",
                                         ...props
                                     }) => {
    useEffect(() => {
        console.log(props?.value?.selected);
    }, [props.value]);
    switch (visibleMode) {
        case "IGNORE":
            return <CustomAutoCompleteAndCreate {...props} />
        case "CREATE_WHERE_NON_SELECTED":
            if (props?.value?.selected) {
                return <CustomAutoCompleteComponent {...props} />
            } else return <CustomAutoCompleteAndCreate {...props} />
    }
};

export {
    CustomAutoCompleteExtension,
    CustomAutoCompleteAndCreate,
    CustomAutoCompleteAndCreateWitchEdit,
    CustomAutoComplete
};

