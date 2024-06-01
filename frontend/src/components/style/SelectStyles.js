import React from 'react';
import {Button, Form, Select, Space} from 'antd';
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
const BaseStyledFormItemSelect = ({
                                      formName,
                                      formLabel,
                                      width,
                                      onSelect,
                                      onSearch,
                                      placeholder,
                                      loading,
                                      items,
                                      formatOptionText,
                                      mode,
                                      labelCol,
    size,
                                      wrapperCol
                                  }) => (

    <Form.Item name={formName} labelCol={labelCol} wrapperCol={wrapperCol} label={formLabel} style={{width: width}}>
        <Select
            style={{width: width}}
            popupMatchSelectWidth={false}
            allowClear
            showSearch
            size={size ?? 'regular'}
            mode={mode
                ?? ''}
            onSelect={(value, option) => onSelect && onSelect(value, option)}
            onSearch={value => onSearch && onSearch(value)}
            filterOption={false}
            placeholder={placeholder}
            loading={loading}
        >
            {items?.map(row => (
                <Select.Option key={row.id} value={row.id}>
                    {formatOptionText(row)}
                </Select.Option>
            ))}
        </Select>
    </Form.Item>
);

const BaseStyledButtonFormItemSelect = ({onClick, position, type, icon, style,disabled}) => (
    <Button
        style={{
            ...style,
            marginBottom: 10,
            marginLeft: position === 0 ? -32 : position === 1 ? -64 :  position === 2 ? 0 : 0
        }}
        type={type}
        icon={icon}
        disabled={disabled}
        onClick={() => onClick && onClick(true)}
    />
);
const BaseStyledSpaceCompactFormItemSelect = ({width, children}) => (
    <Space.Compact  style={
        {
            width: width,
            alignItems: 'flex-end'
        }
    }>
        {children}
    </Space.Compact>
);
const StyledFormItemSelectAndCreate = ({
                                           formName,
                                           formLabel,
                                           onSelect,
                                           onSearch,
                                           placeholder,
                                           loading,
                                           items,
                                           firstBtnOnClick,
                                           formatOptionText,
                                           mode
                                       }) => (
<BaseStyledSpaceCompactFormItemSelect width={"calc(100% + 32px)"}>
    <BaseStyledFormItemSelect       formName={formName}
                                    formLabel ={formLabel}
                                    onSelect ={onSelect}
                                    placeholder = {placeholder}
                                    loading = {loading}
                                    items = {items}
                                    onSearch = {onSearch}
                                    formatOptionText ={formatOptionText}
                                    mode = {mode}
                                    width={"calc(100% - 32px)"}/>

    <BaseStyledButtonFormItemSelect position={0}
                                    onClick={firstBtnOnClick}
                                    icon={<PlusOutlined/>}
                                    type="dashed"
                                    style={ButtonGreenStyle}/>
</BaseStyledSpaceCompactFormItemSelect>

);
const StyledFormItemSelect = ({
                                                    formName,
                                                    formLabel,
                                                    onSelect,
                                                    placeholder,
                                                    loading,
                                                    items,
                                                    onSearch,
                                                    formatOptionText,
                                                    mode,
                                                    labelCol,
                                                    wrapperCol,
                                                    size,
                                                    width
                                                }) => (
    <BaseStyledSpaceCompactFormItemSelect width={width ?? "100%"}>
        <BaseStyledFormItemSelect     formName={formName}
                                      formLabel ={formLabel}
                                      onSelect ={onSelect}
                                      onSearch = {onSearch}
                                      placeholder = {placeholder}
                                      loading = {loading}
                                      items = {items}
                                      formatOptionText ={formatOptionText}
                                      mode = {mode}
                                      width={width ?? "100%"}
                                      labelCol={labelCol}
                                      wrapperCol={wrapperCol}
                                      size={size }/>
    </BaseStyledSpaceCompactFormItemSelect>

);
const StyledFormItemSelectAndCreateWitchEdit = ({
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
                                                    wrapperCol
                                       }) => (
    <BaseStyledSpaceCompactFormItemSelect width={"calc(100% + 64px)"}>
        <BaseStyledFormItemSelect     formName={formName}
                                      formLabel ={formLabel}
                                      onSelect ={onSelect}
                                      onSearch = {onSearch}
                                      placeholder = {placeholder}
                                      loading = {loading}
                                      items = {items}
                                      formatOptionText ={formatOptionText}
                                      mode = {mode}
                                      width={"calc(100% - 64px)"}
                                      labelCol={labelCol}
                                      wrapperCol={wrapperCol}/>
        <BaseStyledButtonFormItemSelect  position={1} onClick={firstBtnOnClick}
                                         icon={<PlusOutlined/>}
                                         type={'dashed'}
                                         style={ButtonGreenStyle}/>
        <BaseStyledButtonFormItemSelect position={2} onClick={secondBtnOnClick}
                                        type={"dashed"}
                                        icon={<EditOutlined/>}
                                    disable={secondDisable}/>
    </BaseStyledSpaceCompactFormItemSelect>

);

export {StyledFormItemSelectAndCreate, StyledFormItemSelectAndCreateWitchEdit, StyledFormItemSelect,BaseStyledFormItemSelect};

