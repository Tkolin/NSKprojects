import React, {useEffect, useState} from 'react';
import {AutoComplete, Button, Form, Space} from 'antd';
import {EditOutlined, PlusOutlined} from '@ant-design/icons';
import {StyledButtonGreen} from "./ButtonStyles";



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
                                         typeData
                                     }) => {
    const getName = (row, typeData) => {
        if (typeData === "FIO")
            return `${row.last_name || row.lastname} ${row.first_name || row.firstname} ${row.patronymic ?? ""}`;
        else if (typeData === "CODENAME")
            return `${row.code ?? row.BIK} - ${row.name}`
        return row.name;
    };



    const handleSearch = (txt) => {
       // console.log(txt.toLowerCase());
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

    return (
        <AutoComplete
            popupMatchSelectWidth={false}
            style={{...style,width: width,maxWidth: width}}
            allowClear
            showSearch
            status={value?.selected ? "" : "warning"}
            size={size ?? 'regular'}
            mode={mode
                ?? ''}
            filterOption={false}
            loading={loading}
            value={value?.output}
            options={value?.options}
            onClear={() => onChange && onChange({...value, selected: null, output: null})}
            onSearch={handleSearch}
            onSelect={(variable, option) => {
                onSelect && onSelect({id: option.data, name: option.value});
                onChange && saveSelected ? onChange({...value, selected: option.data, output: option.label}) : onChange({...value, selected: null, output: null});

            }}
            placeholder={placeholder ?? "Начните ввод..."}
        />
    )
};

const BaseStyledButtonGreen = ({onClick, icon, style, disabled}) => (
    <StyledButtonGreen
        style={{
            ...style,
            marginBottom: 0,
        }}
        type={"dashed"}
        icon={icon}
        disabled={disabled}
        onClick={() => onClick && onClick(true)}
    />
);
const BaseStyledButton = ({onClick, icon, style, disabled}) => (
    <Button
        style={{
            ...style,
            marginBottom: 0,
        }}
        type={"dashed"}
        icon={icon}
        disabled={disabled}
        onClick={() => onClick && onClick(true)}
    />
);
const CustomAutoCompleteAndCreate = ({
                                         onSelect,
                                         onSearch,
                                         placeholder,
                                         loading,
                                         items,
                                         firstBtnOnClick,
                                         formatOptionText,
                                         mode,
                                         typeData,
                                         data,
                                         value,
                                         onChange,
                                         saveSelected,
                                     }) => (
    <Space.Compact style={{width: "100%", marginBottom: 0}}>

        <CustomAutoCompleteComponent
            onSelect={onSelect}
            placeholder={placeholder}
            loading={loading}
            items={items}
            onSearch={onSearch}
            saveSelected={saveSelected}
            formatOptionText={formatOptionText}
            mode={mode}
            width={"calc(100% - 32px)"}
            typeData={typeData} data={data} value={value} onChange={onChange && onChange}/>
        <BaseStyledButtonGreen onClick={firstBtnOnClick}
                          icon={<PlusOutlined/>}/>
    </Space.Compact>

);
const CustomAutoComplete = ({
                                size,
                                style,
                                onSelect,
                                placeholder,
                                loading,
                                onSearch,
                                formatOptionText,
                                mode,
                                items,
                                typeData,
                                data,
                                value,
                                onChange,
                            }) => (
         <CustomAutoCompleteComponent
             size={size}
             style={style}
            onSelect={onSelect}
            placeholder={placeholder}
            loading={loading}
            items={items}
            onSearch={onSearch}
            formatOptionText={formatOptionText}
            mode={mode}
            width={"calc(100%+64px)"}
            typeData={typeData} data={data} value={value} onChange={onChange && onChange}/>

);
const CustomAutoCompleteAndCreateWitchEdit = ({
                                                  saveSelected,
                                                  onSelect,
                                                  placeholder,
                                                  loading,
                                                  items,
                                                  onSearch,
                                                  firstBtnOnClick,
                                                  secondBtnOnClick,
                                                  formatOptionText,
                                                  mode,

                                                  secondDisable,
                                                  data,
                                                  value,
                                                  onChange,
                                                  typeData
                                              }) => (
    <Space.Compact style={{width: "100%", marginBottom: 0}}>
        <CustomAutoCompleteComponent
            saveSelected={saveSelected}
            onSelect={onSelect}
            onSearch={onSearch}
            placeholder={placeholder}
            loading={loading}
            items={items}
            formatOptionText={formatOptionText}
            mode={mode}
            width={"calc(100% - 64px)"}
            typeData={typeData}
            data={data}
            value={value}
            onChange={onChange && onChange}/>

        <BaseStyledButtonGreen onClick={firstBtnOnClick}
                          icon={<PlusOutlined/>}
                          type={'dashed'}/>
        <BaseStyledButton onClick={secondBtnOnClick}
                          icon={<EditOutlined/>}
                          disable={secondDisable}/>
    </Space.Compact>

);

export {
    CustomAutoCompleteAndCreate,
    CustomAutoCompleteAndCreateWitchEdit,
    CustomAutoComplete
};

