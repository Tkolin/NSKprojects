import React from 'react';
import {AutoComplete, Button, Select, Space} from 'antd';
import {EditOutlined, PlusOutlined} from '@ant-design/icons';
import {StyledButtonGreen} from "./ButtonStyles";
import {StyledFormItem} from "./FormStyles";
import styled from "styled-components";

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
const BaseStyledFormItemAutoComplete = ({
                                            formName,
                                            formLabel,
                                            width,
                                            placeholder,
                                            loading,
                                            mode,
                                            labelCol,
                                            size,
                                            wrapperCol,

                                            data, stateSearch, setStateSearch, typeData
                                        }) => {
    const getName = (row, typeData) => {
        if (typeData === "FIO") {
            return `${row.last_name || row.lastname} ${row.first_name || row.firstname} ${row.patronymic ?? ""}`;
        }
        return row.name;
    };
    const handleSearch = (value) => {
        console.log(value.toLowerCase());
        if (!data) return;
        const filteredOptions = data
            .filter(row => getName(row, typeData).toLowerCase().includes(value.toLowerCase()))
            .map(row => ({
                value: getName(row, typeData),
                label: getName(row, typeData),
                data: row.id
            }));
        setStateSearch({...stateSearch, options: filteredOptions, selected: null});
    };
    return (
        <StyledFormItem name={formName} labelCol={labelCol} wrapperCol={wrapperCol} label={formLabel}
                        style={{width: width}}>
            <AutoComplete
                popupMatchSelectWidth={false}
                 style={{width: width}}
                allowClear
                showSearch
                status={stateSearch?.selected ? "" : "warning"}
                size={size ?? 'regular'}
                mode={mode
                    ?? ''}
                filterOption={false}
                loading={loading}

                options={stateSearch?.options}
                //value={stateSearch?.selected}
                onSearch={handleSearch}
                onSelect={(value, option) =>
                {console.log("filter", {...stateSearch, selected: option.data});
                    setStateSearch({...stateSearch, selected: option.data});
                }}
                placeholder={placeholder}
            />

        </StyledFormItem>)
};

const BaseStyledButtonFormItemAutoComplete = ({onClick, position, type, icon, style, disabled}) => (
    <Button
        style={{
            ...style,
            marginBottom: 10,
            marginLeft: position === 0 ? -32 : position === 1 ? -64 : position === 2 ? 0 : 0
        }}
        type={type}
        icon={icon}
        disabled={disabled}
        onClick={() => onClick && onClick(true)}
    />
);
const BaseStyledSpaceCompactFormItemAutoComplete = ({width, children}) => (
    <Space.Compact style={
        {
            width: width,
            alignItems: 'flex-end'
        }
    }>
        {children}
    </Space.Compact>
);
const StyledFormItemAutoCompleteAndCreate = ({
                                                 formName,
                                                 formLabel,
                                                 onSelect,
                                                 onSearch,
                                                 placeholder,
                                                 loading,
                                                 items,
                                                 firstBtnOnClick,
                                                 formatOptionText,
                                                 mode,


                                                 typeData,data, stateSearch, setStateSearch

                                             }) => (
    <BaseStyledSpaceCompactFormItemAutoComplete width={"calc(100% + 32px)"}>
        <BaseStyledFormItemAutoComplete formName={formName}
                                        formLabel={formLabel}
                                        onSelect={onSelect}
                                        placeholder={placeholder}
                                        loading={loading}
                                        items={items}
                                        onSearch={onSearch}
                                        formatOptionText={formatOptionText}
                                        mode={mode}
                                        width={"calc(100% - 32px)"}

                                        typeData={typeData} data={data} stateSearch={stateSearch} setStateSearch={setStateSearch}/>

        <BaseStyledButtonFormItemAutoComplete position={0}
                                              onClick={firstBtnOnClick}
                                              icon={<PlusOutlined/>}
                                              type="dashed"
                                              style={ButtonGreenStyle}/>
    </BaseStyledSpaceCompactFormItemAutoComplete>

);
const StyledFormItemAutoComplete = ({
                                        formName,
                                        formLabel,
                                        onSelect,
                                        placeholder,
                                        loading,
                                        onSearch,
                                        formatOptionText,
                                        mode,
                                        labelCol,
                                        wrapperCol,
                                        size,
                                        width,

                                        typeData, data, stateSearch, setStateSearch
                                    }) => (
    <BaseStyledSpaceCompactFormItemAutoComplete width={width ?? "100%"}>
        <BaseStyledFormItemAutoComplete formName={formName}
                                        formLabel={formLabel}
                                        onSelect={onSelect}
                                        onSearch={onSearch}
                                        placeholder={placeholder}
                                        loading={loading}
                                        formatOptionText={formatOptionText}
                                        mode={mode}
                                        width={width ?? "100%"}

                                        labelCol={labelCol}
                                        wrapperCol={wrapperCol}
                                        size={size}
                                        typeData={typeData} data={data} stateSearch={stateSearch} setStateSearch={setStateSearch}/>
    </BaseStyledSpaceCompactFormItemAutoComplete>

);
const StyledFormItemAutoCompleteAndCreateWitchEdit = ({
                                                          formName,
                                                          formLabel,
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
                                                          labelCol,
                                                          wrapperCol,

                                                          data, stateSearch, setStateSearch, typeData
                                                      }) => (
    <BaseStyledSpaceCompactFormItemAutoComplete width={"calc(100% + 64px)"}>
        <BaseStyledFormItemAutoComplete formName={formName}
                                        formLabel={formLabel}
                                        onSelect={onSelect}
                                        onSearch={onSearch}
                                        placeholder={placeholder}
                                        loading={loading}
                                        items={items}
                                        formatOptionText={formatOptionText}
                                        mode={mode}
                                        width={"calc(100% - 64px)"}

                                        labelCol={labelCol}
                                        wrapperCol={wrapperCol}
                                        typeData={typeData} data={data} stateSearch={stateSearch} setStateSearch={setStateSearch}/>

        <BaseStyledButtonFormItemAutoComplete position={1} onClick={firstBtnOnClick}
                                              icon={<PlusOutlined/>}
                                              type={'dashed'}
                                              style={ButtonGreenStyle}/>
        <BaseStyledButtonFormItemAutoComplete position={2} onClick={secondBtnOnClick}
                                              type={"dashed"}
                                              icon={<EditOutlined/>}
                                              disable={secondDisable}/>
    </BaseStyledSpaceCompactFormItemAutoComplete>

);

export {
    StyledFormItemAutoCompleteAndCreate,
    StyledFormItemAutoCompleteAndCreateWitchEdit,
    StyledFormItemAutoComplete,
    BaseStyledFormItemAutoComplete
};

