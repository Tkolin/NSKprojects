import React, {useEffect, useState} from 'react';
import {AutoComplete, Button, Form, Space} from 'antd';
import {EditOutlined, PlusOutlined} from '@ant-design/icons';


const ButtonGreenStyle = {
    background: "#52c41a",
    color: "#fff",
    borderColor: "#52c41a",
    '&:hover': {
        background: '#389e0d',
        borderColor: '#389e0d',
    },
    '&:active': {
        background: '#237804',
        borderColor: '#237804',
    }
};
const CustomAutoCompleteComponent = ({
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
        if (typeData === "FIO") {
            return `${row.last_name || row.lastname} ${row.first_name || row.firstname} ${row.patronymic ?? ""}`;
        }
        return row.name;
    };
    useEffect(() => {
        console.log(value);
    }, [value]);


    const handleSearch = (txt) => {
        console.log(txt.toLowerCase());
        if (!data) return;
        const filteredOptions = data
            .filter(row => getName(row, typeData).toLowerCase().includes(txt.toLowerCase()))
            .map(row => ({
                value: getName(row, typeData),
                label: getName(row, typeData),
                data: row.id
            }));
         onChange({...value, options: filteredOptions, output: txt, selected: null});
    };

    return (
        <AutoComplete
            popupMatchSelectWidth={false}
            style={{width: width}}
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
            onClear={()=>onChange({...value, selected: null, output: null})}
            onSearch={handleSearch}
            onSelect={(variable, option) => {
                onSelect({id: option.data, name: option.value})
                 onChange({...value, selected: option.data, output: option.label});
            }}
            placeholder={placeholder}
        />
    )
};

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
                                         onChange
                                     }) => (
    <Space.Compact style={{width: "100%", marginBottom: 0}}>

        <CustomAutoCompleteComponent
            onSelect={onSelect}
            placeholder={placeholder}
            loading={loading}
            items={items}
            onSearch={onSearch}
            formatOptionText={formatOptionText}
            mode={mode}
            width={"calc(100% - 32px)"}
            typeData={typeData} data={data} value={value} onChange={onChange}/>
        <BaseStyledButton onClick={firstBtnOnClick}
                          icon={<PlusOutlined/>}
                          style={ButtonGreenStyle}/>
    </Space.Compact>

);
const CustomAutoComplete = ({

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
    <Space.Compact style={{width: "100%", marginBottom: 0}}>
        <CustomAutoCompleteComponent
            onSelect={onSelect}
            placeholder={placeholder}
            loading={loading}
            items={items}
            onSearch={onSearch}
            formatOptionText={formatOptionText}
            mode={mode}
            width={"100%"}
            typeData={typeData} data={data} value={value} onChange={onChange}/>
    </Space.Compact>

);
const CustomAutoCompleteAndCreateWitchEdit = ({

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
            onChange={onChange}/>

        <BaseStyledButton onClick={firstBtnOnClick}
                          icon={<PlusOutlined/>}
                          type={'dashed'}
                          style={ButtonGreenStyle}/>
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

