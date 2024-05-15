import React, {useEffect, useState} from 'react';
import {Anchor, Col, Form, Input, Row, Space} from 'antd';
import {StyledBlockBig} from "../../style/BlockStyles";
import {StyledFormItemComputing} from "./ComputingStyles";


const FirstComputingForm = () => {
    const [t3, setT3] = useState(0);
    const [t7, setT7] = useState(0);
    const [t8, setT8] = useState(0);
    const [t9, setT9] = useState(0);
    const [n1_2, setN1_2] = useState(0);
    const [n1_1, setN1_1] = useState(0);
    const [n4_1, setN4_1] = useState(0);
    const [n4_2, setN4_2] = useState(0);
    const [n5_1, setN5_1] = useState(0);
    const [n5_2, setN5_2] = useState(0);
    const [n6_1, setN6_1] = useState(0);
    const [n6_2, setN6_2] = useState(0);
    const [n7_1, setN7_1] = useState(0);
    const [n7_2, setN7_2] = useState(0);
    const [n10_1, setN10_1] = useState(0);
    const [n10_2, setN10_2] = useState(0);
    const [n14_1, setN14_1] = useState(0);
    const [n14_2, setN14_2] = useState(0);
    const [n15_1, setN15_1] = useState(0);
    const [n15_2, setN15_2] = useState(0);
    const [n16_1, setN16_1] = useState(0);
    const [n16_2, setN16_2] = useState(0);
    const [n17_1, setN17_1] = useState(0);
    const [n17_2, setN17_2] = useState(0);
    const [n18_1, setN18_1] = useState(0);
    const [n18_2, setN18_2] = useState(0);
    const [n19_1, setN19_1] = useState(0);
    const [n19_2, setN19_2] = useState(0);

    const [x1_1, setX1_1] = useState(0);
    const [x1_2, setX1_2] = useState(0);
    const [x1_3, setX1_3] = useState(0);
    const [x2_1, setX2_1] = useState(0);
    const [x2_2, setX2_2] = useState(0);
    const [x2_3, setX2_3] = useState(0);
    const [x3_1, setX3_1] = useState(0);
    const [x3_2, setX3_2] = useState(0);
    const [x3_3, setX3_3] = useState(0);


    const [x6_1, setX6_1] = useState(0);
    const [x6_2, setX6_2] = useState(0);
    const [x6_3, setX6_3] = useState(0);
    const [x7_1, setX7_1] = useState(0);
    const [x7_2, setX7_2] = useState(0);
    const [x7_3, setX7_3] = useState(0);
    const [x8_1, setX8_1] = useState(0);
    const [x8_2, setX8_2] = useState(0);
    const [x8_3, setX8_3] = useState(0);


    const [x11_1, setX11_1] = useState(0);
    const [x11_2, setX11_2] = useState(0);
    const [x11_3, setX11_3] = useState(0);
    const [x12_1, setX12_1] = useState(0);
    const [x12_2, setX12_2] = useState(0);
    const [x12_3, setX12_3] = useState(0);

    const [x14_1, setX14_1] = useState(0);
    const [x14_2, setX14_2] = useState(0);
    const [x14_3, setX14_3] = useState(0);
    const [x15_1, setX15_1] = useState(0);
    const [x15_2, setX15_2] = useState(0);
    const [x15_3, setX15_3] = useState(0);
    const [x16_1, setX16_1] = useState(0);
    const [x16_2, setX16_2] = useState(0);
    const [x16_3, setX16_3] = useState(0);
    const [x17_1, setX17_1] = useState(0);
    const [x17_2, setX17_2] = useState(0);
    const [x17_3, setX17_3] = useState(0);
    const [x18_1, setX18_1] = useState(0);
    const [x18_2, setX18_2] = useState(0);
    const [x18_3, setX18_3] = useState(0);

    const [x20_1, setX20_1] = useState(0);
    const [x20_2, setX20_2] = useState(0);
    const [x20_3, setX20_3] = useState(0);
    const [x22_1, setX22_1] = useState(0);
    const [x22_2, setX22_2] = useState(0);
    const [x22_3, setX22_3] = useState(0);
    const [x34_1, setX34_1] = useState(0);
    const [x34_2, setX34_2] = useState(0);
    const [x34_3, setX34_3] = useState(0);
    const [x35_1, setX35_1] = useState(0);
    const [x35_2, setX35_2] = useState(0);
    const [x35_3, setX35_3] = useState(0);
    const [x37_1, setX37_1] = useState(0);
    const [x37_2, setX37_2] = useState(0);
    const [x37_3, setX37_3] = useState(0);

    const [x41_1, setX41_1] = useState(0);
    const [x41_2, setX41_2] = useState(0);
    const [x41_3, setX41_3] = useState(0);
    const [x42_1, setX42_1] = useState(0);
    const [x42_2, setX42_2] = useState(0);
    const [x42_3, setX42_3] = useState(0);
    const [x43_1, setX43_1] = useState(0);
    const [x43_2, setX43_2] = useState(0);
    const [x43_3, setX43_3] = useState(0);

    const [x45_1, setX45_1] = useState(0);
    const [x45_2, setX45_2] = useState(0);
    const [x45_3, setX45_3] = useState(0);
    const [x46_1, setX46_1] = useState(0);
    const [x46_2, setX46_2] = useState(0);
    const [x46_3, setX46_3] = useState(0);
    const [x47_1, setX47_1] = useState(0);
    const [x47_2, setX47_2] = useState(0);
    const [x47_3, setX47_3] = useState(0);
    const [x48_1, setX48_1] = useState(0);
    const [x48_2, setX48_2] = useState(0);
    const [x48_3, setX48_3] = useState(0);
    const [x49_1, setX49_1] = useState(0);
    const [x49_2, setX49_2] = useState(0);
    const [x49_3, setX49_3] = useState(0);
    const [x50_1, setX50_1] = useState(0);
    const [x50_2, setX50_2] = useState(0);
    const [x50_3, setX50_3] = useState(0);

    const [x52_1, setX52_1] = useState(0);
    const [x52_2, setX52_2] = useState(0);
    const [x52_3, setX52_3] = useState(0);
    const [x53_1, setX53_1] = useState(0);
    const [x53_2, setX53_2] = useState(0);
    const [x53_3, setX53_3] = useState(0);
    const [x54_1, setX54_1] = useState(0);
    const [x54_2, setX54_2] = useState(0);
    const [x54_3, setX54_3] = useState(0);
    const [x55_1, setX55_1] = useState(0);
    const [x55_2, setX55_2] = useState(0);
    const [x55_3, setX55_3] = useState(0);
    const [x56_1, setX56_1] = useState(0);
    const [x56_2, setX56_2] = useState(0);
    const [x56_3, setX56_3] = useState(0);
    const [x57_1, setX57_1] = useState(0);
    const [x57_2, setX57_2] = useState(0);
    const [x57_3, setX57_3] = useState(0);
    const [x58_1, setX58_1] = useState(0);
    const [x58_2, setX58_2] = useState(0);
    const [x58_3, setX58_3] = useState(0);
    const [x59_1, setX59_1] = useState(0);
    const [x59_2, setX59_2] = useState(0);
    const [x59_3, setX59_3] = useState(0);

    const [x61_1, setX61_1] = useState(0);
    const [x61_2, setX61_2] = useState(0);
    const [x61_3, setX61_3] = useState(0);

    const [x63_1, setX63_1] = useState(0);
    const [x63_2, setX63_2] = useState(0);
    const [x63_3, setX63_3] = useState(0);
    const [x64_1, setX64_1] = useState(0);
    const [x64_2, setX64_2] = useState(0);
    const [x64_3, setX64_3] = useState(0);


    const [x67_1, setX67_1] = useState(0);
    const [x67_2, setX67_2] = useState(0);
    const [x67_3, setX67_3] = useState(0);

    const [x69_1, setX69_1] = useState(0);
    const [x69_2, setX69_2] = useState(0);
    const [x69_3, setX69_3] = useState(0);

    const [x71_1, setX71_1] = useState(0);
    const [x71_2, setX71_2] = useState(0);
    const [x71_3, setX71_3] = useState(0);

    const [x73_1, setX73_1] = useState(0);
    const [x73_2, setX73_2] = useState(0);
    const [x73_3, setX73_3] = useState(0);




    const [x86_1, setX86_1] = useState(0);
    const [x86_2, setX86_2] = useState(0);
    const [x86_3, setX86_3] = useState(0);
    const [x87_1, setX87_1] = useState(0);
    const [x87_2, setX87_2] = useState(0);
    const [x87_3, setX87_3] = useState(0);

    const [x89_1, setX89_1] = useState(0);
    const [x89_2, setX89_2] = useState(0);
    const [x89_3, setX89_3] = useState(0);

    const [x92_1, setX92_1] = useState(0);
    const [x92_2, setX92_2] = useState(0);
    const [x92_3, setX92_3] = useState(0);

    const [x94_1, setX94_1] = useState(0);
    const [x94_2, setX94_2] = useState(0);
    const [x94_3, setX94_3] = useState(0);

    const [x101_1, setX101_1] = useState(0);
    const [x101_2, setX101_2] = useState(0);
    const [x101_3, setX101_3] = useState(0);

    const [x103_1, setX103_1] = useState(0);
    const [x103_2, setX103_2] = useState(0);
    const [x103_3, setX103_3] = useState(0);

    const [x105_1, setX105_1] = useState(0);
    const [x105_2, setX105_2] = useState(0);
    const [x105_3, setX105_3] = useState(0);
    const [x106_1, setX106_1] = useState(0);
    const [x106_2, setX106_2] = useState(0);
    const [x106_3, setX106_3] = useState(0);
    const [x107_1, setX107_1] = useState(0);
    const [x107_2, setX107_2] = useState(0);
    const [x107_3, setX107_3] = useState(0);

    const [x109_1, setX109_1] = useState(0);
    const [x109_2, setX109_2] = useState(0);
    const [x109_3, setX109_3] = useState(0);

    const [x111_1, setX111_1] = useState(0);
    const [x111_2, setX111_2] = useState(0);
    const [x111_3, setX111_3] = useState(0);

    const [x115_1, setX115_1] = useState(0);
    const [x115_2, setX115_2] = useState(0);
    const [x115_3, setX115_3] = useState(0);
    const [x116_1, setX116_1] = useState(0);
    const [x116_2, setX116_2] = useState(0);
    const [x116_3, setX116_3] = useState(0);
    const [x117_1, setX117_1] = useState(0);
    const [x117_2, setX117_2] = useState(0);
    const [x117_3, setX117_3] = useState(0);
    const [x118_1, setX118_1] = useState(0);
    const [x118_2, setX118_2] = useState(0);
    const [x118_3, setX118_3] = useState(0);

    const [x120_1, setX120_1] = useState(0);
    const [x120_2, setX120_2] = useState(0);
    const [x120_3, setX120_3] = useState(0);

    const [x122_1, setX122_1] = useState(0);
    const [x122_2, setX122_2] = useState(0);
    const [x122_3, setX122_3] = useState(0);
    const [x123_1, setX123_1] = useState(0);
    const [x123_2, setX123_2] = useState(0);
    const [x123_3, setX123_3] = useState(0);

    const [x129_1, setX129_1] = useState(0);
    const [x129_2, setX129_2] = useState(0);
    const [x129_3, setX129_3] = useState(0);


    const [x133_1, setX133_1] = useState(0);
    const [x133_2, setX133_2] = useState(0);
    const [x133_3, setX133_3] = useState(0);

    const [x137_1, setX137_1] = useState(0);
    const [x137_2, setX137_2] = useState(0);
    const [x137_3, setX137_3] = useState(0);
    const [x138_1, setX138_1] = useState(0);
    const [x138_2, setX138_2] = useState(0);
    const [x138_3, setX138_3] = useState(0);

    const [x142_1, setX142_1] = useState(0);
    const [x142_2, setX142_2] = useState(0);
    const [x142_3, setX142_3] = useState(0);

    const [x144_1, setX144_1] = useState(0);
    const [x144_2, setX144_2] = useState(0);
    const [x144_3, setX144_3] = useState(0);
    const [x145_1, setX145_1] = useState(0);
    const [x145_2, setX145_2] = useState(0);
    const [x145_3, setX145_3] = useState(0);
    const [x146_1, setX146_1] = useState(0);
    const [x146_2, setX146_2] = useState(0);
    const [x146_3, setX146_3] = useState(0);
    const [x147_1, setX147_1] = useState(0);
    const [x147_2, setX147_2] = useState(0);
    const [x147_3, setX147_3] = useState(0);

    const [x149_1, setX149_1] = useState(0);
    const [x149_2, setX149_2] = useState(0);
    const [x149_3, setX149_3] = useState(0);
    const [x150_1, setX150_1] = useState(0);
    const [x150_2, setX150_2] = useState(0);
    const [x150_3, setX150_3] = useState(0);
    const [x151_1, setX151_1] = useState(0);
    const [x151_2, setX151_2] = useState(0);
    const [x151_3, setX151_3] = useState(0);

    const [x156_1, setX156_1] = useState(0);
    const [x156_2, setX156_2] = useState(0);
    const [x156_3, setX156_3] = useState(0);

    const [x159_1, setX159_1] = useState(0);
    const [x159_2, setX159_2] = useState(0);
    const [x159_3, setX159_3] = useState(0);
    const [x160_1, setX160_1] = useState(0);
    const [x160_2, setX160_2] = useState(0);
    const [x160_3, setX160_3] = useState(0);
    const [x161_1, setX161_1] = useState(0);
    const [x161_2, setX161_2] = useState(0);
    const [x161_3, setX161_3] = useState(0);
    const [x162_1, setX162_1] = useState(0);
    const [x162_2, setX162_2] = useState(0);
    const [x162_3, setX162_3] = useState(0);
    const [x163_1, setX163_1] = useState(0);
    const [x163_2, setX163_2] = useState(0);
    const [x163_3, setX163_3] = useState(0);
    const [x164_1, setX164_1] = useState(0);
    const [x164_2, setX164_2] = useState(0);
    const [x164_3, setX164_3] = useState(0);

    const [k1_1, setK1_1] = useState(0);
    const [k1_2, setK1_2] = useState(0);
    const [k2_1, setK2_1] = useState(0);
    const [k2_2, setK2_2] = useState(0);
    const [k3_1, setK3_1] = useState(0);
    const [k3_2, setK3_2] = useState(0);
    const [k4_1, setK4_1] = useState(0);
    const [k4_2, setK4_2] = useState(0);
    const [k5_1, setK5_1] = useState(0);
    const [k5_2, setK5_2] = useState(0);
    const [k6_1, setK6_1] = useState(0);
    const [k6_2, setK6_2] = useState(0);
    const [k7_1, setK7_1] = useState(0);
    const [k7_2, setK7_2] = useState(0);
    const [k8_1, setK8_1] = useState(0);
    const [k8_2, setK8_2] = useState(0);
    const [k9_1, setK9_1] = useState(0);
    const [k9_2, setK9_2] = useState(0);
    const [k10_1, setK10_1] = useState(0);
    const [k10_2, setK10_2] = useState(0);
    const [k11_1, setK11_1] = useState(0);
    const [k11_2, setK11_2] = useState(0);
    const [k12_1, setK12_1] = useState(0);
    const [k12_2, setK12_2] = useState(0);
    const [k13_1, setK13_1] = useState(0);
    const [k13_2, setK13_2] = useState(0);
    const [k14_1, setK14_1] = useState(0);
    const [k14_2, setK14_2] = useState(0);
    const [k15_1, setK15_1] = useState(0);
    const [k15_2, setK15_2] = useState(0);
    const [k16_1, setK16_1] = useState(0);
    const [k16_2, setK16_2] = useState(0);
    const [k17_1, setK17_1] = useState(0);
    const [k17_2, setK17_2] = useState(0);
    const [k18_1, setK18_1] = useState(0);
    const [k18_2, setK18_2] = useState(0);
    const [k19_1, setK19_1] = useState(0);
    const [k19_2, setK19_2] = useState(0);
    const [k20_1, setK20_1] = useState(0);
    const [k20_2, setK20_2] = useState(0);
    const [k21_1, setK21_1] = useState(0);
    const [k21_2, setK21_2] = useState(0);
    const [k22_1, setK22_1] = useState(0);
    const [k22_2, setK22_2] = useState(0);
    const [k23_1, setK23_1] = useState(0);
    const [k23_2, setK23_2] = useState(0);
    const [k24_1, setK24_1] = useState(0);
    const [k24_2, setK24_2] = useState(0);
    const [k25_1, setK25_1] = useState(0);
    const [k25_2, setK25_2] = useState(0);
    const [k26_1, setK26_1] = useState(0);
    const [k26_2, setK26_2] = useState(0);
    const [k27_1, setK27_1] = useState(0);
    const [k27_2, setK27_2] = useState(0);
    const [k28_1, setK28_1] = useState(0);
    const [k28_2, setK28_2] = useState(0);
    const [k29_1, setK29_1] = useState(0);
    const [k29_2, setK29_2] = useState(0);
    const [k30_1, setK30_1] = useState(0);
    const [k30_2, setK30_2] = useState(0);
    const [k31_1, setK31_1] = useState(0);
    const [k31_2, setK31_2] = useState(0);
    const [k32_1, setK32_1] = useState(0);
    const [k32_2, setK32_2] = useState(0);
    const [k33_1, setK33_1] = useState(0);
    const [k33_2, setK33_2] = useState(0);
    const [k34_1, setK34_1] = useState(0);
    const [k34_2, setK34_2] = useState(0);
    const [k35_1, setK35_1] = useState(0);
    const [k35_2, setK35_2] = useState(0);
    const [k36_1, setK36_1] = useState(0);
    const [k36_2, setK36_2] = useState(0);
    const [k37_1, setK37_1] = useState(0);
    const [k37_2, setK37_2] = useState(0);
    const [k38_1, setK38_1] = useState(0);
    const [k38_2, setK38_2] = useState(0);
    const [k39_1, setK39_1] = useState(0);
    const [k39_2, setK39_2] = useState(0);
    const [k40_1, setK40_1] = useState(0);
    const [k40_2, setK40_2] = useState(0);
    const [k41_1, setK41_1] = useState(0);
    const [k41_2, setK41_2] = useState(0);
    const [k42_1, setK42_1] = useState(0);
    const [k42_2, setK42_2] = useState(0);
    const [k43_1, setK43_1] = useState(0);
    const [k43_2, setK43_2] = useState(0);


    const [firstForm] = Form.useForm();
    const [twoForm] = Form.useForm();
    const [friForm] = Form.useForm();
    const [fourForm] = Form.useForm();

    useEffect(() => {
        handleComputing();
    }, [t3, t7, t8, t9, n1_2, n1_1, n4_1, n4_2, n5_1, n5_2, n6_1, n6_2, n7_1, n7_2, n10_1, n10_2, n15_1, n15_2, n16_1, n16_2, n17_1, n17_2, n18_1, n18_2]);
    const handleComputing = () => {
        console.log("handleComputing", friForm.getFieldValue("n18-1"));
        const computeValue = (value, fallback) => value ? isNaN(value) ? "" : typeof value === "number" ? value.toFixed(3) : value : fallback ? isNaN(fallback) ? "" : typeof fallback === "number" ? fallback.toFixed(3) : "" : "";
        function degToRad(degrees) {
            return degrees * Math.PI / 180;
        }
        // isNaN(value)
        //     ? ""
        //     : typeof (value || (!isNaN(fallback) ? fallback : "")) === "number"
        //         ? (value || (!isNaN(fallback) ? fallback : "")).toFixed(3)
        //         : "";

        twoForm.setFieldValue("t3", computeValue(t3, parseFloat(twoForm.getFieldValue("t1")) + parseFloat(twoForm.getFieldValue("t2"))));
        twoForm.setFieldValue("t7", computeValue(t7, firstForm.getFieldValue("a7")));
        twoForm.setFieldValue("t8", computeValue(t8, parseFloat(twoForm.getFieldValue("t3")) * parseFloat(twoForm.getFieldValue("t4")) * parseFloat(twoForm.getFieldValue("t5")) * (1 + parseFloat(twoForm.getFieldValue("t6"))) * parseFloat(twoForm.getFieldValue("t7"))));
        twoForm.setFieldValue("t9", computeValue(t9, firstForm.getFieldValue("a2")));

        friForm.setFieldValue("n1-2", computeValue(n1_2, firstForm.getFieldValue("a4")));
        friForm.setFieldValue("n1-1", computeValue(n1_1, parseFloat(firstForm.getFieldValue("a2")) / parseFloat(firstForm.getFieldValue("a7"))));
        friForm.setFieldValue("n4-1", computeValue(n4_1, parseFloat(friForm.getFieldValue("n1-1")) * parseFloat(friForm.getFieldValue("n3-1"))));
        friForm.setFieldValue("n4-2", computeValue(n4_2, parseFloat(friForm.getFieldValue("n1-2")) * parseFloat(friForm.getFieldValue("n3-2"))));
        friForm.setFieldValue("n5-1", computeValue(n5_1, parseFloat(friForm.getFieldValue("n4-1")) / parseFloat(friForm.getFieldValue("n14-1"))));
        friForm.setFieldValue("n5-2", computeValue(n5_2, parseFloat(friForm.getFieldValue("n4-2")) / parseFloat(friForm.getFieldValue("n14-2"))));
        friForm.setFieldValue("n6-1", computeValue(n6_1, parseFloat(friForm.getFieldValue("n7-1")) * parseFloat(friForm.getFieldValue("n14-1"))));
        friForm.setFieldValue("n6-2", computeValue(n6_2, parseFloat(friForm.getFieldValue("n7-2")) * parseFloat(friForm.getFieldValue("n14-2"))));
        friForm.setFieldValue("n7-1", computeValue(n7_1, parseFloat(friForm.getFieldValue("n8-1")) * parseFloat(friForm.getFieldValue("n9-1")) * parseFloat(friForm.getFieldValue("n10-1")) * (1 - parseFloat(friForm.getFieldValue("n13-1")))));
        friForm.setFieldValue("n7-2", computeValue(n7_2, parseFloat(friForm.getFieldValue("n8-2")) * parseFloat(friForm.getFieldValue("n9-2")) * parseFloat(friForm.getFieldValue("n10-2")) * (1 - parseFloat(friForm.getFieldValue("n13-2")))));
        friForm.setFieldValue("n10-1", computeValue(n10_1, 0.5 * parseFloat(friForm.getFieldValue("n11-1")) / parseFloat(friForm.getFieldValue("n12-1"))));
        friForm.setFieldValue("n10-2", computeValue(n10_2, 0.5 * parseFloat(friForm.getFieldValue("n11-2")) / parseFloat(friForm.getFieldValue("n12-2"))));
        friForm.setFieldValue("n14-1", computeValue(n14_1, Math.pow(parseFloat(friForm.getFieldValue("n11-1")) / 1000, 3)));
        friForm.setFieldValue("n14-2", computeValue(n14_2, Math.pow(parseFloat(friForm.getFieldValue("n11-2")) / 1000, 3)));
        friForm.setFieldValue("n15-1", computeValue(n15_1, parseFloat(friForm.getFieldValue("n7-1")) * parseFloat(friForm.getFieldValue("n4-1"))));
        friForm.setFieldValue("n15-2", computeValue(n15_2, parseFloat(friForm.getFieldValue("n7-2")) * parseFloat(friForm.getFieldValue("n4-2"))));
        friForm.setFieldValue("n16-1", computeValue(n16_1, parseFloat(friForm.getFieldValue("n7-1")) / (parseFloat(friForm.getFieldValue("n14-1")) * parseFloat(friForm.getFieldValue("n8-1")))));
        friForm.setFieldValue("n16-2", computeValue(n16_2, parseFloat(friForm.getFieldValue("n7-2")) / (parseFloat(friForm.getFieldValue("n14-2")) * parseFloat(friForm.getFieldValue("n8-2")))));
        friForm.setFieldValue("n17-1", computeValue(n17_1, parseFloat(friForm.getFieldValue("n16-1"))) * parseFloat(friForm.getFieldValue("n4-1")));
        friForm.setFieldValue("n17-2", computeValue(n17_2, parseFloat(friForm.getFieldValue("n16-2"))) * parseFloat(friForm.getFieldValue("n4-2")));
        friForm.setFieldValue("n18-1", computeValue(n18_1, (1 / parseFloat(friForm.getFieldValue("n14-1"))) * Math.pow(parseFloat(friForm.getFieldValue("n7-1")) / parseFloat(friForm.getFieldValue("n8-2")), 2 / 3)));
        friForm.setFieldValue("n18-2", computeValue(n18_2, (1 / parseFloat(friForm.getFieldValue("n14-2"))) * Math.pow(parseFloat(friForm.getFieldValue("n7-2")) / parseFloat(friForm.getFieldValue("n8-2")), 2 / 3)));
        friForm.setFieldValue("n19-1", computeValue(n19_1, parseFloat(friForm.getFieldValue("n18-1")) * parseFloat(friForm.getFieldValue("n4-1"))));
        friForm.setFieldValue("n19-2", computeValue(n19_2, parseFloat(friForm.getFieldValue("n18-2")) * parseFloat(friForm.getFieldValue("n4-2"))));

        fourForm.setFieldValue("x2-1", computeValue(x2_1, parseFloat(firstForm.getFieldValue("a11"))));
        fourForm.setFieldValue("x2-2", computeValue(x2_2, parseFloat(firstForm.getFieldValue("a11"))));

        fourForm.setFieldValue("x3-1", computeValue(x3_1, parseFloat(firstForm.getFieldValue("a22"))));
        fourForm.setFieldValue("x3-2", computeValue(x3_2, parseFloat(firstForm.getFieldValue("a22"))));
        fourForm.setFieldValue("x3-3", computeValue(x3_3, parseFloat(firstForm.getFieldValue("a22"))));

        fourForm.setFieldValue("x6-1", computeValue(x6_1, parseFloat(fourForm.getFieldValue("x4-1")) * parseFloat(fourForm.getFieldValue("x-1"))));
        fourForm.setFieldValue("x6-2", computeValue(x6_2, parseFloat(fourForm.getFieldValue("x4-2")) * parseFloat(fourForm.getFieldValue("x5-2"))));
        fourForm.setFieldValue("x6-3", computeValue(x6_3, parseFloat(fourForm.getFieldValue("x4-3")) * parseFloat(fourForm.getFieldValue("x5-3"))));

        fourForm.setFieldValue("x7-1", computeValue(x7_1, Math.sqrt(parseFloat(fourForm.getFieldValue("x8-1")) / parseFloat(fourForm.getFieldValue("x10-1")))));
        fourForm.setFieldValue("x7-2", computeValue(x7_2, Math.sqrt(parseFloat(fourForm.getFieldValue("x8-2")) / parseFloat(fourForm.getFieldValue("x10-2")))));
        fourForm.setFieldValue("x7-3", computeValue(x7_3, Math.sqrt(parseFloat(fourForm.getFieldValue("x8-3")) / parseFloat(fourForm.getFieldValue("x10-3")))));

        fourForm.setFieldValue("x8-1", computeValue(x8_1, 0.785 * Math.pow((parseFloat(fourForm.getFieldValue("x6-1")) / 1000), 2) * parseFloat(fourForm.getFieldValue("x9-1"))));
        fourForm.setFieldValue("x8-2", computeValue(x8_2, 0.785 * Math.pow((parseFloat(fourForm.getFieldValue("x6-2")) / 1000), 2) * parseFloat(fourForm.getFieldValue("x9-2"))));
        fourForm.setFieldValue("x8-3", computeValue(x8_3, 0.785 * Math.pow((parseFloat(fourForm.getFieldValue("x6-3")) / 1000), 2) * parseFloat(fourForm.getFieldValue("x9-3"))));

        fourForm.setFieldValue("x11-1", computeValue(x11_1, 20 * (parseFloat(fourForm.getFieldValue("x6-1")) / 1000) + 0.2 * parseFloat(fourForm.getFieldValue("x12-1")) - 1.5));
        fourForm.setFieldValue("x11-2", computeValue(x11_2, 20 * (parseFloat(fourForm.getFieldValue("x6-2")) / 1000) + 0.2 * parseFloat(fourForm.getFieldValue("x12-2")) - 1.5));
        fourForm.setFieldValue("x11-3", computeValue(x11_3, 20 * (parseFloat(fourForm.getFieldValue("x6-3")) / 1000) + 0.2 * parseFloat(fourForm.getFieldValue("x12-3")) - 1.5));

        fourForm.setFieldValue("x12-1", computeValue(x12_1, parseFloat(fourForm.getFieldValue("x3-1")) * Math.pow((parseFloat(fourForm.getFieldValue("x13-1")) / (parseFloat(fourForm.getFieldValue("x3-1")) * parseFloat(fourForm.getFieldValue("x22-1")))), 0.25)));
        fourForm.setFieldValue("x12-2", computeValue(x12_2, parseFloat(fourForm.getFieldValue("x3-2")) * Math.pow((parseFloat(fourForm.getFieldValue("x13-2")) / (parseFloat(fourForm.getFieldValue("x3-2")) * parseFloat(fourForm.getFieldValue("x22-2")))), 0.25)));
        fourForm.setFieldValue("x12-3", computeValue(x12_3, parseFloat(fourForm.getFieldValue("x3-3")) * Math.pow((parseFloat(fourForm.getFieldValue("x13-3")) / (parseFloat(fourForm.getFieldValue("x3-3")) * parseFloat(fourForm.getFieldValue("x22-3")))), 0.25)));

        fourForm.setFieldValue("x14-1", computeValue(x14_1, parseFloat(fourForm.getFieldValue("x3-1")) - parseFloat(fourForm.getFieldValue("x11-1"))));
        fourForm.setFieldValue("x14-2", computeValue(x14_2, parseFloat(fourForm.getFieldValue("x3-2")) - parseFloat(fourForm.getFieldValue("x11-2"))));
        fourForm.setFieldValue("x14-3", computeValue(x14_3, parseFloat(fourForm.getFieldValue("x3-3")) - parseFloat(fourForm.getFieldValue("x11-3"))));

        fourForm.setFieldValue("x15-1", computeValue(x15_1, parseFloat(fourForm.getFieldValue("x14-1")) * Math.pow(Math.pow(1 + (parseFloat(fourForm.getFieldValue("x7-1")) / parseFloat(fourForm.getFieldValue("x14-1"))), 2), 0.333) - 1));
        fourForm.setFieldValue("x15-2", computeValue(x15_2, parseFloat(fourForm.getFieldValue("x14-2")) * Math.pow(Math.pow(1 + (parseFloat(fourForm.getFieldValue("x7-2")) / parseFloat(fourForm.getFieldValue("x14-2"))), 2), 0.333) - 1));
        fourForm.setFieldValue("x15-3", computeValue(x15_3, parseFloat(fourForm.getFieldValue("x14-3")) * Math.pow(Math.pow(1 + (parseFloat(fourForm.getFieldValue("x7-3")) / parseFloat(fourForm.getFieldValue("x14-3"))), 2), 0.333) - 1));

        fourForm.setFieldValue("x16-1", computeValue(x16_1, parseFloat(fourForm.getFieldValue("x3-1")) + parseFloat(fourForm.getFieldValue("x15-1"))));
        fourForm.setFieldValue("x16-2", computeValue(x16_2, parseFloat(fourForm.getFieldValue("x3-2")) + parseFloat(fourForm.getFieldValue("x15-2"))));
        fourForm.setFieldValue("x16-3", computeValue(x16_3, parseFloat(fourForm.getFieldValue("x3-3")) + parseFloat(fourForm.getFieldValue("x15-3"))));

        fourForm.setFieldValue("x17-1", computeValue(x17_1, parseFloat(fourForm.getFieldValue("x16-1")) - parseFloat(fourForm.getFieldValue("x11-1"))));
        fourForm.setFieldValue("x17-2", computeValue(x17_2, parseFloat(fourForm.getFieldValue("x16-2")) - parseFloat(fourForm.getFieldValue("x11-2"))));
        fourForm.setFieldValue("x17-3", computeValue(x17_3, parseFloat(fourForm.getFieldValue("x16-3")) - parseFloat(fourForm.getFieldValue("x11-3"))));

        fourForm.setFieldValue("x18-1", computeValue(x18_1, parseFloat(fourForm.getFieldValue("x8-1")) * parseFloat(fourForm.getFieldValue("x17-1"))));
        fourForm.setFieldValue("x18-2", computeValue(x18_2, parseFloat(fourForm.getFieldValue("x8-2")) * parseFloat(fourForm.getFieldValue("x17-2"))));
        fourForm.setFieldValue("x18-3", computeValue(x18_3, parseFloat(fourForm.getFieldValue("x8-3")) * parseFloat(fourForm.getFieldValue("x17-3"))));

        fourForm.setFieldValue("x20-1", computeValue(x20_1, parseFloat(fourForm.getFieldValue("x18-1")) - parseFloat(fourForm.getFieldValue("x21-1"))));
        fourForm.setFieldValue("x20-2", computeValue(x20_2, parseFloat(fourForm.getFieldValue("x18-2")) - parseFloat(fourForm.getFieldValue("x21-2"))));
        fourForm.setFieldValue("x20-3", computeValue(x20_3, parseFloat(fourForm.getFieldValue("x18-3")) - parseFloat(fourForm.getFieldValue("x21-3"))));

        fourForm.setFieldValue("x22-1", computeValue(x22_1, parseFloat(fourForm.getFieldValue("x23-1")) * parseFloat(fourForm.getFieldValue("x26-1")) * parseFloat(fourForm.getFieldValue("x27-1")) * parseFloat(fourForm.getFieldValue("x28-1")) * parseFloat(fourForm.getFieldValue("x29-1")) * parseFloat(fourForm.getFieldValue("x30-1")) * parseFloat(fourForm.getFieldValue("x32-1")) * (1 + parseFloat(fourForm.getFieldValue("x33-1")))));
        fourForm.setFieldValue("x22-2", computeValue(x22_2, parseFloat(fourForm.getFieldValue("x23-2")) * parseFloat(fourForm.getFieldValue("x26-2")) * parseFloat(fourForm.getFieldValue("x27-2")) * parseFloat(fourForm.getFieldValue("x28-2")) * parseFloat(fourForm.getFieldValue("x29-2")) * parseFloat(fourForm.getFieldValue("x30-2")) * parseFloat(fourForm.getFieldValue("x32-2")) * (1 + parseFloat(fourForm.getFieldValue("x33-2")))));
        fourForm.setFieldValue("x22-3", computeValue(x22_3, parseFloat(fourForm.getFieldValue("x23-3")) * parseFloat(fourForm.getFieldValue("x26-3")) * parseFloat(fourForm.getFieldValue("x27-3")) * parseFloat(fourForm.getFieldValue("x28-3")) * parseFloat(fourForm.getFieldValue("x29-3")) * parseFloat(fourForm.getFieldValue("x30-3")) * parseFloat(fourForm.getFieldValue("x32-3")) * (1 + parseFloat(fourForm.getFieldValue("x33-3")))));

        fourForm.setFieldValue("x34-1", computeValue(x34_1, parseFloat(fourForm.getFieldValue("x18-1")) * parseFloat(fourForm.getFieldValue("x26-1"))));
        fourForm.setFieldValue("x34-2", computeValue(x34_2, parseFloat(fourForm.getFieldValue("x18-2")) * parseFloat(fourForm.getFieldValue("x26-2"))));
        fourForm.setFieldValue("x34-3", computeValue(x34_3, parseFloat(fourForm.getFieldValue("x18-3")) * parseFloat(fourForm.getFieldValue("x26-1"))));

        fourForm.setFieldValue("x35-1", computeValue(x35_1, parseFloat(fourForm.getFieldValue("x7-1")) * parseFloat(fourForm.getFieldValue("x36-1"))));
        fourForm.setFieldValue("x35-2", computeValue(x35_2, parseFloat(fourForm.getFieldValue("x7-2")) * parseFloat(fourForm.getFieldValue("x36-2"))));
        fourForm.setFieldValue("x35-3", computeValue(x35_3, parseFloat(fourForm.getFieldValue("x7-3")) * parseFloat(fourForm.getFieldValue("x36-1"))));

        fourForm.setFieldValue("x37-1", computeValue(x37_1, parseFloat(fourForm.getFieldValue("x36-1")) * parseFloat(fourForm.getFieldValue("x7-1"))));
        fourForm.setFieldValue("x37-2", computeValue(x37_2, parseFloat(fourForm.getFieldValue("x36-2")) * parseFloat(fourForm.getFieldValue("x7-2"))));
        fourForm.setFieldValue("x37-3", computeValue(x37_3, parseFloat(fourForm.getFieldValue("x36-3")) * parseFloat(fourForm.getFieldValue("x7-1"))));

        //TODO: ИЗ ПОГРУЗКИ
        // fourForm.setFieldValue("x41-1", computeValue(x37_1, parseFloat(fourForm.getFieldValue("x36-1")) * parseFloat(fourForm.getFieldValue("x7-1"))));
        // fourForm.setFieldValue("x41-2", computeValue(x37_2, parseFloat(fourForm.getFieldValue("x36-3")) * parseFloat(fourForm.getFieldValue("x7-1")) ));
        // fourForm.setFieldValue("x41-3", computeValue(x37_3, parseFloat(fourForm.getFieldValue("x36-3")) * parseFloat(fourForm.getFieldValue("x7-1")) ));
        //TODO: ИЗ 2 части
        // fourForm.setFieldValue("x42-1", computeValue(x42_1, parseFloat(fourForm.getFieldValue("x36-1")) * parseFloat(fourForm.getFieldValue("x7-1"))));
        // fourForm.setFieldValue("x42-2", computeValue(x42_2, parseFloat(fourForm.getFieldValue("x36-3")) * parseFloat(fourForm.getFieldValue("x7-1")) ));
        // fourForm.setFieldValue("x42-3", computeValue(x42_3, parseFloat(fourForm.getFieldValue("x36-3")) * parseFloat(fourForm.getFieldValue("x7-1")) ));
        // fourForm.setFieldValue("x43-1", computeValue(x42_1, parseFloat(fourForm.getFieldValue("x36-1")) * parseFloat(fourForm.getFieldValue("x7-1"))));
        // fourForm.setFieldValue("x42-2", computeValue(x42_2, parseFloat(fourForm.getFieldValue("x36-3")) * parseFloat(fourForm.getFieldValue("x7-1")) ));
        // fourForm.setFieldValue("x43-3", computeValue(x42_3, parseFloat(fourForm.getFieldValue("x36-3")) * parseFloat(fourForm.getFieldValue("x7-1")) ));

        fourForm.setFieldValue("x45-1", computeValue(x45_1, parseFloat(fourForm.getFieldValue("x43-1")) / parseFloat(fourForm.getFieldValue("x33-1"))));
        fourForm.setFieldValue("x45-2", computeValue(x45_2, parseFloat(fourForm.getFieldValue("x43-2")) / parseFloat(fourForm.getFieldValue("x33-2"))));
        fourForm.setFieldValue("x45-3", computeValue(x45_3, parseFloat(fourForm.getFieldValue("x43-3")) / parseFloat(fourForm.getFieldValue("x33-3"))));

        fourForm.setFieldValue("x46-1", computeValue(x46_1, parseFloat(fourForm.getFieldValue("x18-1")) * parseFloat(fourForm.getFieldValue("x45-1"))));
        fourForm.setFieldValue("x46-2", computeValue(x46_2, parseFloat(fourForm.getFieldValue("x18-2")) * parseFloat(fourForm.getFieldValue("x45-2"))));
        fourForm.setFieldValue("x46-3", computeValue(x46_3, parseFloat(fourForm.getFieldValue("x18-3")) * parseFloat(fourForm.getFieldValue("x45-3"))));

        fourForm.setFieldValue("x47-1", computeValue(x47_1, parseFloat(fourForm.getFieldValue("x20-1")) * parseFloat(fourForm.getFieldValue("x45-1"))));
        fourForm.setFieldValue("x47-2", computeValue(x47_2, parseFloat(fourForm.getFieldValue("x20-2")) * parseFloat(fourForm.getFieldValue("x45-2"))));
        fourForm.setFieldValue("x47-3", computeValue(x47_3, parseFloat(fourForm.getFieldValue("x20-3")) * parseFloat(fourForm.getFieldValue("x45-3"))));

        fourForm.setFieldValue("x48-1", computeValue(x48_1, parseFloat(fourForm.getFieldValue("x21-1")) * parseFloat(fourForm.getFieldValue("x45-1"))));
        fourForm.setFieldValue("x48-2", computeValue(x48_2, parseFloat(fourForm.getFieldValue("x21-2")) * parseFloat(fourForm.getFieldValue("x45-2"))));
        fourForm.setFieldValue("x48-3", computeValue(x48_3, parseFloat(fourForm.getFieldValue("x21-3")) * parseFloat(fourForm.getFieldValue("x45-3"))));

        fourForm.setFieldValue("x49-1", computeValue(x49_1, parseFloat(fourForm.getFieldValue("x45-1"))));
        fourForm.setFieldValue("x49-2", computeValue(x49_2, parseFloat(fourForm.getFieldValue("x45-2"))));
        fourForm.setFieldValue("x49-3", computeValue(x49_3, parseFloat(fourForm.getFieldValue("x45-3"))));

        fourForm.setFieldValue("x50-1", computeValue(x50_1, 1.1 * parseFloat(fourForm.getFieldValue("x45-1")) * parseFloat(fourForm.getFieldValue("x38-1"))));
        fourForm.setFieldValue("x50-2", computeValue(x50_2, 1.1 * parseFloat(fourForm.getFieldValue("x45-2")) * parseFloat(fourForm.getFieldValue("x38-2"))));
        fourForm.setFieldValue("x50-3", computeValue(x50_3, 1.1 * parseFloat(fourForm.getFieldValue("x45-3")) * parseFloat(fourForm.getFieldValue("x38-3"))));

        fourForm.setFieldValue("x52-1", computeValue(x52_1, parseFloat(fourForm.getFieldValue("x44-1")) * parseFloat(fourForm.getFieldValue("x45-1")) * parseFloat(fourForm.getFieldValue("x70-1")) * parseFloat(fourForm.getFieldValue("x45-1"))));
        fourForm.setFieldValue("x52-2", computeValue(x52_2, parseFloat(fourForm.getFieldValue("x44-2")) * parseFloat(fourForm.getFieldValue("x45-2")) * parseFloat(fourForm.getFieldValue("x70-2")) * parseFloat(fourForm.getFieldValue("x41-2"))));
        fourForm.setFieldValue("x52-3", computeValue(x52_3, parseFloat(fourForm.getFieldValue("x44-3")) * parseFloat(fourForm.getFieldValue("x45-3")) * parseFloat(fourForm.getFieldValue("x70-3")) * parseFloat(fourForm.getFieldValue("x41-3"))));

        fourForm.setFieldValue("x53-1", computeValue(x53_1, parseFloat(fourForm.getFieldValue("x50-1")) * parseFloat(fourForm.getFieldValue("x44-1")) * parseFloat(fourForm.getFieldValue("x41-1")) * parseFloat(fourForm.getFieldValue("x70-1"))));
        fourForm.setFieldValue("x53-2", computeValue(x53_2, parseFloat(fourForm.getFieldValue("x50-2")) * parseFloat(fourForm.getFieldValue("x44-2")) * parseFloat(fourForm.getFieldValue("x41-2")) * parseFloat(fourForm.getFieldValue("x70-2"))));
        fourForm.setFieldValue("x53-3", computeValue(x53_3, parseFloat(fourForm.getFieldValue("x50-3")) * parseFloat(fourForm.getFieldValue("x44-3")) * parseFloat(fourForm.getFieldValue("x41-3")) * parseFloat(fourForm.getFieldValue("x70-3"))));

        fourForm.setFieldValue("x54-1", computeValue(x54_1, parseFloat(fourForm.getFieldValue("x51-1")) * parseFloat(fourForm.getFieldValue("x70-1")) * parseFloat(fourForm.getFieldValue("x41-1")) * parseFloat(fourForm.getFieldValue("x44-1"))));
        fourForm.setFieldValue("x54-2", computeValue(x54_2, parseFloat(fourForm.getFieldValue("x51-2")) * parseFloat(fourForm.getFieldValue("x70-2")) * parseFloat(fourForm.getFieldValue("x41-2")) * parseFloat(fourForm.getFieldValue("x44-2"))));
        fourForm.setFieldValue("x54-3", computeValue(x54_3, parseFloat(fourForm.getFieldValue("x51-3")) * parseFloat(fourForm.getFieldValue("x70-3")) * parseFloat(fourForm.getFieldValue("x41-3")) * parseFloat(fourForm.getFieldValue("x44-3"))));

        fourForm.setFieldValue("x55-1", computeValue(x55_1, parseFloat(fourForm.getFieldValue("x46-1")) / parseFloat(fourForm.getFieldValue("x43-1"))));
        fourForm.setFieldValue("x55-2", computeValue(x55_2, parseFloat(fourForm.getFieldValue("x46-2")) / parseFloat(fourForm.getFieldValue("x43-2"))));
        fourForm.setFieldValue("x55-3", computeValue(x55_3, parseFloat(fourForm.getFieldValue("x46-3")) / parseFloat(fourForm.getFieldValue("x43-3"))));

        fourForm.setFieldValue("x56-1", computeValue(x56_1, parseFloat(fourForm.getFieldValue("x47-1")) / parseFloat(fourForm.getFieldValue("x43-1"))));
        fourForm.setFieldValue("x56-2", computeValue(x56_2, parseFloat(fourForm.getFieldValue("x47-2")) / parseFloat(fourForm.getFieldValue("x43-2"))));
        fourForm.setFieldValue("x56-3", computeValue(x56_3, parseFloat(fourForm.getFieldValue("x47-3")) / parseFloat(fourForm.getFieldValue("x43-3"))));

        fourForm.setFieldValue("x57-1", computeValue(x57_1, parseFloat(fourForm.getFieldValue("x48-1")) / parseFloat(fourForm.getFieldValue("x43-1"))));
        fourForm.setFieldValue("x57-2", computeValue(x57_2, parseFloat(fourForm.getFieldValue("x48-2")) / parseFloat(fourForm.getFieldValue("x43-2"))));
        fourForm.setFieldValue("x57-3", computeValue(x57_3, parseFloat(fourForm.getFieldValue("x48-3")) / parseFloat(fourForm.getFieldValue("x43-3"))));

        fourForm.setFieldValue("x58-1", computeValue(x58_1, parseFloat(fourForm.getFieldValue("x50-1")) / parseFloat(fourForm.getFieldValue("x43-1"))));
        fourForm.setFieldValue("x58-2", computeValue(x58_2, parseFloat(fourForm.getFieldValue("x50-2")) / parseFloat(fourForm.getFieldValue("x43-2"))));
        fourForm.setFieldValue("x58-3", computeValue(x58_3, parseFloat(fourForm.getFieldValue("x50-3")) / parseFloat(fourForm.getFieldValue("x43-3"))));

        fourForm.setFieldValue("x59-1", computeValue(x59_1, parseFloat(fourForm.getFieldValue("x49-1")) / parseFloat(fourForm.getFieldValue("x43-1"))));
        fourForm.setFieldValue("x59-2", computeValue(x59_2, parseFloat(fourForm.getFieldValue("x49-2")) / parseFloat(fourForm.getFieldValue("x43-2"))));
        fourForm.setFieldValue("x59-3", computeValue(x59_3, parseFloat(fourForm.getFieldValue("x49-3")) / parseFloat(fourForm.getFieldValue("x43-3"))));

        fourForm.setFieldValue("x61-1", computeValue(x61_1, 1.05 * parseFloat(fourForm.getFieldValue("x45-1")) * parseFloat(fourForm.getFieldValue("x16-1"))));
        fourForm.setFieldValue("x61-2", computeValue(x61_2, 1.05 * parseFloat(fourForm.getFieldValue("x45-2")) * parseFloat(fourForm.getFieldValue("x16-2"))));
        fourForm.setFieldValue("x61-3", computeValue(x61_3, 1.05 * parseFloat(fourForm.getFieldValue("x45-3")) * parseFloat(fourForm.getFieldValue("x16-3"))));

        fourForm.setFieldValue("x63-1", computeValue(x63_1, parseFloat(fourForm.getFieldValue("x61-1")) * parseFloat(fourForm.getFieldValue("x44-1")) * parseFloat(fourForm.getFieldValue("x70-1")) * parseFloat(fourForm.getFieldValue("x41-1"))));
        fourForm.setFieldValue("x63-2", computeValue(x63_2, parseFloat(fourForm.getFieldValue("x61-2")) * parseFloat(fourForm.getFieldValue("x44-2")) * parseFloat(fourForm.getFieldValue("x70-2")) * parseFloat(fourForm.getFieldValue("x41-2"))));
        fourForm.setFieldValue("x63-3", computeValue(x63_3, parseFloat(fourForm.getFieldValue("x61-3")) * parseFloat(fourForm.getFieldValue("x44-3")) * parseFloat(fourForm.getFieldValue("x70-3")) * parseFloat(fourForm.getFieldValue("x41-3"))));

        fourForm.setFieldValue("x64-1", computeValue(x64_1, parseFloat(fourForm.getFieldValue("x65-1")) * parseFloat(fourForm.getFieldValue("x69-1")) * parseFloat(fourForm.getFieldValue("x66-1"))));
        fourForm.setFieldValue("x64-2", computeValue(x64_2, parseFloat(fourForm.getFieldValue("x65-2")) * parseFloat(fourForm.getFieldValue("x69-2")) * parseFloat(fourForm.getFieldValue("x66-2"))));
        fourForm.setFieldValue("x64-3", computeValue(x64_3, parseFloat(fourForm.getFieldValue("x65-3")) * parseFloat(fourForm.getFieldValue("x69-3")) * parseFloat(fourForm.getFieldValue("x66-3"))));

        fourForm.setFieldValue("x67-1", computeValue(x67_1, parseFloat(fourForm.getFieldValue("x64-1")) * parseFloat(fourForm.getFieldValue("x62-1")) * parseFloat(fourForm.getFieldValue("x71-1")) * parseFloat(fourForm.getFieldValue("x68-1"))));
        fourForm.setFieldValue("x67-2", computeValue(x67_2, parseFloat(fourForm.getFieldValue("x64-2")) * parseFloat(fourForm.getFieldValue("x62-2")) * parseFloat(fourForm.getFieldValue("x71-2")) * parseFloat(fourForm.getFieldValue("x68-2"))));
        fourForm.setFieldValue("x67-3", computeValue(x67_3, parseFloat(fourForm.getFieldValue("x64-3")) * parseFloat(fourForm.getFieldValue("x62-3")) * parseFloat(fourForm.getFieldValue("x71-3")) * parseFloat(fourForm.getFieldValue("x68-3"))));

        fourForm.setFieldValue("x69-1", computeValue(x69_1, parseFloat(firstForm.getFieldValue("a20"))));
        fourForm.setFieldValue("x69-2", computeValue(x69_2, parseFloat(firstForm.getFieldValue("a20"))));
        fourForm.setFieldValue("x69-3", computeValue(x69_3, parseFloat(fourForm.getFieldValue("a20"))));

        fourForm.setFieldValue("x71-1", computeValue(x71_1, parseFloat(firstForm.getFieldValue("a18"))));
        fourForm.setFieldValue("x71-2", computeValue(x71_2, parseFloat(firstForm.getFieldValue("a18"))));
        fourForm.setFieldValue("x71-3", computeValue(x71_3, parseFloat(firstForm.getFieldValue("a18"))));

        fourForm.setFieldValue("x73-1", computeValue(x73_1, (parseFloat(fourForm.getFieldValue("x63-1")) + parseFloat(fourForm.getFieldValue("x72-1"))) / parseFloat(fourForm.getFieldValue("x67-1"))));
        fourForm.setFieldValue("x73-2", computeValue(x73_2, (parseFloat(fourForm.getFieldValue("x63-2")) + parseFloat(fourForm.getFieldValue("x72-2"))) / parseFloat(fourForm.getFieldValue("x67-2"))));
        fourForm.setFieldValue("x73-3", computeValue(x73_3, (parseFloat(fourForm.getFieldValue("x63-3")) + parseFloat(fourForm.getFieldValue("x72-3"))) / parseFloat(fourForm.getFieldValue("x67-3"))));

        fourForm.setFieldValue("x87-1", computeValue(x87_1, parseFloat(fourForm.getFieldValue("x92-1") * (1.5 * parseFloat(fourForm.getFieldValue("x3-1")) / parseFloat(fourForm.getFieldValue("x12-1")) - 1) + (parseFloat(fourForm.getFieldValue("x3-1"))) / (2 * parseFloat(fourForm.getFieldValue("x89-1"))))));
        fourForm.setFieldValue("x87-2", computeValue(x87_2, parseFloat(fourForm.getFieldValue("x92-2") * (1.5 * parseFloat(fourForm.getFieldValue("x3-2")) / parseFloat(fourForm.getFieldValue("x12-2")) - 1) + (parseFloat(fourForm.getFieldValue("x3-2"))) / (2 * parseFloat(fourForm.getFieldValue("x89-2"))))));
        fourForm.setFieldValue("x87-3", computeValue(x87_3, parseFloat(fourForm.getFieldValue("x92-3") * (1.5 * parseFloat(fourForm.getFieldValue("x3-3")) / parseFloat(fourForm.getFieldValue("x12-3")) - 1) + (parseFloat(fourForm.getFieldValue("x3-3"))) / (2 * parseFloat(fourForm.getFieldValue("x89-3"))))));

        fourForm.setFieldValue("x87-1", computeValue(x87_1, Math.tan(degToRad(parseFloat(fourForm.getFieldValue("x90-1")), 'deg')) * Math.tan(degToRad(parseFloat(fourForm.getFieldValue("x91-1")), 'deg')) / (Math.tan(degToRad(parseFloat(fourForm.getFieldValue("x90-1")), 'deg')) - Math.tan(degToRad(parseFloat(fourForm.getFieldValue("x91-1")), 'deg')))));
        fourForm.setFieldValue("x87-2", computeValue(x87_2, Math.tan(degToRad(parseFloat(fourForm.getFieldValue("x90-2")), 'deg')) * Math.tan(degToRad(parseFloat(fourForm.getFieldValue("x91-2")), 'deg')) / (Math.tan(degToRad(parseFloat(fourForm.getFieldValue("x90-2")), 'deg')) - Math.tan(degToRad(parseFloat(fourForm.getFieldValue("x91-2")), 'deg')))));
        fourForm.setFieldValue("x87-3", computeValue(x87_3, Math.tan(degToRad(parseFloat(fourForm.getFieldValue("x90-3")), 'deg')) * Math.tan(degToRad(parseFloat(fourForm.getFieldValue("x91-3")), 'deg')) / (Math.tan(degToRad(parseFloat(fourForm.getFieldValue("x90-3")), 'deg')) - Math.tan(degToRad(parseFloat(fourForm.getFieldValue("x91-3")), 'deg')))));

        fourForm.setFieldValue("x92-1", computeValue(x92_1, parseFloat(fourForm.getFieldValue("x3-1")) * (1 / Math.tan(degToRad(parseFloat(fourForm.getFieldValue("x90-1")), 'deg'))) + parseFloat(fourForm.getFieldValue("x95-1")) + parseFloat(fourForm.getFieldValue("x39-1")) * (parseFloat(fourForm.getFieldValue("x15-1")) - 1)));
        fourForm.setFieldValue("x92-2", computeValue(x92_2, parseFloat(fourForm.getFieldValue("x3-2")) * (1 / Math.tan(degToRad(parseFloat(fourForm.getFieldValue("x90-2")), 'deg'))) + parseFloat(fourForm.getFieldValue("x95-2")) + parseFloat(fourForm.getFieldValue("x39-2")) * (parseFloat(fourForm.getFieldValue("x15-2")) - 1)));
        fourForm.setFieldValue("x92-3", computeValue(x92_3, parseFloat(fourForm.getFieldValue("x3-3")) * (1 / Math.tan(degToRad(parseFloat(fourForm.getFieldValue("x90-3")), 'deg'))) + parseFloat(fourForm.getFieldValue("x95-3")) + parseFloat(fourForm.getFieldValue("x39-3")) * (parseFloat(fourForm.getFieldValue("x15-3")) - 1)));

        fourForm.setFieldValue("x94-1", computeValue(x94_1, parseFloat(fourForm.getFieldValue("x87-1")) + parseFloat(fourForm.getFieldValue("x92-1"))));
        fourForm.setFieldValue("x94-2", computeValue(x94_2, parseFloat(fourForm.getFieldValue("x87-2")) + parseFloat(fourForm.getFieldValue("x92-2"))));
        fourForm.setFieldValue("x94-3", computeValue(x94_3, parseFloat(fourForm.getFieldValue("x87-3")) + parseFloat(fourForm.getFieldValue("x92-3"))));

        fourForm.setFieldValue("x101-1", computeValue(x101_1, 1250 * parseFloat(fourForm.getFieldValue("x103-1")) * Math.sqrt(parseFloat(fourForm.getFieldValue("x2-1")) / (1 + parseFloat(fourForm.getFieldValue("x104-1"))) * (parseFloat(fourForm.getFieldValue("x6-1")) / 1000 / parseFloat(fourForm.getFieldValue("x38-1"))))));
        fourForm.setFieldValue("x101-2", computeValue(x101_2, 1250 * parseFloat(fourForm.getFieldValue("x103-2")) * Math.sqrt(parseFloat(fourForm.getFieldValue("x2-2")) / (1 + parseFloat(fourForm.getFieldValue("x104-2"))) * (parseFloat(fourForm.getFieldValue("x6-2")) / 1000 / parseFloat(fourForm.getFieldValue("x38-2"))))));
        fourForm.setFieldValue("x101-3", computeValue(x101_3, 1250 * parseFloat(fourForm.getFieldValue("x103-3")) * Math.sqrt(parseFloat(fourForm.getFieldValue("x2-3")) / (1 + parseFloat(fourForm.getFieldValue("x104-3"))) * (parseFloat(fourForm.getFieldValue("x6-3")) / 1000 / parseFloat(fourForm.getFieldValue("x38-3"))))));

        fourForm.setFieldValue("x101-1", computeValue(x101_1, 1250 * parseFloat(fourForm.getFieldValue("x103-1")) * Math.sqrt(parseFloat(fourForm.getFieldValue("x2-1")) / (1 + parseFloat(fourForm.getFieldValue("x104-1"))) * (parseFloat(fourForm.getFieldValue("x6-1")) / 1000 / parseFloat(fourForm.getFieldValue("x38-1"))))));
        fourForm.setFieldValue("x101-2", computeValue(x101_2, 1250 * parseFloat(fourForm.getFieldValue("x103-2")) * Math.sqrt(parseFloat(fourForm.getFieldValue("x2-2")) / (1 + parseFloat(fourForm.getFieldValue("x104-2"))) * (parseFloat(fourForm.getFieldValue("x6-2")) / 1000 / parseFloat(fourForm.getFieldValue("x38-2"))))));
        fourForm.setFieldValue("x101-3", computeValue(x101_3, 1250 * parseFloat(fourForm.getFieldValue("x103-3")) * Math.sqrt(parseFloat(fourForm.getFieldValue("x2-3")) / (1 + parseFloat(fourForm.getFieldValue("x104-3"))) * (parseFloat(fourForm.getFieldValue("x6-3")) / 1000 / parseFloat(fourForm.getFieldValue("x38-3"))))));

        fourForm.setFieldValue("x103-1", computeValue(x103_1, parseFloat(fourForm.getFieldValue("x17-1")) / parseFloat(fourForm.getFieldValue("x16-1"))));
        fourForm.setFieldValue("x103-2", computeValue(x103_2, parseFloat(fourForm.getFieldValue("x17-2")) / parseFloat(fourForm.getFieldValue("x16-2"))));
        fourForm.setFieldValue("x103-3", computeValue(x103_3, parseFloat(fourForm.getFieldValue("x17-3")) / parseFloat(fourForm.getFieldValue("x16-3"))));

        fourForm.setFieldValue("x105-1", computeValue(x103_1, parseFloat(fourForm.getFieldValue("x101-1")) / parseFloat(fourForm.getFieldValue("x107-1"))));
        fourForm.setFieldValue("x105-2", computeValue(x103_2, parseFloat(fourForm.getFieldValue("x101-2")) / parseFloat(fourForm.getFieldValue("x107-2"))));
        fourForm.setFieldValue("x105-3", computeValue(x103_3, parseFloat(fourForm.getFieldValue("x101-3")) / parseFloat(fourForm.getFieldValue("x107-3"))));

        fourForm.setFieldValue("x107-1", computeValue(x107_1, 0.5 * (1 + Math.sqrt(1 + 4 * parseFloat(fourForm.getFieldValue("x108-1")) / parseFloat(fourForm.getFieldValue("x101-1"))))));
        fourForm.setFieldValue("x107-2", computeValue(x107_2, 0.5 * (1 + Math.sqrt(1 + 4 * parseFloat(fourForm.getFieldValue("x108-2")) / parseFloat(fourForm.getFieldValue("x101-2"))))));
        fourForm.setFieldValue("x107-3", computeValue(x107_3, 0.5 * (1 + Math.sqrt(1 + 4 * parseFloat(fourForm.getFieldValue("x108-3")) / parseFloat(fourForm.getFieldValue("x101-3"))))));

        fourForm.setFieldValue("x107-1", computeValue(x107_1, 0.5 * (1 + Math.sqrt(1 + 4 * parseFloat(fourForm.getFieldValue("x108-1")) / parseFloat(fourForm.getFieldValue("x101-1"))))));
        fourForm.setFieldValue("x107-2", computeValue(x107_2, 0.5 * (1 + Math.sqrt(1 + 4 * parseFloat(fourForm.getFieldValue("x108-2")) / parseFloat(fourForm.getFieldValue("x101-2"))))));
        fourForm.setFieldValue("x107-3", computeValue(x107_3, 0.5 * (1 + Math.sqrt(1 + 4 * parseFloat(fourForm.getFieldValue("x108-3")) / parseFloat(fourForm.getFieldValue("x101-3"))))));

        fourForm.setFieldValue("x109-1", computeValue(x109_1, 1 + Math.tan(degToRad(parseFloat(fourForm.getFieldValue("x110-1")), 'deg'))));
        fourForm.setFieldValue("x109-2", computeValue(x109_2, 1 + Math.tan(degToRad(parseFloat(fourForm.getFieldValue("x110-2")), 'deg'))));
        fourForm.setFieldValue("x109-3", computeValue(x109_3, 1 + Math.tan(degToRad(parseFloat(fourForm.getFieldValue("x110-3")), 'deg'))));

        fourForm.setFieldValue("x109-1", computeValue(x109_1, 1 + Math.tan(degToRad(parseFloat(fourForm.getFieldValue("x110-1")), 'deg'))));
        fourForm.setFieldValue("x109-2", computeValue(x109_2, 1 + Math.tan(degToRad(parseFloat(fourForm.getFieldValue("x110-2")), 'deg'))));
        fourForm.setFieldValue("x109-3", computeValue(x109_3, 1 + Math.tan(degToRad(parseFloat(fourForm.getFieldValue("x110-3")), 'deg'))));

        fourForm.setFieldValue("x111-1", computeValue(x111_1, parseFloat(fourForm.getFieldValue("x101-1")) * parseFloat(fourForm.getFieldValue("x109-1")) * parseFloat(fourForm.getFieldValue("x107-1"))));
        fourForm.setFieldValue("x111-2", computeValue(x111_2, parseFloat(fourForm.getFieldValue("x101-2")) * parseFloat(fourForm.getFieldValue("x109-2")) * parseFloat(fourForm.getFieldValue("x107-2"))));
        fourForm.setFieldValue("x111-3", computeValue(x111_3, parseFloat(fourForm.getFieldValue("x101-3")) * parseFloat(fourForm.getFieldValue("x109-3")) * parseFloat(fourForm.getFieldValue("x107-3"))));

        fourForm.setFieldValue("x115-1", computeValue(x115_1, 65 * Math.pow(parseFloat(fourForm.getFieldValue("x116-1")), 0.5)));
        fourForm.setFieldValue("x115-2", computeValue(x115_2, 65 * Math.pow(parseFloat(fourForm.getFieldValue("x116-2")), 0.5)));
        fourForm.setFieldValue("x115-3", computeValue(x115_3, 65 * Math.pow(parseFloat(fourForm.getFieldValue("x116-3")), 0.5)));

        fourForm.setFieldValue("x116-1", computeValue(x116_1, parseFloat(fourForm.getFieldValue("x117-1")) + parseFloat(fourForm.getFieldValue("x122-1"))));
        fourForm.setFieldValue("x116-2", computeValue(x116_2, parseFloat(fourForm.getFieldValue("x117-2")) + parseFloat(fourForm.getFieldValue("x122-"))));
        fourForm.setFieldValue("x116-3", computeValue(x116_3, parseFloat(fourForm.getFieldValue("x117-3")) + parseFloat(fourForm.getFieldValue("x122-3"))));

        fourForm.setFieldValue("x117-1", computeValue(x117_1, 12 * parseFloat(fourForm.getFieldValue("x8-1")) * parseFloat(fourForm.getFieldValue("x6-1")) / 1000 * parseFloat(fourForm.getFieldValue("x119-1")) * parseFloat(fourForm.getFieldValue("x120-1"))));
        fourForm.setFieldValue("x117-2", computeValue(x117_2, 12 * parseFloat(fourForm.getFieldValue("x8-2")) * parseFloat(fourForm.getFieldValue("x6-2")) / 1000 * parseFloat(fourForm.getFieldValue("x119-2")) * parseFloat(fourForm.getFieldValue("x120-2"))));
        fourForm.setFieldValue("x117-3", computeValue(x117_3, 12 * parseFloat(fourForm.getFieldValue("x8-3")) * parseFloat(fourForm.getFieldValue("x6-3")) / 1000 * parseFloat(fourForm.getFieldValue("x119-3")) * parseFloat(fourForm.getFieldValue("x120-3"))));

        fourForm.setFieldValue("x118-1", computeValue(x118_1, parseFloat(fourForm.getFieldValue("x11-1")) / (parseFloat(fourForm.getFieldValue("x6-1")) / 1000)));
        fourForm.setFieldValue("x118-2", computeValue(x118_2, parseFloat(fourForm.getFieldValue("x11-2")) / (parseFloat(fourForm.getFieldValue("x6-2")) / 1000)));
        fourForm.setFieldValue("x118-3", computeValue(x118_3, parseFloat(fourForm.getFieldValue("x11-3")) / (parseFloat(fourForm.getFieldValue("x6-3")) / 1000)));

        fourForm.setFieldValue("x118-1", computeValue(x118_1, parseFloat(fourForm.getFieldValue("x11-1")) / (parseFloat(fourForm.getFieldValue("x6-1")) / 1000)));
        fourForm.setFieldValue("x118-2", computeValue(x118_2, parseFloat(fourForm.getFieldValue("x11-2")) / (parseFloat(fourForm.getFieldValue("x6-2")) / 1000)));
        fourForm.setFieldValue("x118-3", computeValue(x118_3, parseFloat(fourForm.getFieldValue("x11-3")) / (parseFloat(fourForm.getFieldValue("x6-3")) / 1000)));

        fourForm.setFieldValue("x120-1", computeValue(x120_1, parseFloat(fourForm.getFieldValue("x45-1")) / parseFloat(fourForm.getFieldValue("x121-1"))));
        fourForm.setFieldValue("x120-2", computeValue(x120_2, parseFloat(fourForm.getFieldValue("x45-2")) / parseFloat(fourForm.getFieldValue("x121-2"))));
        fourForm.setFieldValue("x120-3", computeValue(x120_3, parseFloat(fourForm.getFieldValue("x45-3")) / parseFloat(fourForm.getFieldValue("x121-3"))));

        fourForm.setFieldValue("x122-1", computeValue(x122_1, parseFloat(fourForm.getFieldValue("x123-1")) * parseFloat(fourForm.getFieldValue("x124-1")) / 1000));
        fourForm.setFieldValue("x122-2", computeValue(x122_2, parseFloat(fourForm.getFieldValue("x123-2")) * parseFloat(fourForm.getFieldValue("x124-2")) / 1000));
        fourForm.setFieldValue("x122-3", computeValue(x122_3, parseFloat(fourForm.getFieldValue("x123-3")) * parseFloat(fourForm.getFieldValue("x124-3")) / 1000));

        fourForm.setFieldValue("x123-1", computeValue(x123_1, parseFloat(fourForm.getFieldValue("x50-1")) / parseFloat(fourForm.getFieldValue("x121-1"))));
        fourForm.setFieldValue("x123-2", computeValue(x123_2, parseFloat(fourForm.getFieldValue("x50-2")) / parseFloat(fourForm.getFieldValue("x121-2"))));
        fourForm.setFieldValue("x123-3", computeValue(x123_3, parseFloat(fourForm.getFieldValue("x50-3")) / parseFloat(fourForm.getFieldValue("x121-3"))));

        fourForm.setFieldValue("x129-1", computeValue(x129_1, parseFloat(fourForm.getFieldValue("x115-1")) * parseFloat(fourForm.getFieldValue("x126-1")) * parseFloat(fourForm.getFieldValue("x127-1")) * parseFloat(fourForm.getFieldValue("x128-1"))));
        fourForm.setFieldValue("x129-2", computeValue(x129_2, parseFloat(fourForm.getFieldValue("x115-2")) * parseFloat(fourForm.getFieldValue("x126-2")) * parseFloat(fourForm.getFieldValue("x127-2")) * parseFloat(fourForm.getFieldValue("x128-2"))));
        fourForm.setFieldValue("x129-3", computeValue(x129_3, parseFloat(fourForm.getFieldValue("x115-3")) * parseFloat(fourForm.getFieldValue("x126-3")) * parseFloat(fourForm.getFieldValue("x127-3")) * parseFloat(fourForm.getFieldValue("x128-3"))));

        fourForm.setFieldValue("x133-1", computeValue(x133_1, 1 + Math.tan(degToRad(parseFloat(fourForm.getFieldValue("x110-1")), 'deg'))));
        fourForm.setFieldValue("x133-2", computeValue(x133_2, 1 + Math.tan(degToRad(parseFloat(fourForm.getFieldValue("x110-2")), 'deg'))));
        fourForm.setFieldValue("x133-3", computeValue(x133_3, 1 + Math.tan(degToRad(parseFloat(fourForm.getFieldValue("x110-3")), 'deg'))));

        fourForm.setFieldValue("x137-1", computeValue(x137_1, parseFloat(fourForm.getFieldValue("x46-1")) / parseFloat(fourForm.getFieldValue("x121-1"))));
        fourForm.setFieldValue("x137-2", computeValue(x137_2, parseFloat(fourForm.getFieldValue("x46-2")) / parseFloat(fourForm.getFieldValue("x121-2"))));
        fourForm.setFieldValue("x137-3", computeValue(x137_3, parseFloat(fourForm.getFieldValue("x46-3")) / parseFloat(fourForm.getFieldValue("x121-3"))));

        fourForm.setFieldValue("x138-1", computeValue(x138_1, parseFloat(fourForm.getFieldValue("x45-1")) / parseFloat(fourForm.getFieldValue("x121-1"))));
        fourForm.setFieldValue("x138-2", computeValue(x138_2, parseFloat(fourForm.getFieldValue("x45-2")) / parseFloat(fourForm.getFieldValue("x121-2"))));
        fourForm.setFieldValue("x138-3", computeValue(x138_3, parseFloat(fourForm.getFieldValue("x45-3")) / parseFloat(fourForm.getFieldValue("x121-3"))));

        fourForm.setFieldValue("x138-1", computeValue(x138_1, 200 * parseFloat(fourForm.getFieldValue("x143-1")) * Math.pow(parseFloat(fourForm.getFieldValue("x144-1")) * parseFloat(fourForm.getFieldValue("x145-1")), 0.4) / Math.pow(parseFloat(fourForm.getFieldValue("x146-1")), 0.5)));
        fourForm.setFieldValue("x138-2", computeValue(x138_2, 200 * parseFloat(fourForm.getFieldValue("x143-2")) * Math.pow(parseFloat(fourForm.getFieldValue("x144-2")) * parseFloat(fourForm.getFieldValue("x145-2")), 0.4) / Math.pow(parseFloat(fourForm.getFieldValue("x146-2")), 0.5)));
        fourForm.setFieldValue("x138-3", computeValue(x138_3, 200 * parseFloat(fourForm.getFieldValue("x143-3")) * Math.pow(parseFloat(fourForm.getFieldValue("x144-3")) * parseFloat(fourForm.getFieldValue("x145-3")), 0.4) / Math.pow(parseFloat(fourForm.getFieldValue("x146-3")), 0.5)));

        fourForm.setFieldValue("x138-1", computeValue(x138_1, 200 * parseFloat(fourForm.getFieldValue("x143-1")) * Math.pow(parseFloat(fourForm.getFieldValue("x144-1")) * parseFloat(fourForm.getFieldValue("x145-1")), 0.4) / Math.pow(parseFloat(fourForm.getFieldValue("x146-1")), 0.5)));
        fourForm.setFieldValue("x138-2", computeValue(x138_2, 200 * parseFloat(fourForm.getFieldValue("x143-2")) * Math.pow(parseFloat(fourForm.getFieldValue("x144-2")) * parseFloat(fourForm.getFieldValue("x145-2")), 0.4) / Math.pow(parseFloat(fourForm.getFieldValue("x146-2")), 0.5)));
        fourForm.setFieldValue("x138-3", computeValue(x138_3, 200 * parseFloat(fourForm.getFieldValue("x143-3")) * Math.pow(parseFloat(fourForm.getFieldValue("x144-3")) * parseFloat(fourForm.getFieldValue("x145-3")), 0.4) / Math.pow(parseFloat(fourForm.getFieldValue("x146-3")), 0.5)));

        fourForm.setFieldValue("x156-1", computeValue(x156_1, parseFloat(fourForm.getFieldValue("x157-1")) * parseFloat(fourForm.getFieldValue("x159-1"))));
        fourForm.setFieldValue("x156-2", computeValue(x156_2, parseFloat(fourForm.getFieldValue("x157-1")) * parseFloat(fourForm.getFieldValue("x159-1"))));
        fourForm.setFieldValue("x156-3", computeValue(x156_3, parseFloat(fourForm.getFieldValue("x157-1")) * parseFloat(fourForm.getFieldValue("x159-1"))));

        fourForm.setFieldValue("x160-1", computeValue(x160_1, parseFloat(fourForm.getFieldValue("x71-1")) * parseFloat(fourForm.getFieldValue("x69-1")) * parseFloat(fourForm.getFieldValue("x62-1")) * parseFloat(fourForm.getFieldValue("x73-1"))));
        fourForm.setFieldValue("x160-2", computeValue(x160_2, parseFloat(fourForm.getFieldValue("x71-2")) * parseFloat(fourForm.getFieldValue("x69-2")) * parseFloat(fourForm.getFieldValue("x62-2")) * parseFloat(fourForm.getFieldValue("x73-2"))));
        fourForm.setFieldValue("x160-3", computeValue(x160_3, parseFloat(fourForm.getFieldValue("x71-3")) * parseFloat(fourForm.getFieldValue("x69-3")) * parseFloat(fourForm.getFieldValue("x62-3")) * parseFloat(fourForm.getFieldValue("x73-3"))));

        fourForm.setFieldValue("x161-1", computeValue(x161_1, parseFloat(fourForm.getFieldValue("x155-1")) * parseFloat(fourForm.getFieldValue("x160-1")) / 1000));
        fourForm.setFieldValue("x161-2", computeValue(x161_2, parseFloat(fourForm.getFieldValue("x155-2")) * parseFloat(fourForm.getFieldValue("x160-2")) / 1000));
        fourForm.setFieldValue("x161-3", computeValue(x161_3, parseFloat(fourForm.getFieldValue("x155-3")) * parseFloat(fourForm.getFieldValue("x160-3")) / 1000));

        fourForm.setFieldValue("x163-1", computeValue(x163_1, parseFloat(fourForm.getFieldValue("x161-1")) * parseFloat(fourForm.getFieldValue("x162-1"))));
        fourForm.setFieldValue("x163-2", computeValue(x163_2, parseFloat(fourForm.getFieldValue("x161-2")) * parseFloat(fourForm.getFieldValue("x162-2"))));
        fourForm.setFieldValue("x163-3", computeValue(x163_3, parseFloat(fourForm.getFieldValue("x161-3")) * parseFloat(fourForm.getFieldValue("x162-3"))));

        fourForm.setFieldValue("x164-1", computeValue(x164_1, parseFloat(fourForm.getFieldValue("x161-1")) * parseFloat(fourForm.getFieldValue("x163-1"))));
        fourForm.setFieldValue("x164-2", computeValue(x164_2, parseFloat(fourForm.getFieldValue("x161-2")) * parseFloat(fourForm.getFieldValue("x163-2"))));
        fourForm.setFieldValue("x164-3", computeValue(x164_3, parseFloat(fourForm.getFieldValue("x161-3")) * parseFloat(fourForm.getFieldValue("x163-3"))));


    }


    return (<Row>
        <Col span={16}>
            <div id="part-1">
                <StyledBlockBig label={"Исходные данные"}>
                    <Form
                        onChange={() => handleComputing()}
                        form={firstForm}
                        labelWrap={true}
                        labelAlign={"left"}
                        labelCol={{span: 14}}
                        wrapperCol={{span: 7}}>
                        <Row>
                            <Col span={12}>

                                <StyledFormItemComputing className={"first-level-form-item"} name={"a1"}
                                                         label={"Годовая производительность"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing className={"two-level-form-item"} name={"a2"}
                                                         label={"- по полезному ископаемому"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing className={"two-level-form-item"} name={"a3"}
                                                         label={""}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing className={"two-level-form-item"} name={"a4"}
                                                         label={"- по вскрыше"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing className={"two-level-form-item"} name={"a5"}
                                                         label={"- ПРС"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing className={"first-level-form-item"} name={"a6"}
                                                         label={"Объемный вес:"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing className={"two-level-form-item"} name={"a7"}
                                                         label={"- полезное ископаемое"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing className={"two-level-form-item"} name={"a8"}
                                                         label={"- вскрыши"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing className={"two-level-form-item"} name={"a9"}
                                                         label={"- ПРС"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing className={"first-level-form-item"} name={"a10"}
                                                         label={"Коэффициент крепости"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing className={"two-level-form-item"} name={"a11"}
                                                         label={"- полезное ископаемое"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing className={"two-level-form-item"} name={"a12"}
                                                         label={"- ПРС"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing className={"two-level-form-item"} name={"a13"}
                                                         label={"- вскрыша"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                            </Col>

                            <Col span={12}>
                                <StyledFormItemComputing className={"first-level-form-item"} name={"a14"}
                                                         label={"Группа пород по СНиПу"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing className={"two-level-form-item"} name={"a15"}
                                                         label={"- полезное ископаемое"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing className={"two-level-form-item"} name={"a16"}
                                                         label={"- скальной вскрыше"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing className={"two-level-form-item"} name={"a17"}
                                                         label={"- ПРС"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing className={"first-level-form-item"} name={"a18"}
                                                         label={"Количество рабочих дней в году"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing className={"first-level-form-item"} name={"a19"}
                                                         label={"Количество рабочих смен"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing className={"first-level-form-item"} name={"a20"}
                                                         label={"Продолжительность смены"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing className={"first-level-form-item"} name={"a21"}
                                                         label={"Высота уступа"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing className={"two-level-form-item"} name={"a22"}
                                                         label={"- по полезное ископаемое"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing className={"two-level-form-item"} name={"a23"}
                                                         label={"- вскрыше"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing className={"two-level-form-item"} name={"a24"}
                                                         label={"- рыхлой вскрыше"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing className={"first-level-form-item"} name={"a25"}
                                                         label={"Коэффициент разрыхления"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing className={"two-level-form-item"} name={"a26"}
                                                         label={"- полезное ископаемое"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing className={"two-level-form-item"} name={"a27"}
                                                         label={"- вскрыша"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing className={"first-level-form-item"} name={"a28"}
                                                         label={"-ПРС"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                            </Col>
                        </Row>
                    </Form>
                </StyledBlockBig>
            </div>
            <div id="part-2">
                <StyledBlockBig label={"Пр-ть карьера"}>
                    <Form
                        onChange={() => handleComputing()}
                        form={twoForm}
                        labelWrap={true}
                        labelAlign={"left"}
                        labelCol={{span: 14}}
                        wrapperCol={{span: 7}}>
                        <StyledFormItemComputing className={"first-level-form-item"} name="t1"
                                                 label={"Базовое среднегодовое понижение добычных работ"}>
                            <Input size={"small"}/>
                        </StyledFormItemComputing>
                        <StyledFormItemComputing className={"first-level-form-item"} name="t2"
                                                 label={"Поправка к понижению (на класс экскаватора)"}>
                            <Input size={"small"}/>
                        </StyledFormItemComputing>

                        <StyledFormItemComputing className={"first-level-form-item"} name="t3"
                                                 label={"Расчетное среднегодовое понижение"}>
                            <Input size={"small"} status={t3 ? "warning" : ""} onChange={(e) => {
                                twoForm.setFieldValue("t3", e.target.value);
                                setT3(e.target.value)
                            }}/>
                        </StyledFormItemComputing>
                        <StyledFormItemComputing className={"first-level-form-item"} name={"t4"}
                                                 label={"Средняя горизонтальная площадь рудных тел"}>
                            <Input size={"small"}/>
                        </StyledFormItemComputing>
                        <StyledFormItemComputing className={"first-level-form-item"} name={"t5"}
                                                 label={"Коэффициент извлечения руды"}>
                            <Input size={"small"}/>
                        </StyledFormItemComputing>
                        <StyledFormItemComputing className={"first-level-form-item"} name={"t6"}
                                                 label={"Коэффициент разубоживания руды"}>
                            <Input size={"small"}/>
                        </StyledFormItemComputing>
                        <StyledFormItemComputing className={"first-level-form-item"} name={"t7"}
                                                 label={"Объемный вес руды"}>
                            <Input size={"small"} status={t7 ? "warning" : ""} onChange={(e) => {
                                twoForm.setFieldValue("t7", e.target.value);
                                setT7(e.target.value)
                            }}/>
                        </StyledFormItemComputing>
                        <StyledFormItemComputing className={"first-level-form-item"} name={"t8"}
                                                 label={"Расчетная годовая производительность карьера"}>
                            <Input size={"small"} status={t8 ? "warning" : ""} onChange={(e) => {
                                twoForm.setFieldValue("t8", e.target.value);
                                setT8(e.target.value)
                            }}/>
                        </StyledFormItemComputing>
                        <StyledFormItemComputing className={"first-level-form-item"} name={"t9"}
                                                 label={"Принятая годовая производительность"}>
                            <Input size={"small"}/>
                        </StyledFormItemComputing>
                    </Form>
                </StyledBlockBig>
            </div>
            <div id="part-3">
                <StyledBlockBig label={"БВР-негабор"}>
                    <Form
                        onChange={() => handleComputing()}
                        form={friForm}
                        labelWrap={true}
                        labelAlign={"left"}
                        labelCol={{span: 14}}
                        wrapperCol={{span: 7}}>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Годовой объем работ"}>
                            <Space.Compact>
                                <StyledFormItemComputing name={"n1-1"}>
                                    <Input size={"small"} status={n1_1 ? "warning" : ""} onChange={(e) => {
                                        friForm.setFieldValue("n1-2", e.target.value);
                                        setN1_1(e.target.value)
                                    }}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing name={"n1-2"}>
                                    <Input size={"small"} status={n1_2 ? "warning" : ""} onChange={(e) => {
                                        friForm.setFieldValue("n1-2", e.target.value);
                                        setN1_2(e.target.value)
                                    }}/>
                                </StyledFormItemComputing>
                            </Space.Compact>
                        </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Выход негабаритов (ОНТП-18-85 табл.2.14)"}> <Space.Compact>
                            <StyledFormItemComputing name={"n3-1"}>
                                <Input size={"small"}/>
                            </StyledFormItemComputing>
                            <StyledFormItemComputing name={"n3-2"}>
                                <Input size={"small"}/>
                            </StyledFormItemComputing>
                        </Space.Compact>
                        </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Объем негаборитов"}> <Space.Compact>
                            <StyledFormItemComputing name={"n4-1"}>
                                <Input size={"small"} status={n4_1 ? "warning" : ""} onChange={(e) => {
                                    friForm.setFieldValue("n4-1", e.target.value);
                                    setN4_1(e.target.value)
                                }}/>
                            </StyledFormItemComputing>
                            <StyledFormItemComputing name={"n4-2"}>
                                <Input size={"small"} status={n4_2 ? "warning" : ""} onChange={(e) => {
                                    friForm.setFieldValue("n4-2", e.target.value);
                                    setN4_2(e.target.value)
                                }}/>
                            </StyledFormItemComputing>
                        </Space.Compact>
                        </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Количество негабаритных кусков"}> <Space.Compact>
                            <StyledFormItemComputing name={"n5-1"}>
                                <Input size={"small"} status={n5_1 ? "warning" : ""} onChange={(e) => {
                                    friForm.setFieldValue("n5-1", e.target.value);
                                    setN5_1(e.target.value)
                                }}/>
                            </StyledFormItemComputing>
                            <StyledFormItemComputing name={"n5-2"}>
                                <Input size={"small"} status={n5_2 ? "warning" : ""} onChange={(e) => {
                                    friForm.setFieldValue("n5-2", e.target.value);
                                    setN5_2(e.target.value)
                                }}/>
                            </StyledFormItemComputing>
                        </Space.Compact>
                        </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Q = qн Vк - масса заряда"}> <Space.Compact>
                            <StyledFormItemComputing name={"n6-1"}>
                                <Input size={"small"} status={n6_1 ? "warning" : ""} onChange={(e) => {
                                    friForm.setFieldValue("n6-1", e.target.value);
                                    setN6_1(e.target.value)
                                }}/>
                            </StyledFormItemComputing>
                            <StyledFormItemComputing name={"n6-2"}>
                                <Input size={"small"} status={n6_2 ? "warning" : ""} onChange={(e) => {
                                    friForm.setFieldValue("n6-2", e.target.value);
                                    setN6_2(e.target.value)
                                }}/>
                            </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} name={"n7"}
                                                 label={"qн = qб Квв Кд (1 ± Квар) - норматив. удельный расход ВВ"}>
                            <Space.Compact>
                                <StyledFormItemComputing name={"n7-1"}>
                                    <Input size={"small"} status={n7_1 ? "warning" : ""} onChange={(e) => {
                                        friForm.setFieldValue("n7-1", e.target.value);
                                        setN7_1(e.target.value)
                                    }}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing name={"n7-2"}>
                                    <Input size={"small"} status={n7_2 ? "warning" : ""} onChange={(e) => {
                                        friForm.setFieldValue("n7-2", e.target.value);
                                        setN7_2(e.target.value)
                                    }}/>
                                </StyledFormItemComputing>
                            </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} name={"n8"}
                                                 label={"qб - базовый удельный расход"}> <Space.Compact>
                            <StyledFormItemComputing name={"n8-1"}>
                                <Input size={"small"}/>
                            </StyledFormItemComputing>
                            <StyledFormItemComputing name={"n8-2"}>
                                <Input size={"small"}/>
                            </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} name={"n9"}
                                                 label={"Квв - переводной к-т по идеальной работе"}> <Space.Compact>
                            <StyledFormItemComputing name={"n9-1"}>
                                <Input size={"small"}/>
                            </StyledFormItemComputing>
                            <StyledFormItemComputing name={"n9-2"}>
                                <Input size={"small"}/>
                            </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} name={"n10"}
                                                 label={"Кд = 0,5 Нк / Нн - к-т, учитывающий интенсивность дробления"}>
                            <Space.Compact>
                                <StyledFormItemComputing name={"n10-1"}>
                                    <Input size={"small"} status={n10_1 ? "warning" : ""} onChange={(e) => {
                                        friForm.setFieldValue("n10-1", e.target.value);
                                        setN10_1(e.target.value)
                                    }}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing name={"n10-2"}>
                                    <Input size={"small"} status={n10_2 ? "warning" : ""} onChange={(e) => {
                                        friForm.setFieldValue("n10-2", e.target.value);
                                        setN10_2(e.target.value)
                                    }}/>
                                </StyledFormItemComputing>
                            </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Кк - средний размер негабаритного куска после взрыва"}>
                            <Space.Compact>
                                <StyledFormItemComputing name={"n11-1"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing name={"n11-2"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                            </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Кн - требуемый размер куска (допустимый)"}> <Space.Compact>
                            <StyledFormItemComputing name={"n12-1"}>
                                <Input size={"small"}/>
                            </StyledFormItemComputing>
                            <StyledFormItemComputing name={"n12-2"}>
                                <Input size={"small"}/>
                            </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Квар - к-т, учитывающий изменение нормат. удельного расхода"}>
                            <Space.Compact>
                                <StyledFormItemComputing name={"n13-1"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing name={"n13-2"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                            </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Vк - объем негабаритного куска"}> <Space.Compact>
                            <StyledFormItemComputing name={"n14-1"}>
                                <Input size={"small"} status={n14_1 ? "warning" : ""} onChange={(e) => {
                                    friForm.setFieldValue("n14-1", e.target.value);
                                    setN14_1(e.target.value)
                                }}/>
                            </StyledFormItemComputing>
                            <StyledFormItemComputing name={"n14-2"}>
                                <Input size={"small"} status={n14_2 ? "warning" : ""} onChange={(e) => {
                                    friForm.setFieldValue("n14-2", e.target.value);
                                    setN14_2(e.target.value)
                                }}/>
                            </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Годовой расход ВВ"}> <Space.Compact>
                            <StyledFormItemComputing name={"n15-1"}>
                                <Input size={"small"} status={n15_1 ? "warning" : ""} onChange={(e) => {
                                    friForm.setFieldValue("n15-1", e.target.value);
                                    setN15_1(e.target.value)
                                }}/>
                            </StyledFormItemComputing>
                            <StyledFormItemComputing name={"n15-2"}>
                                <Input size={"small"} status={n15_2 ? "warning" : ""} onChange={(e) => {
                                    friForm.setFieldValue("n15-2", e.target.value);
                                    setN15_2(e.target.value)
                                }}/>
                            </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} name={"n16"}
                                                 label={"qэ = qн / (Vк qб) - удельный расход электродетонаторов"}>
                            <Space.Compact>
                                <StyledFormItemComputing name={"n16-1"}>
                                    <Input size={"small"} status={n16_1 ? "warning" : ""} onChange={(e) => {
                                        friForm.setFieldValue("n16-1", e.target.value);
                                        setN16_1(e.target.value)
                                    }}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing name={"n16-2"}>
                                    <Input size={"small"} status={n16_2 ? "warning" : ""} onChange={(e) => {
                                        friForm.setFieldValue("n16-2", e.target.value);
                                        setN16_2(e.target.value)
                                    }}/>
                                </StyledFormItemComputing>
                            </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Годовой расход ЭД"}> <Space.Compact>
                            <StyledFormItemComputing name={"n17-1"}>
                                <Input size={"small"} status={n17_1 ? "warning" : ""} onChange={(e) => {
                                    friForm.setFieldValue("n17-1", e.target.value);
                                    setN17_1(e.target.value)
                                }}/>
                            </StyledFormItemComputing>
                            <StyledFormItemComputing name={"n17-2"}>
                                <Input size={"small"} status={n17_2 ? "warning" : ""} onChange={(e) => {
                                    friForm.setFieldValue("n17-2", e.target.value);
                                    setN17_2(e.target.value)
                                }}/>
                            </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"qдш =  1/Vк (qн/ qб)2/3 - удельный расход ДШ"}>
                            <Space.Compact>
                                <StyledFormItemComputing name={"n18-1"}>
                                    <Input size={"small"} status={n18_2 ? "warning" : ""} onChange={(e) => {
                                        friForm.setFieldValue("n18-2", e.target.value);
                                        setN18_2(e.target.value)
                                    }}/>
                                </StyledFormItemComputing>
                                <StyledFormItemComputing name={"n18-2"}>
                                    <Input size={"small"} status={n18_2 ? "warning" : ""} onChange={(e) => {
                                        friForm.setFieldValue("n18-2", e.target.value);
                                        setN18_2(e.target.value)
                                    }}/>
                                </StyledFormItemComputing>
                            </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Годовой расход ДШЭ"}> <Space.Compact>
                            <StyledFormItemComputing name={"n19-1"}>
                                <Input size={"small"} status={n19_1 ? "warning" : ""} onChange={(e) => {
                                    friForm.setFieldValue("n19-1", e.target.value);
                                    setN19_1(e.target.value)
                                }}/>
                            </StyledFormItemComputing>
                            <StyledFormItemComputing name={"n19-2"}>
                                <Input size={"small"} status={n19_2 ? "warning" : ""} onChange={(e) => {
                                    friForm.setFieldValue("n19-2", e.target.value);
                                    setN19_2(e.target.value)
                                }}/>
                            </StyledFormItemComputing>
                        </Space.Compact>
                        </StyledFormItemComputing>

                    </Form>
                </StyledBlockBig>
            </div>
            <div id="part-4">
                <StyledBlockBig label={"БВР-основ"}>
                    <Form
                        form={fourForm}
                        labelWrap={true}
                        labelAlign={"left"}
                        labelCol={{span: 14}}
                        wrapperCol={{span: 7}}>


                        <StyledFormItemComputing className={"two-level-form-item"} label={"Применяемое ВВ"}>
                            <Space.Compact> <StyledFormItemComputing name={"x1-1"}>
                                <Input size={"small"} status={x1_1 ? "warning" : ""} onChange={(e) => {
                                    fourForm.setFieldValue("x1-1", e.target.value);
                                    setX1_1(e.target.value)
                                }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x1-2"}> <Input size={"small"}
                                                                                                      status={x1_2 ? "warning" : ""}
                                                                                                      onChange={(e) => {
                                                                                                          fourForm.setFieldValue("x1-2", e.target.value);
                                                                                                          setX1_2(e.target.value)
                                                                                                      }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x1-3"}> <Input size={"small"}
                                                                                                      status={x1_3 ? "warning" : ""}
                                                                                                      onChange={(e) => {
                                                                                                          fourForm.setFieldValue("x1-3", e.target.value);
                                                                                                          setX1_3(e.target.value)
                                                                                                      }}/>
                            </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Крепость по шкале проф. Протодъяконова"}> <Space.Compact>
                            <StyledFormItemComputing name={"x2-1"}> <Input size={"small"}
                                                                           status={x2_1 ? "warning" : ""}
                                                                           onChange={(e) => {
                                                                               fourForm.setFieldValue("x2-1", e.target.value);
                                                                               setX2_1(e.target.value)
                                                                           }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x2-2"}> <Input size={"small"}
                                                                           status={x2_2 ? "warning" : ""}
                                                                           onChange={(e) => {
                                                                               fourForm.setFieldValue("x2-2", e.target.value);
                                                                               setX2_2(e.target.value)
                                                                           }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x2-3"}> <Input size={"small"}
                                                                           status={x2_3 ? "warning" : ""}
                                                                           onChange={(e) => {
                                                                               fourForm.setFieldValue("x2-3", e.target.value);
                                                                               setX2_3(e.target.value)
                                                                           }}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"H - высота уступа"}>
                            <Space.Compact> <StyledFormItemComputing name={"x3-1"}> <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x3-2"}> <Input
                                size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x3-3"}> <Input
                                size={"small"}/>
                            </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"d - диаметр долота"}>
                            <Space.Compact> <StyledFormItemComputing name={"x4-1"}> <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x4-2"}> <Input
                                size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x4-3"}> <Input
                                size={"small"}/>
                            </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"К-т разбуривания"}>
                            <Space.Compact> <StyledFormItemComputing name={"x5-1"}> <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x5-2"}> <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x5-3"}> <Input size={"small"}/>
                            </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Расчетный диаметр скважин "}> <Space.Compact>
                            <StyledFormItemComputing name={"x6-1"}> <Input size={"small"}
                                                                           status={x6_1 ? "warning" : ""}
                                                                           onChange={(e) => {
                                                                               fourForm.setFieldValue("x6-1", e.target.value);
                                                                               setX6_1(e.target.value)
                                                                           }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x6-2"}> <Input size={"small"}
                                                                           status={x6_2 ? "warning" : ""}
                                                                           onChange={(e) => {
                                                                               fourForm.setFieldValue("x6-2", e.target.value);
                                                                               setX6_2(e.target.value)
                                                                           }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x6-3"}> <Input size={"small"}
                                                                           status={x6_3 ? "warning" : ""}
                                                                           onChange={(e) => {
                                                                               fourForm.setFieldValue("x6-3", e.target.value);
                                                                               setX6_3(e.target.value)
                                                                           }}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"W = Ö P / q - величина сопротивления по подошве"}>
                            <Space.Compact> <StyledFormItemComputing name={"x7-1"}> <Input size={"small"}
                                                                                           status={x7_1 ? "warning" : ""}
                                                                                           onChange={(e) => {
                                                                                               fourForm.setFieldValue("x7-1", e.target.value);
                                                                                               setX7_1(e.target.value)
                                                                                           }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x7-2"}> <Input size={"small"}
                                                                                                      status={x7_2 ? "warning" : ""}
                                                                                                      onChange={(e) => {
                                                                                                          fourForm.setFieldValue("x7-2", e.target.value);
                                                                                                          setX7_2(e.target.value)
                                                                                                      }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x7-3"}> <Input size={"small"}
                                                                                                      status={x7_3 ? "warning" : ""}
                                                                                                      onChange={(e) => {
                                                                                                          fourForm.setFieldValue("x7-3", e.target.value);
                                                                                                          setX7_3(e.target.value)
                                                                                                      }}/>
                            </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Р = 0,785 d2 D - вместимость 1 м скважины"}>
                            <Space.Compact> <StyledFormItemComputing name={"x8-1"}> <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x8-2"}> <Input
                                size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x8-3"}> <Input
                                size={"small"}/>
                            </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"D - плотность заряжания "}> <Space.Compact>
                            <StyledFormItemComputing name={"x9-1"}> <Input size={"small"}/>
                            </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x9-2"}> <Input size={"small"}/>
                            </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x9-3"}> <Input size={"small"}/>
                            </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"q - расчетный удельный расход ВВ"}> <Space.Compact>
                            <StyledFormItemComputing name={"x10-1"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x10-2"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x10-3"}> <Input size={"small"}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Lзаб = 20d + 0,2 Нр - 1,5 - длина забойки"}>
                            <Space.Compact> <StyledFormItemComputing name={"x11-1"}> <Input size={"small"}
                                                                                            status={x11_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                fourForm.setFieldValue("x11-1", e.target.value);
                                                                                                setX11_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x11-2"}> <Input
                                size={"small"} status={x11_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x11-2", e.target.value);
                                setX11_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x11-3"}> <Input
                                size={"small"} status={x11_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x11-3", e.target.value);
                                setX11_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Нр = Н 4Ö Nр /(Н q) - высота развала"}> <Space.Compact>
                            <StyledFormItemComputing name={"x12-1"}> <Input size={"small"}
                                                                            status={x12_1 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x12-1", e.target.value);
                                                                                setX12_1(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x12-2"}> <Input size={"small"}
                                                                            status={x12_2 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x12-2", e.target.value);
                                                                                setX12_2(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x12-3"}> <Input size={"small"}
                                                                            status={x12_3 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x12-3", e.target.value);
                                                                                setX12_3(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Nр - количество рядов взрывных скважин"}> <Space.Compact>
                            <StyledFormItemComputing name={"x13-1"}> <Input size={"small"}/>
                            </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x13-2"}> <Input size={"small"}/>
                            </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x13-3"}> <Input size={"small"}/>
                            </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Lзпу = H - Lзаб - длина заряда над подошвой уступа"}>
                            <Space.Compact> <StyledFormItemComputing name={"x14-1"}> <Input size={"small"}
                                                                                            status={x14_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                fourForm.setFieldValue("x14-1", e.target.value);
                                                                                                setX14_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x14-2"}> <Input
                                size={"small"} status={x14_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x14-2", e.target.value);
                                setX14_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x14-3"}> <Input
                                size={"small"} status={x14_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x14-3", e.target.value);
                                setX14_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Lп = Lзпу ( 3Ö 1 + (W/Lзпу)2 - 1) - длина перебура"}>
                            <Space.Compact> <StyledFormItemComputing name={"x15-1"}> <Input size={"small"}
                                                                                            status={x15_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                fourForm.setFieldValue("x15-1", e.target.value);
                                                                                                setX15_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x15-2"}> <Input
                                size={"small"} status={x15_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x15-2", e.target.value);
                                setX15_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x15-3"}> <Input
                                size={"small"} status={x15_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x15-3", e.target.value);
                                setX15_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Lс = Н + Lп - длина скважины"}> <Space.Compact>
                            <StyledFormItemComputing name={"x16-1"}> <Input size={"small"}
                                                                            status={x16_1 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x16-1", e.target.value);
                                                                                setX16_1(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x16-2"}> <Input size={"small"}
                                                                            status={x16_2 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x16-2", e.target.value);
                                                                                setX16_2(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x16-3"}> <Input size={"small"}
                                                                            status={x16_3 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x16-3", e.target.value);
                                                                                setX16_3(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Lзар = Lс-Lзаб - длина заряда скважины"}> <Space.Compact>
                            <StyledFormItemComputing name={"x17-1"}> <Input size={"small"}
                                                                            status={x17_1 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x17-1", e.target.value);
                                                                                setX17_1(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x17-2"}> <Input size={"small"}
                                                                            status={x17_2 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x17-2", e.target.value);
                                                                                setX17_2(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x17-3"}> <Input size={"small"}
                                                                            status={x17_3 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x17-3", e.target.value);
                                                                                setX17_3(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Мскв = Р Lзар - расчетная масса заряда скважины "}>
                            <Space.Compact> <StyledFormItemComputing name={"x18-1"}> <Input size={"small"}
                                                                                            status={x18_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                fourForm.setFieldValue("x18-1", e.target.value);
                                                                                                setX18_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x18-2"}> <Input
                                size={"small"} status={x18_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x18-2", e.target.value);
                                setX18_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x18-3"}> <Input
                                size={"small"} status={x18_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x18-3", e.target.value);
                                setX18_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Мф - принятая масса заряда скважины (кратная патрону) "}>
                            <Space.Compact> <StyledFormItemComputing name={"x19-1"}>
                                <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x19-2"}> <Input
                                size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x19-3"}> <Input
                                size={"small"}
                            /> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"в т.ч. - ВВ"}>
                            <Space.Compact> <
                                StyledFormItemComputing name={"x20-1"}>
                                <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x20-2"}>
                                <Input size={"small"}/> </StyledFormItemComputing>
                                <StyledFormItemComputing name={"x20-3"}> <Input size={"small"}/>
                                </StyledFormItemComputing>
                            </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"- аммонит 6ЖВ (боевик)"}>
                            <Space.Compact>
                                <StyledFormItemComputing name={"x21-1"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing> <StyledFormItemComputing name={"x21-2"}>
                                <Input size={"small"}/> </StyledFormItemComputing>
                                <StyledFormItemComputing name={"x21-3"}>
                                    <Input size={"small"}/>
                                </StyledFormItemComputing>
                            </Space.Compact>
                        </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"qн = qб Кн Кд Кс Кз Кп Квв (1+Квар) - норматив. удельный расход ВВ"}>
                            <Space.Compact> <StyledFormItemComputing name={"x22-1"}> <Input size={"small"}
                                                                                            status={x22_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                fourForm.setFieldValue("x22-1", e.target.value);
                                                                                                setX22_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x22-2"}> <Input
                                size={"small"} status={x22_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x22-2", e.target.value);
                                setX22_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x22-3"}> <Input
                                size={"small"} status={x22_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x22-3", e.target.value);
                                setX22_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"qб - базовый удельный расход"}> <Space.Compact>
                            <StyledFormItemComputing name={"x23-1"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x23-2"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x23-3"}> <Input size={"small"}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"qб h = qб 8 (8/h)^0,25 - базовый для уступов h<12 м"}>
                            <Space.Compact> <StyledFormItemComputing name={"x24-1"}> <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x24-2"}> <Input
                                size={"small"} /> </StyledFormItemComputing> <StyledFormItemComputing name={"x24-3"}> <Input
                                size={"small"}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"qб 8 - базовый для уступа высотой 12 м"}> <Space.Compact>
                            <StyledFormItemComputing name={"x25-1"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x25-2"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x25-3"}> <Input size={"small"}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Кн - к-т, учитывающий размер негабаритного куска "}>
                            <Space.Compact> <StyledFormItemComputing name={"x26-1"}> <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x26-2"}> <Input
                                size={"small"} /> </StyledFormItemComputing> <StyledFormItemComputing name={"x26-3"}> <Input
                                size={"small"} /> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Кд - к-т, учитывающий интенсивность дробления "}>
                            <Space.Compact> <StyledFormItemComputing name={"x27-1"}> <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x27-2"}> <Input
                                size={"small"} /> </StyledFormItemComputing> <StyledFormItemComputing name={"x27-3"}> <Input
                                size={"small"} /> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Кс - к-т, учитывающий последовательность инициирования"}>
                            <Space.Compact> <StyledFormItemComputing name={"x28-1"}> <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x28-2"}> <Input
                                size={"small"} /> </StyledFormItemComputing> <StyledFormItemComputing name={"x28-3"}> <Input
                                size={"small"} /> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Кз - к-т, учитывающий условия взрывания "}> <Space.Compact>
                            <StyledFormItemComputing name={"x29-1"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x29-2"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x29-3"}> <Input size={"small"}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Кп - к-т, учитывающий плотность заряжания "}>
                            <Space.Compact> <StyledFormItemComputing name={"x30-1"}> <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x30-2"}> <Input
                                size={"small"} /> </StyledFormItemComputing> <StyledFormItemComputing name={"x30-3"}> <Input
                                size={"small"} /> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Квв - переводной к-т по идеальной работе"}> <Space.Compact>
                            <StyledFormItemComputing name={"x32-1"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x32-2"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x32-3"}> <Input size={"small"}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Квар - к-т, учитывающий изменение нормат. удельного расхода "}>
                            <Space.Compact> <StyledFormItemComputing name={"x33-1"}> <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x33-2"}> <Input
                                size={"small"} /> </StyledFormItemComputing> <StyledFormItemComputing name={"x33-3"}> <Input
                                size={"small"} /> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Vскв = Мскв / qн - выход руды (породы) с 1 скважины"}>
                            <Space.Compact> <StyledFormItemComputing name={"x34-1"}> <Input size={"small"}
                                                                                            status={x34_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                fourForm.setFieldValue("x34-1", e.target.value);
                                                                                                setX34_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x34-2"}> <Input
                                size={"small"} status={x34_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x34-2", e.target.value);
                                setX34_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x34-3"}> <Input
                                size={"small"} status={x34_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x34-3", e.target.value);
                                setX34_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"а = m W - расстояние между скважинами в ряду"}>
                            <Space.Compact> <StyledFormItemComputing name={"x35-1"}> <Input size={"small"}
                                                                                            status={x35_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                fourForm.setFieldValue("x35-1", e.target.value);
                                                                                                setX35_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x35-2"}> <Input
                                size={"small"} status={x35_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x35-2", e.target.value);
                                setX35_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x35-3"}> <Input
                                size={"small"} status={x35_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x35-3", e.target.value);
                                setX35_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"m = (0,8-1,0) - коэффициент сближения скважин"}>
                            <Space.Compact> <StyledFormItemComputing name={"x36-1"}> <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x36-2"}> <Input
                                size={"small"} /> </StyledFormItemComputing> <StyledFormItemComputing name={"x36-3"}> <Input
                                size={"small"} /> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"в = (0,85-1,0) W - расстояние между рядами скважин"}>
                            <Space.Compact> <StyledFormItemComputing name={"x37-1"}> <Input size={"small"}
                                                                                            status={x37_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                fourForm.setFieldValue("x37-1", e.target.value);
                                                                                                setX37_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x37-2"}> <Input
                                size={"small"} status={x37_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x37-2", e.target.value);
                                setX37_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x37-3"}> <Input
                                size={"small"} status={x37_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x37-3", e.target.value);
                                setX37_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Принятая сетка: а = "}>
                            <Space.Compact> <StyledFormItemComputing name={"x38-1"}> <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x38-2"}> <Input
                                size={"small"} /> </StyledFormItemComputing> <StyledFormItemComputing name={"x38-3"}> <Input
                                size={"small"}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"в = "}> <Space.Compact>
                            <StyledFormItemComputing name={"x39-1"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x39-2"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x39-3"}> <Input size={"small"}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Nбл - количество экскаваторных блоков (кол-во экскаваторов)"}>
                            <Space.Compact> <StyledFormItemComputing name={"x41-1"}> <Input size={"small"}
                                                                                            status={x41_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                fourForm.setFieldValue("x41-1", e.target.value);
                                                                                                setX41_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x41-2"}> <Input
                                size={"small"} status={x41_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x41-2", e.target.value);
                                setX41_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x41-3"}> <Input
                                size={"small"} status={x41_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x41-3", e.target.value);
                                setX41_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Qгэ = Qг / Nбл -годовой объем экскаваторного блока "}>
                            <Space.Compact> <StyledFormItemComputing name={"x42-1"}> <Input size={"small"}
                                                                                            status={x42_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                fourForm.setFieldValue("x42-1", e.target.value);
                                                                                                setX42_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x42-2"}> <Input
                                size={"small"} status={x42_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x42-2", e.target.value);
                                setX42_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x42-3"}> <Input
                                size={"small"} status={x42_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x42-3", e.target.value);
                                setX42_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Vвзр = Qг / (Nвзр х Nн)/Nбл - объем блока на 1 взрыв"}>
                            <Space.Compact> <StyledFormItemComputing name={"x43-1"}> <Input size={"small"}
                                                                                            status={x43_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                fourForm.setFieldValue("x43-1", e.target.value);
                                                                                                setX43_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x43-2"}> <Input
                                size={"small"} status={x43_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x43-2", e.target.value);
                                setX43_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x43-3"}> <Input
                                size={"small"} status={x43_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x43-3", e.target.value);
                                setX43_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Nвзр - количество взрывов в неделю"}> <Space.Compact>
                            <StyledFormItemComputing name={"x44-1"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x44-2"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x44-3"}> <Input size={"small"}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Nскв = Vвзр / V - количество скважин на 1 взрыв"}>
                            <Space.Compact> <StyledFormItemComputing name={"x45-1"}> <Input size={"small"}
                                                                                            status={x45_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                fourForm.setFieldValue("x45-1", e.target.value);
                                                                                                setX45_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x45-2"}> <Input
                                size={"small"} status={x45_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x45-2", e.target.value);
                                setX45_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x45-3"}> <Input
                                size={"small"} status={x45_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x45-3", e.target.value);
                                setX45_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Qвв = Мвв х Nскв - расход ВВ на 1 взрыв"}> <Space.Compact>
                            <StyledFormItemComputing name={"x46-1"}> <Input size={"small"}
                                                                            status={x46_1 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x46-1", e.target.value);
                                                                                setX46_1(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x46-2"}> <Input size={"small"}
                                                                            status={x46_2 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x46-2", e.target.value);
                                                                                setX46_2(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x46-3"}> <Input size={"small"}
                                                                            status={x46_3 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x46-3", e.target.value);
                                                                                setX46_3(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"в т.ч. - ВВ"}>
                            <Space.Compact> <StyledFormItemComputing name={"x47-1"}> <Input size={"small"}
                                                                                            status={x47_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                fourForm.setFieldValue("x47-1", e.target.value);
                                                                                                setX47_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x47-2"}> <Input
                                size={"small"} status={x47_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x47-2", e.target.value);
                                setX47_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x47-3"}> <Input
                                size={"small"} status={x47_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x47-3", e.target.value);
                                setX47_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"- аммонит 6ЖВ (боевик)"}>
                            <Space.Compact> <StyledFormItemComputing name={"x48-1"}> <Input size={"small"}
                                                                                            status={x48_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                fourForm.setFieldValue("x48-1", e.target.value);
                                                                                                setX48_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x48-2"}> <Input
                                size={"small"} status={x48_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x48-2", e.target.value);
                                setX48_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x48-3"}> <Input
                                size={"small"} status={x48_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x48-3", e.target.value);
                                setX48_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Количество СИНВ-С на взрыв"}> <Space.Compact>
                            <StyledFormItemComputing name={"x49-1"}> <Input size={"small"}
                                                                            status={x49_1 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x49-1", e.target.value);
                                                                                setX49_1(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x49-2"}> <Input size={"small"}
                                                                            status={x49_2 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x49-2", e.target.value);
                                                                                setX49_2(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x49-3"}> <Input size={"small"}
                                                                            status={x49_3 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x49-3", e.target.value);
                                                                                setX49_3(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Lдш = 1,1 Nскв а - расход ДШ на взрыв"}> <Space.Compact>
                            <StyledFormItemComputing name={"x50-1"}> <Input size={"small"}
                                                                            status={x50_1 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x50-1", e.target.value);
                                                                                setX50_1(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x50-2"}> <Input size={"small"}
                                                                            status={x50_2 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x50-2", e.target.value);
                                                                                setX50_2(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x50-3"}> <Input size={"small"}
                                                                            status={x50_3 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x50-3", e.target.value);
                                                                                setX50_3(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Количество электродетонаторов на взрыв"}> <Space.Compact>
                            <StyledFormItemComputing name={"x51-1"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x51-2"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x51-3"}> <Input size={"small"}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Годовой расход СИНВ-С"}>
                            <Space.Compact> <StyledFormItemComputing name={"x52-1"}> <Input size={"small"}
                                                                                            status={x52_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                fourForm.setFieldValue("x52-1", e.target.value);
                                                                                                setX52_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x52-2"}> <Input
                                size={"small"} status={x52_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x52-2", e.target.value);
                                setX52_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x52-3"}> <Input
                                size={"small"} status={x52_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x52-3", e.target.value);
                                setX52_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Годовой расход ДШ"}>
                            <Space.Compact> <StyledFormItemComputing name={"x53-1"}> <Input size={"small"}
                                                                                            status={x53_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                fourForm.setFieldValue("x53-1", e.target.value);
                                                                                                setX53_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x53-2"}> <Input
                                size={"small"} status={x53_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x53-2", e.target.value);
                                setX53_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x53-3"}> <Input
                                size={"small"} status={x53_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x53-3", e.target.value);
                                setX53_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Годовой расход ЭД"}>
                            <Space.Compact> <StyledFormItemComputing name={"x54-1"}> <Input size={"small"}
                                                                                            status={x54_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                fourForm.setFieldValue("x54-1", e.target.value);
                                                                                                setX54_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x54-2"}> <Input
                                size={"small"} status={x54_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x54-2", e.target.value);
                                setX54_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x54-3"}> <Input
                                size={"small"} status={x54_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x54-3", e.target.value);
                                setX54_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"qф = Qвв / Vвзр - фактический удельный расход ВВ"}>
                            <Space.Compact> <StyledFormItemComputing name={"x55-1"}> <Input size={"small"}
                                                                                            status={x55_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                fourForm.setFieldValue("x55-1", e.target.value);
                                                                                                setX55_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x55-2"}> <Input
                                size={"small"} status={x55_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x55-2", e.target.value);
                                setX55_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x55-3"}> <Input
                                size={"small"} status={x55_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x55-3", e.target.value);
                                setX55_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"в т.ч. - ВВ"}>
                            <Space.Compact> <StyledFormItemComputing name={"x56-1"}> <Input size={"small"}
                                                                                            status={x56_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                fourForm.setFieldValue("x56-1", e.target.value);
                                                                                                setX56_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x56-2"}> <Input
                                size={"small"} status={x56_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x56-2", e.target.value);
                                setX56_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x56-3"}> <Input
                                size={"small"} status={x56_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x56-3", e.target.value);
                                setX56_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"- аммонит 6ЖВ (боевик)"}>
                            <Space.Compact> <StyledFormItemComputing name={"x57-1"}> <Input size={"small"}
                                                                                            status={x57_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                fourForm.setFieldValue("x57-1", e.target.value);
                                                                                                setX57_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x57-2"}> <Input
                                size={"small"} status={x57_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x57-2", e.target.value);
                                setX57_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x57-3"}> <Input
                                size={"small"} status={x57_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x57-3", e.target.value);
                                setX57_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Удельный расход ДША"}>
                            <Space.Compact> <StyledFormItemComputing name={"x58-1"}> <Input size={"small"}
                                                                                            status={x58_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                fourForm.setFieldValue("x58-1", e.target.value);
                                                                                                setX58_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x58-2"}> <Input
                                size={"small"} status={x58_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x58-2", e.target.value);
                                setX58_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x58-3"}> <Input
                                size={"small"} status={x58_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x58-3", e.target.value);
                                setX58_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Удельный расход СИНВ-С"}>
                            <Space.Compact> <StyledFormItemComputing name={"x59-1"}> <Input size={"small"}
                                                                                            status={x59_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                fourForm.setFieldValue("x59-1", e.target.value);
                                                                                                setX59_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x59-2"}> <Input
                                size={"small"} status={x59_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x59-2", e.target.value);
                                setX59_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x59-3"}> <Input
                                size={"small"} status={x59_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x59-3", e.target.value);
                                setX59_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Lвз = Nскв Lс -объем бурения на взрыв (с учетом 5% потерь)"}>
                            <Space.Compact> <StyledFormItemComputing name={"x61-1"}> <Input size={"small"}
                                                                                            status={x61_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                fourForm.setFieldValue("x61-1", e.target.value);
                                                                                                setX61_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x61-2"}> <Input
                                size={"small"} status={x61_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x61-2", e.target.value);
                                setX61_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x61-3"}> <Input
                                size={"small"} status={x61_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x61-3", e.target.value);
                                setX61_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Nсмб - количество смен в сутки на бурении"}>
                            <Space.Compact> <StyledFormItemComputing name={"x62-1"}> <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x62-2"}> <Input/> </StyledFormItemComputing> <StyledFormItemComputing name={"x62-3"}> <Input
                                size={"small"} s/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Lгод = Lвз х Nвзр х Nн х Nбл - годовой объем бурения"}>
                            <Space.Compact> <StyledFormItemComputing name={"x63-1"}> <Input size={"small"}
                                                                                            status={x63_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                fourForm.setFieldValue("x63-1", e.target.value);
                                                                                                setX63_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x63-2"}> <Input
                                size={"small"} status={x63_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x63-2", e.target.value);
                                setX63_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x63-3"}> <Input
                                size={"small"} status={x63_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x63-3", e.target.value);
                                setX63_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Псм = n Тсм Ксм - сменная производительность станка"}>
                            <Space.Compact> <StyledFormItemComputing name={"x64-1"}> <Input size={"small"}
                                                                                            status={x64_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                fourForm.setFieldValue("x64-1", e.target.value);
                                                                                                setX64_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x64-2"}> <Input
                                size={"small"} status={x64_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x64-2", e.target.value);
                                setX64_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x64-3"}> <Input
                                size={"small"} status={x64_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x64-3", e.target.value);
                                setX64_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"n - скорость бурения"}>
                            <Space.Compact> <StyledFormItemComputing name={"x65-1"}> <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x65-2"}> <Input
                                size={"small"} /> </StyledFormItemComputing> <StyledFormItemComputing name={"x65-3"}> <Input
                                size={"small"}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Ксм - коэффициент использования станка в смену"}>
                            <Space.Compact> <StyledFormItemComputing name={"x66-1"}> <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x66-2"}> <Input
                                size={"small"} /> </StyledFormItemComputing> <StyledFormItemComputing name={"x66-3"}> <Input
                                size={"small"} /> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Пгод = Псм Nсмб Nрд Ктг - годовая производительность станка"}>
                            <Space.Compact> <StyledFormItemComputing name={"x67-1"}> <Input size={"small"}
                                                                                            status={x67_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                fourForm.setFieldValue("x67-1", e.target.value);
                                                                                                setX67_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x67-2"}> <Input
                                size={"small"} status={x67_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x67-2", e.target.value);
                                setX67_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x67-3"}> <Input
                                size={"small"} status={x67_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x67-3", e.target.value);
                                setX67_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Ктг - коэффициент технической готовности"}> <Space.Compact>
                            <StyledFormItemComputing name={"x68-1"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x68-2"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x68-3"}> <Input size={"small"}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Тсм - продолжительность смены"}> <Space.Compact>
                            <StyledFormItemComputing name={"x69-1"}> <Input size={"small"}
                                                                            status={x69_1 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x69-1", e.target.value);
                                                                                setX69_1(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x69-2"}> <Input size={"small"}
                                                                            status={x69_2 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x69-2", e.target.value);
                                                                                setX69_2(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x69-3"}> <Input size={"small"}
                                                                            status={x69_3 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x69-3", e.target.value);
                                                                                setX69_3(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Nн - количество рабочих недель"}> <Space.Compact>
                            <StyledFormItemComputing name={"x70-1"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x70-2"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x70-3"}> <Input size={"small"}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Nр.д - количество рабочих дней в году"}> <Space.Compact>
                            <StyledFormItemComputing name={"x71-1"}> <Input size={"small"}
                                                                            status={x71_1 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x71-1", e.target.value);
                                                                                setX71_1(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x71-2"}> <Input size={"small"}
                                                                            status={x71_2 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x71-2", e.target.value);
                                                                                setX71_2(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x71-3"}> <Input size={"small"}
                                                                            status={x71_3 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x71-3", e.target.value);
                                                                                setX71_3(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Lотк - годовой объем бурения на заоткоске"}>
                            <Space.Compact> <StyledFormItemComputing name={"x72-1"}> <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x72-2"}> <Input
                                size={"small"} /> </StyledFormItemComputing> <StyledFormItemComputing name={"x72-3"}> <Input
                                size={"small"} /> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Nбс = Lгод / Пгод - расчетное количество станков"}>
                            <Space.Compact> <StyledFormItemComputing name={"x73-1"}> <Input size={"small"}
                                                                                            status={x73_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                fourForm.setFieldValue("x73-1", e.target.value);
                                                                                                setX73_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x73-2"}> <Input
                                size={"small"} status={x73_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x73-2", e.target.value);
                                setX73_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x73-3"}> <Input
                                size={"small"} status={x73_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x73-3", e.target.value);
                                setX73_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Принятое количество буровых станков"}> <Space.Compact>
                            <StyledFormItemComputing name={"x74-1"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x74-2"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x74-3"}> <Input size={"small"}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Количество электродетонатор на 1 взрыв (для детонации ДША)"}>
                            <Space.Compact> <StyledFormItemComputing name={"x76-1"}> <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x76-2"}> <Input
                                size={"small"} s/> </StyledFormItemComputing> <StyledFormItemComputing name={"x76-3"}> <Input
                                size={"small"}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Ширина развала горной массы в забое"}> <Space.Compact>
                            <StyledFormItemComputing name={"x86-1"}> <Input size={"small"}
                                                                            status={x86_1 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x86-1", e.target.value);
                                                                                setX86_1(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x86-2"}> <Input size={"small"}
                                                                            status={x86_2 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x86-2", e.target.value);
                                                                                setX86_2(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x86-3"}> <Input size={"small"}
                                                                            status={x86_3 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x86-3", e.target.value);
                                                                                setX86_3(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Вр = В (kр Н/Нр -1) + Н/2 j"}> <Space.Compact>
                            <StyledFormItemComputing name={"x87-1"}> <Input size={"small"}
                                                                            status={x87_1 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x87-1", e.target.value);
                                                                                setX87_1(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x87-2"}> <Input size={"small"}
                                                                            status={x87_2 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x87-2", e.target.value);
                                                                                setX87_2(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x87-3"}> <Input size={"small"}
                                                                            status={x87_3 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x87-3", e.target.value);
                                                                                setX87_3(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"В - ширина заходки по целику"}> <Space.Compact>
                            <StyledFormItemComputing name={"x88-1"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x88-2"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x88-3"}> <Input size={"small"}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"j = tga х tgb / (tga - tgb)"}> <Space.Compact>
                            <StyledFormItemComputing name={"x89-1"}> <Input size={"small"}
                                                                            status={x89_1 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x89-1", e.target.value);
                                                                                setX89_1(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x89-2"}> <Input size={"small"}
                                                                            status={x89_2 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x89-2", e.target.value);
                                                                                setX89_2(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x89-3"}> <Input size={"small"}
                                                                            status={x89_3 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x89-3", e.target.value);
                                                                                setX89_3(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"a - угол откоса рабочего уступа"}> <Space.Compact>
                            <StyledFormItemComputing name={"x90-1"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x90-2"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x90-3"}> <Input size={"small"}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"b - угол откоса развала"}> <Space.Compact>
                            <StyledFormItemComputing name={"x91-1"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x91-2"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x91-3"}> <Input size={"small"}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"В = Н сtga + с + в (n-1) "}> <Space.Compact>
                            <StyledFormItemComputing name={"x92-1"}> <Input size={"small"}
                                                                            status={x92_1 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x92-1", e.target.value);
                                                                                setX92_1(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x92-2"}> <Input size={"small"}
                                                                            status={x92_2 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x92-2", e.target.value);
                                                                                setX92_2(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x92-3"}> <Input size={"small"}
                                                                            status={x92_3 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x92-3", e.target.value);
                                                                                setX92_3(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"с - берма "}>
                            <Space.Compact> <StyledFormItemComputing name={"x93-1"}> <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x93-2"}> <Input
                                size={"small"}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x93-3"}> <Input
                                size={"small"}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Общая ширина развала горной массы"}> <Space.Compact>
                            <StyledFormItemComputing name={"x94-1"}> <Input size={"small"}
                                                                            status={x94_1 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x94-1", e.target.value);
                                                                                setX94_1(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x94-2"}> <Input size={"small"}
                                                                            status={x94_2 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x94-2", e.target.value);
                                                                                setX94_2(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x94-3"}> <Input size={"small"}
                                                                            status={x94_3 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                fourForm.setFieldValue("x94-3", e.target.value);
                                                                                setX94_3(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Расчет безопасных расстояний"}>
                        </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"1. По разлету отдельных кусков руды и породы (для людей)"}></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"hз - коэффициент заполнения скважины ВВ:"}> <Space.Compact>
                            <StyledFormItemComputing name={"x102-1"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x102-2"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x102-3"}> <Input size={"small"}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"hз = Lзар / Lскв"}>
                            <Space.Compact> <StyledFormItemComputing name={"x103-1"}> <Input size={"small"}
                                                                                             status={x103_1 ? "warning" : ""}
                                                                                             onChange={(e) => {
                                                                                                 fourForm.setFieldValue("x103-1", e.target.value);
                                                                                                 setX103_1(e.target.value)
                                                                                             }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x103-2"}> <Input
                                size={"small"} status={x103_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x103-2", e.target.value);
                                setX103_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x103-3"}> <Input
                                size={"small"} status={x103_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x103-3", e.target.value);
                                setX103_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"hзаб = 1 (к-т заполнения скважины забойкой)"}>
                            <Space.Compact> <StyledFormItemComputing name={"x104-1"}> <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x104-2"}> <Input
                                size={"small"} /> </StyledFormItemComputing> <StyledFormItemComputing name={"x104-3"}> <Input
                                size={"small"} /> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Rразл = Кр rраз - в сторону косогора"}> <Space.Compact>
                            <StyledFormItemComputing name={"x105-1"}> <Input size={"small"}
                                                                             status={x105_1 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x105-1", e.target.value);
                                                                                 setX105_1(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x105-2"}> <Input size={"small"}
                                                                             status={x105_2 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x105-2", e.target.value);
                                                                                 setX105_2(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x105-3"}> <Input size={"small"}
                                                                             status={x105_3 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x105-3", e.target.value);
                                                                                 setX105_3(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Кр - к-т, учитывающий рельеф местности (косогор) "}>
                            <Space.Compact> <StyledFormItemComputing name={"x106-1"}> <Input size={"small"}
                                                                                             status={x106_1 ? "warning" : ""}
                                                                                             onChange={(e) => {
                                                                                                 fourForm.setFieldValue("x106-1", e.target.value);
                                                                                                 setX106_1(e.target.value)
                                                                                             }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x106-2"}> <Input
                                size={"small"} status={x106_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x106-2", e.target.value);
                                setX106_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x106-3"}> <Input
                                size={"small"} status={x106_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x106-3", e.target.value);
                                setX106_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Н - превышение верхней отм взрываемого участка над границей опасной зоны"}>
                            <Space.Compact> <StyledFormItemComputing name={"x108-1"}> <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x108-2"}> <Input
                                size={"small"} /> </StyledFormItemComputing> <StyledFormItemComputing name={"x108-3"}> <Input
                                size={"small"} /> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Кр = 1 + tgβ"}>
                            <Space.Compact> <StyledFormItemComputing name={"x109-1"}> <Input size={"small"}
                                                                                             status={x109_1 ? "warning" : ""}
                                                                                             onChange={(e) => {
                                                                                                 fourForm.setFieldValue("x109-1", e.target.value);
                                                                                                 setX109_1(e.target.value)
                                                                                             }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x109-2"}> <Input
                                size={"small"} status={x109_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x109-2", e.target.value);
                                setX109_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x109-3"}> <Input
                                size={"small"} status={x109_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x109-3", e.target.value);
                                setX109_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"β - угол косогора**"}>
                            <Space.Compact> <StyledFormItemComputing name={"x110-1"}> <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x110-2"}> <Input
                                size={"small"} /> </StyledFormItemComputing> <StyledFormItemComputing name={"x110-3"}> <Input
                                size={"small"} /> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Rразл = Кр rраз - в сторону косогора"}> <Space.Compact>
                            <StyledFormItemComputing name={"x111-1"}> <Input size={"small"}
                                                                             status={x111_1 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x111-1", e.target.value);
                                                                                 setX111_1(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x111-2"}> <Input size={"small"}
                                                                             status={x111_2 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x111-2", e.target.value);
                                                                                 setX111_2(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x111-3"}> <Input size={"small"}
                                                                             status={x111_3 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x111-3", e.target.value);
                                                                                 setX111_3(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Принято "}>
                            <Space.Compact> <StyledFormItemComputing name={"x112-1"}> <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x112-2"}> <Input
                                size={"small"} /> </StyledFormItemComputing> <StyledFormItemComputing name={"x112-3"}> <Input
                                size={"small"} /> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>

                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"2. По УВВ на застекление"}> <Space.Compact>
                            <StyledFormItemComputing name={"x114-1"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x114-2"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x114-3"}> <Input size={"small"}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Rувв = 65 ÖQэо"}>
                            <Space.Compact> <StyledFormItemComputing name={"x115-1"}> <Input size={"small"}
                                                                                             status={x115_1 ? "warning" : ""}
                                                                                             onChange={(e) => {
                                                                                                 fourForm.setFieldValue("x115-1", e.target.value);
                                                                                                 setX115_1(e.target.value)
                                                                                             }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x115-2"}> <Input
                                size={"small"} status={x115_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x115-2", e.target.value);
                                setX115_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x115-3"}> <Input
                                size={"small"} status={x115_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x115-3", e.target.value);
                                setX115_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Qэо = Qэ + Qдш"}>
                            <Space.Compact> <StyledFormItemComputing name={"x116-1"}> <Input size={"small"}
                                                                                             status={x116_1 ? "warning" : ""}
                                                                                             onChange={(e) => {
                                                                                                 fourForm.setFieldValue("x116-1", e.target.value);
                                                                                                 setX116_1(e.target.value)
                                                                                             }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x116-2"}> <Input
                                size={"small"} status={x116_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x116-2", e.target.value);
                                setX116_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x116-3"}> <Input
                                size={"small"} status={x116_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x116-3", e.target.value);
                                setX116_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Qэ = 12 Р d Кз N "}>
                            <Space.Compact> <StyledFormItemComputing name={"x117-1"}> <Input size={"small"}
                                                                                             status={x117_1 ? "warning" : ""}
                                                                                             onChange={(e) => {
                                                                                                 fourForm.setFieldValue("x117-1", e.target.value);
                                                                                                 setX117_1(e.target.value)
                                                                                             }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x117-2"}> <Input
                                size={"small"} status={x117_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x117-2", e.target.value);
                                setX117_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x117-3"}> <Input
                                size={"small"} status={x117_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x117-3", e.target.value);
                                setX117_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Lзаб / d"}>
                            <Space.Compact> <StyledFormItemComputing name={"x118-1"}> <Input size={"small"}
                                                                                             status={x118_1 ? "warning" : ""}
                                                                                             onChange={(e) => {
                                                                                                 fourForm.setFieldValue("x118-1", e.target.value);
                                                                                                 setX118_1(e.target.value)
                                                                                             }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x118-2"}> <Input
                                size={"small"} status={x118_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x118-2", e.target.value);
                                setX118_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x118-3"}> <Input
                                size={"small"} status={x118_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x118-3", e.target.value);
                                setX118_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Кз - к-т, зависящий от отношения Lзаб к d скважины"}>
                            <Space.Compact> <StyledFormItemComputing name={"x119-1"}> <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x119-2"}> <Input
                                size={"small"} /> </StyledFormItemComputing> <StyledFormItemComputing name={"x119-3"}> <Input
                                size={"small"} /> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"N - количество взрываемых зарядов в группе"}>
                            <Space.Compact> <StyledFormItemComputing name={"x120-1"}> <Input size={"small"}
                                                                                             status={x120_1 ? "warning" : ""}
                                                                                             onChange={(e) => {
                                                                                                 fourForm.setFieldValue("x120-1", e.target.value);
                                                                                                 setX120_1(e.target.value)
                                                                                             }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x120-2"}> <Input
                                size={"small"} status={x120_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x120-2", e.target.value);
                                setX120_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x120-3"}> <Input
                                size={"small"} status={x120_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x120-3", e.target.value);
                                setX120_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Nг - количество групп зарядов"}> <Space.Compact>
                            <StyledFormItemComputing name={"x121-1"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x121-2"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x121-3"}> <Input size={"small"}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Qдш, количество ВВ в ДШЭ"}> <Space.Compact>
                            <StyledFormItemComputing name={"x122-1"}> <Input size={"small"}
                                                                             status={x122_1 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x122-1", e.target.value);
                                                                                 setX122_1(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x122-2"}> <Input size={"small"}
                                                                             status={x122_2 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x122-2", e.target.value);
                                                                                 setX122_2(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x122-3"}> <Input size={"small"}
                                                                             status={x122_3 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x122-3", e.target.value);
                                                                                 setX122_3(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Длина ДШ на группу"}>
                            <Space.Compact> <StyledFormItemComputing name={"x123-1"}> <Input size={"small"}
                                                                                             status={x123_1 ? "warning" : ""}
                                                                                             onChange={(e) => {
                                                                                                 fourForm.setFieldValue("x123-1", e.target.value);
                                                                                                 setX123_1(e.target.value)
                                                                                             }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x123-2"}> <Input
                                size={"small"} status={x123_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x123-2", e.target.value);
                                setX123_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x123-3"}> <Input
                                size={"small"} status={x123_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x123-3", e.target.value);
                                setX123_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Удельный вес ВВ в 1м ДШЭ"}> <Space.Compact>
                            <StyledFormItemComputing name={"x124-1"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x124-2"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x124-3"}> <Input size={"small"}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Группа пород по СНиПу"}>
                            <Space.Compact> <StyledFormItemComputing name={"x125-1"}> <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x125-2"}> <Input
                                size={"small"} /> </StyledFormItemComputing> <StyledFormItemComputing name={"x125-3"}> <Input
                                size={"small"} /> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Коэффициент на группу пород "}> <Space.Compact>
                            <StyledFormItemComputing name={"x126-1"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x126-2"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x126-3"}> <Input size={"small"}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Взрывание при отрицательных температурах"}> <Space.Compact>
                            <StyledFormItemComputing name={"x127-1"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x127-2"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x127-3"}> <Input size={"small"}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Взрывание с замедлением"}> <Space.Compact>
                            <StyledFormItemComputing name={"x128-1"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x128-2"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x128-3"}> <Input size={"small"}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Rувв"}> <Space.Compact>
                            <StyledFormItemComputing name={"x129-1"}> <Input size={"small"}
                                                                             status={x129_1 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x129-1", e.target.value);
                                                                                 setX129_1(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x129-2"}> <Input size={"small"}
                                                                             status={x129_2 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x129-2", e.target.value);
                                                                                 setX129_2(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x129-3"}> <Input size={"small"}
                                                                             status={x129_3 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x129-3", e.target.value);
                                                                                 setX129_3(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Принято "}>
                            <Space.Compact> <StyledFormItemComputing name={"x130-1"}> <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x130-2"}> <Input
                                size={"small"} /> </StyledFormItemComputing> <StyledFormItemComputing name={"x130-3"}> <Input
                                size={"small"} /> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"3. По сейсмике"}>
                            <Space.Compact> <StyledFormItemComputing name={"x132-1"}> <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x132-2"}> <Input
                                size={"small"} /> </StyledFormItemComputing> <StyledFormItemComputing name={"x132-3"}> <Input
                                size={"small"} /> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Rc = Кг Кс a Q1/3 / N1/4"}> <Space.Compact>
                            <StyledFormItemComputing name={"x133-1"}> <Input size={"small"}
                                                                             status={x133_1 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x133-1", e.target.value);
                                                                                 setX133_1(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x133-2"}> <Input size={"small"}
                                                                             status={x133_2 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x133-2", e.target.value);
                                                                                 setX133_2(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x133-3"}> <Input size={"small"}
                                                                             status={x133_3 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x133-3", e.target.value);
                                                                                 setX133_3(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Кг - к-т, зависящий от свойств грунта"}> <Space.Compact>
                            <StyledFormItemComputing name={"x134-1"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x134-2"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x134-3"}> <Input size={"small"}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Кс - к-т, зависящий от типа зданий и зарактера застройки"}>
                            <Space.Compact> <StyledFormItemComputing name={"x135-1"}> <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x135-2"}> <Input
                                size={"small"} /> </StyledFormItemComputing> <StyledFormItemComputing name={"x135-3"}> <Input
                                size={"small"} /> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"a - к-т, зависящий от условий взрывания"}> <Space.Compact>
                            <StyledFormItemComputing name={"x136-1"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x136-2"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x136-3"}> <Input size={"small"}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Q - общая масса одновременно взрываемых зарядов,кг"}>
                            <Space.Compact> <StyledFormItemComputing name={"x137-1"}> <Input size={"small"}
                                                                                             status={x137_1 ? "warning" : ""}
                                                                                             onChange={(e) => {
                                                                                                 fourForm.setFieldValue("x137-1", e.target.value);
                                                                                                 setX137_1(e.target.value)
                                                                                             }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x137-2"}> <Input
                                size={"small"} status={x137_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x137-2", e.target.value);
                                setX137_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x137-3"}> <Input
                                size={"small"} status={x137_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x137-3", e.target.value);
                                setX137_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"N - число зарядов ВВ"}>
                            <Space.Compact> <StyledFormItemComputing name={"x138-1"}> <Input size={"small"}
                                                                                             status={x138_1 ? "warning" : ""}
                                                                                             onChange={(e) => {
                                                                                                 fourForm.setFieldValue("x138-1", e.target.value);
                                                                                                 setX138_1(e.target.value)
                                                                                             }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x138-2"}> <Input
                                size={"small"} status={x138_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x138-2", e.target.value);
                                setX138_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x138-3"}> <Input
                                size={"small"} status={x138_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x138-3", e.target.value);
                                setX138_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Принято "}>
                            <Space.Compact> <StyledFormItemComputing name={"x139-1"}> <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x139-2"}> <Input
                                size={"small"} /> </StyledFormItemComputing> <StyledFormItemComputing name={"x139-3"}> <Input
                                size={"small"} /> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"По разлету отдельных кусков руды и породы (для оборудования и зданий)*"}>
                            <Space.Compact> <StyledFormItemComputing name={"x141-1"}> <Input size={"small"}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x141-2"}> <Input
                                size={"small"} /> </StyledFormItemComputing> <StyledFormItemComputing name={"x141-3"}> <Input
                                size={"small"} /> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Rр = 200 Ку (q Н)0,4 / (Lзаб)0,5"}> <Space.Compact>
                            <StyledFormItemComputing name={"x142-1"}> <Input size={"small"}
                                                                             status={x142_1 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x142-1", e.target.value);
                                                                                 setX142_1(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x142-2"}> <Input size={"small"}
                                                                             status={x142_2 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x142-2", e.target.value);
                                                                                 setX142_2(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x142-3"}> <Input size={"small"}
                                                                             status={x142_3 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x142-3", e.target.value);
                                                                                 setX142_3(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Ку - к-т условий взрывания"}> <Space.Compact>
                            <StyledFormItemComputing name={"x143-1"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x143-2"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x143-3"}> <Input size={"small"}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"q - удельный расход ВВ"}>
                            <Space.Compact> <StyledFormItemComputing name={"x144-1"}> <Input size={"small"}
                                                                                             status={x144_1 ? "warning" : ""}
                                                                                             onChange={(e) => {
                                                                                                 fourForm.setFieldValue("x144-1", e.target.value);
                                                                                                 setX144_1(e.target.value)
                                                                                             }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x144-2"}> <Input
                                size={"small"} status={x144_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x144-2", e.target.value);
                                setX144_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x144-3"}> <Input
                                size={"small"} status={x144_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x144-3", e.target.value);
                                setX144_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Н - высота уступа"}>
                            <Space.Compact> <StyledFormItemComputing name={"x145-1"}> <Input size={"small"}
                                                                                             status={x145_1 ? "warning" : ""}
                                                                                             onChange={(e) => {
                                                                                                 fourForm.setFieldValue("x145-1", e.target.value);
                                                                                                 setX145_1(e.target.value)
                                                                                             }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x145-2"}> <Input
                                size={"small"} status={x145_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x145-2", e.target.value);
                                setX145_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x145-3"}> <Input
                                size={"small"} status={x145_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x145-3", e.target.value);
                                setX145_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Lзаб - длина забойки"}>
                            <Space.Compact> <StyledFormItemComputing name={"x146-1"}> <Input size={"small"}
                                                                                             status={x146_1 ? "warning" : ""}
                                                                                             onChange={(e) => {
                                                                                                 fourForm.setFieldValue("x146-1", e.target.value);
                                                                                                 setX146_1(e.target.value)
                                                                                             }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x146-2"}> <Input
                                size={"small"} status={x146_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x146-2", e.target.value);
                                setX146_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x146-3"}> <Input
                                size={"small"} status={x146_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x146-3", e.target.value);
                                setX146_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Принято "}>
                            <Space.Compact> <StyledFormItemComputing name={"x147-1"}> <Input size={"small"}
                                                                                             status={x147_1 ? "warning" : ""}
                                                                                             onChange={(e) => {
                                                                                                 fourForm.setFieldValue("x147-1", e.target.value);
                                                                                                 setX147_1(e.target.value)
                                                                                             }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x147-2"}> <Input
                                size={"small"} status={x147_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x147-2", e.target.value);
                                setX147_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x147-3"}> <Input
                                size={"small"} status={x147_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x147-3", e.target.value);
                                setX147_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"* - В соответствии с Руководством по определению радиусов "}>
                            <Space.Compact> <StyledFormItemComputing name={"x149-1"}> <Input size={"small"}
                                                                                             status={x149_1 ? "warning" : ""}
                                                                                             onChange={(e) => {
                                                                                                 fourForm.setFieldValue("x149-1", e.target.value);
                                                                                                 setX149_1(e.target.value)
                                                                                             }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x149-2"}> <Input
                                size={"small"} status={x149_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x149-2", e.target.value);
                                setX149_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x149-3"}> <Input
                                size={"small"} status={x149_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x149-3", e.target.value);
                                setX149_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"опасных зон по разлету кусков для оборудования, зданий и с"}>
                            <Space.Compact> <StyledFormItemComputing name={"x150-1"}> <Input size={"small"}
                                                                                             status={x150_1 ? "warning" : ""}
                                                                                             onChange={(e) => {
                                                                                                 fourForm.setFieldValue("x150-1", e.target.value);
                                                                                                 setX150_1(e.target.value)
                                                                                             }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x150-2"}> <Input
                                size={"small"} status={x150_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x150-2", e.target.value);
                                setX150_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x150-3"}> <Input
                                size={"small"} status={x150_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x150-3", e.target.value);
                                setX150_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"сооружений…, ООО ЦПЭССЛ БВР, МГТУ и согласованным Ростехнадзором "}>
                            <Space.Compact> <StyledFormItemComputing name={"x151-1"}> <Input size={"small"}
                                                                                             status={x151_1 ? "warning" : ""}
                                                                                             onChange={(e) => {
                                                                                                 fourForm.setFieldValue("x151-1", e.target.value);
                                                                                                 setX151_1(e.target.value)
                                                                                             }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x151-2"}> <Input
                                size={"small"} status={x151_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x151-2", e.target.value);
                                setX151_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x151-3"}> <Input
                                size={"small"} status={x151_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x151-3", e.target.value);
                                setX151_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Удельный расход дизтоплива(принят)"}> <Space.Compact>
                            <StyledFormItemComputing name={"x155-1"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x155-2"}> <Input size={"small"}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x155-3"}> <Input size={"small"}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Удельный расход дизтоплива"}> <Space.Compact>
                            <StyledFormItemComputing name={"x156-1"}> <Input size={"small"}
                                                                             status={x156_1 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x156-1", e.target.value);
                                                                                 setX156_1(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x156-2"}> <Input size={"small"}
                                                                             status={x156_2 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x156-2", e.target.value);
                                                                                 setX156_2(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x156-3"}> <Input size={"small"}
                                                                             status={x156_3 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x156-3", e.target.value);
                                                                                 setX156_3(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Удельный вес топлива"}>
                            <Space.Compact> <StyledFormItemComputing name={"x159-1"}> <Input size={"small"}
                                                                                             status={x159_1 ? "warning" : ""}
                                                                                             onChange={(e) => {
                                                                                                 fourForm.setFieldValue("x159-1", e.target.value);
                                                                                                 setX159_1(e.target.value)
                                                                                             }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x159-2"}> <Input
                                size={"small"} status={x159_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x159-2", e.target.value);
                                setX159_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x159-3"}> <Input
                                size={"small"} status={x159_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x159-3", e.target.value);
                                setX159_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Количество часов работы в год"}> <Space.Compact>
                            <StyledFormItemComputing name={"x160-1"}> <Input size={"small"}
                                                                             status={x160_1 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x160-1", e.target.value);
                                                                                 setX160_1(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x160-2"}> <Input size={"small"}
                                                                             status={x160_2 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x160-2", e.target.value);
                                                                                 setX160_2(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x160-3"}> <Input size={"small"}
                                                                             status={x160_3 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x160-3", e.target.value);
                                                                                 setX160_3(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Годовой расход дизтоплива"}> <Space.Compact>
                            <StyledFormItemComputing name={"x161-1"}> <Input size={"small"}
                                                                             status={x161_1 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x161-1", e.target.value);
                                                                                 setX161_1(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x161-2"}> <Input size={"small"}
                                                                             status={x161_2 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x161-2", e.target.value);
                                                                                 setX161_2(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x161-3"}> <Input size={"small"}
                                                                             status={x161_3 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x161-3", e.target.value);
                                                                                 setX161_3(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Неучтенный расход"}>
                            <Space.Compact> <StyledFormItemComputing name={"x162-1"}> <Input size={"small"}
                                                                                             status={x162_1 ? "warning" : ""}
                                                                                             onChange={(e) => {
                                                                                                 fourForm.setFieldValue("x162-1", e.target.value);
                                                                                                 setX162_1(e.target.value)
                                                                                             }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"x162-2"}> <Input
                                size={"small"} status={x162_2 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x162-2", e.target.value);
                                setX162_2(e.target.value)
                            }}/> </StyledFormItemComputing> <StyledFormItemComputing name={"x162-3"}> <Input
                                size={"small"} status={x162_3 ? "warning" : ""} onChange={(e) => {
                                fourForm.setFieldValue("x162-3", e.target.value);
                                setX162_3(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Неучтенный годовой расход дизтоплива"}> <Space.Compact>
                            <StyledFormItemComputing name={"x163-1"}> <Input size={"small"}
                                                                             status={x163_1 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x163-1", e.target.value);
                                                                                 setX163_1(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x163-2"}> <Input size={"small"}
                                                                             status={x163_2 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x163-2", e.target.value);
                                                                                 setX163_2(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x163-3"}> <Input size={"small"}
                                                                             status={x163_3 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x163-3", e.target.value);
                                                                                 setX163_3(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Общий расход дизтоплива в год"}> <Space.Compact>
                            <StyledFormItemComputing name={"x164-1"}> <Input size={"small"}
                                                                             status={x164_1 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x164-1", e.target.value);
                                                                                 setX164_1(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x164-2"}> <Input size={"small"}
                                                                             status={x164_2 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x164-2", e.target.value);
                                                                                 setX164_2(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"x164-3"}> <Input size={"small"}
                                                                             status={x164_3 ? "warning" : ""}
                                                                             onChange={(e) => {
                                                                                 fourForm.setFieldValue("x164-3", e.target.value);
                                                                                 setX164_3(e.target.value)
                                                                             }}/> </StyledFormItemComputing>
                        </Space.Compact></StyledFormItemComputing>

                    </Form>

                </StyledBlockBig>
            </div>
            <div id="part-4-1">
                <StyledBlockBig label={"Погрузка"}>
                    <Form
                        labelWrap={true}
                        labelAlign={"left"}
                        labelCol={{span: 14}}
                        wrapperCol={{span: 7}}>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Годовой объем работ (Qг)"}> <Space.Compact>
                            <StyledFormItemComputing name={"k1-1"}> <Input size={"small"}
                                                                           status={k1_1 ? "warning" : ""}
                                                                           onChange={(e) => {
                                                                               friForm.setFieldValue("k1-1", e.target.value);
                                                                               setK1_1(e.target.value)
                                                                           }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"k1-2"}> <Input size={"small"}
                                                                           status={k1_2 ? "warning" : ""}
                                                                           onChange={(e) => {
                                                                               friForm.setFieldValue("k1-2", e.target.value);
                                                                               setK1_2(e.target.value)
                                                                           }}/> </StyledFormItemComputing>
                        </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Годовой объем работ (Qг)"}> <Space.Compact>
                            <StyledFormItemComputing name={"k2-1"}> <Input size={"small"}
                                                                           status={k2_1 ? "warning" : ""}
                                                                           onChange={(e) => {
                                                                               friForm.setFieldValue("k2-1", e.target.value);
                                                                               setK2_1(e.target.value)
                                                                           }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"k2-2"}> <Input size={"small"}
                                                                           status={k2_2 ? "warning" : ""}
                                                                           onChange={(e) => {
                                                                               friForm.setFieldValue("k2-2", e.target.value);
                                                                               setK2_2(e.target.value)
                                                                           }}/> </StyledFormItemComputing>
                        </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Крепость по шкале Протодъяконова"}> <Space.Compact>
                            <StyledFormItemComputing name={"k3-1"}> <Input size={"small"}
                                                                           status={k3_1 ? "warning" : ""}
                                                                           onChange={(e) => {
                                                                               friForm.setFieldValue("k3-1", e.target.value);
                                                                               setK3_1(e.target.value)
                                                                           }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"k3-2"}> <Input size={"small"}
                                                                           status={k3_2 ? "warning" : ""}
                                                                           onChange={(e) => {
                                                                               friForm.setFieldValue("k3-2", e.target.value);
                                                                               setK3_2(e.target.value)
                                                                           }}/> </StyledFormItemComputing>
                        </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={""}> <Space.Compact>
                            <StyledFormItemComputing name={"k4-1"}> <Input size={"small"}
                                                                           status={k4_1 ? "warning" : ""}
                                                                           onChange={(e) => {
                                                                               friForm.setFieldValue("k4-1", e.target.value);
                                                                               setK4_1(e.target.value)
                                                                           }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"k4-2"}> <Input size={"small"}
                                                                           status={k4_2 ? "warning" : ""}
                                                                           onChange={(e) => {
                                                                               friForm.setFieldValue("k4-2", e.target.value);
                                                                               setK4_2(e.target.value)
                                                                           }}/> </StyledFormItemComputing>
                        </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={""}> <Space.Compact>
                            <StyledFormItemComputing name={"k5-1"}> <Input size={"small"}
                                                                           status={k5_1 ? "warning" : ""}
                                                                           onChange={(e) => {
                                                                               friForm.setFieldValue("k5-1", e.target.value);
                                                                               setK5_1(e.target.value)
                                                                           }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"k5-2"}> <Input size={"small"}
                                                                           status={k5_2 ? "warning" : ""}
                                                                           onChange={(e) => {
                                                                               friForm.setFieldValue("k5-2", e.target.value);
                                                                               setK5_2(e.target.value)
                                                                           }}/> </StyledFormItemComputing>
                        </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Категория по СНиНу"}>
                            <Space.Compact> <StyledFormItemComputing name={"k6-1"}> <Input size={"small"}
                                                                                           status={k6_1 ? "warning" : ""}
                                                                                           onChange={(e) => {
                                                                                               friForm.setFieldValue("k6-1", e.target.value);
                                                                                               setK6_1(e.target.value)
                                                                                           }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"k6-2"}> <Input size={"small"}
                                                                                                      status={k6_2 ? "warning" : ""}
                                                                                                      onChange={(e) => {
                                                                                                          friForm.setFieldValue("k6-2", e.target.value);
                                                                                                          setK6_2(e.target.value)
                                                                                                      }}/>
                            </StyledFormItemComputing> </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Высота уступа"}>
                            <Space.Compact> <StyledFormItemComputing name={"k7-1"}> <Input size={"small"}
                                                                                           status={k7_1 ? "warning" : ""}
                                                                                           onChange={(e) => {
                                                                                               friForm.setFieldValue("k7-1", e.target.value);
                                                                                               setK7_1(e.target.value)
                                                                                           }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"k7-2"}> <Input size={"small"}
                                                                                                      status={k7_2 ? "warning" : ""}
                                                                                                      onChange={(e) => {
                                                                                                          friForm.setFieldValue("k7-2", e.target.value);
                                                                                                          setK7_2(e.target.value)
                                                                                                      }}/>
                            </StyledFormItemComputing> </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Диаметр взрывных скважин"}> <Space.Compact>
                            <StyledFormItemComputing name={"k8-1"}> <Input size={"small"}
                                                                           status={k8_1 ? "warning" : ""}
                                                                           onChange={(e) => {
                                                                               friForm.setFieldValue("k8-1", e.target.value);
                                                                               setK8_1(e.target.value)
                                                                           }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"k8-2"}> <Input size={"small"}
                                                                           status={k8_2 ? "warning" : ""}
                                                                           onChange={(e) => {
                                                                               friForm.setFieldValue("k8-2", e.target.value);
                                                                               setK8_2(e.target.value)
                                                                           }}/> </StyledFormItemComputing>
                        </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Буровой станок :"}>
                            <Space.Compact> <StyledFormItemComputing name={"k9-1"}> <Input size={"small"}
                                                                                           status={k9_1 ? "warning" : ""}
                                                                                           onChange={(e) => {
                                                                                               friForm.setFieldValue("k9-1", e.target.value);
                                                                                               setK9_1(e.target.value)
                                                                                           }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"k9-2"}> <Input size={"small"}
                                                                                                      status={k9_2 ? "warning" : ""}
                                                                                                      onChange={(e) => {
                                                                                                          friForm.setFieldValue("k9-2", e.target.value);
                                                                                                          setK9_2(e.target.value)
                                                                                                      }}/>
                            </StyledFormItemComputing> </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Направление бурения"}>
                            <Space.Compact> <StyledFormItemComputing name={"k10-1"}> <Input size={"small"}
                                                                                            status={k10_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                friForm.setFieldValue("k10-1", e.target.value);
                                                                                                setK10_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"k10-2"}> <Input
                                size={"small"} status={k10_2 ? "warning" : ""} onChange={(e) => {
                                friForm.setFieldValue("k10-2", e.target.value);
                                setK10_2(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Сетка бурения"}>
                            <Space.Compact> <StyledFormItemComputing name={"k11-1"}> <Input size={"small"}
                                                                                            status={k11_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                friForm.setFieldValue("k11-1", e.target.value);
                                                                                                setK11_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"k11-2"}> <Input
                                size={"small"} status={k11_2 ? "warning" : ""} onChange={(e) => {
                                friForm.setFieldValue("k11-2", e.target.value);
                                setK11_2(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Длина скважин"}>
                            <Space.Compact> <StyledFormItemComputing name={"k12-1"}> <Input size={"small"}
                                                                                            status={k12_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                friForm.setFieldValue("k12-1", e.target.value);
                                                                                                setK12_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"k12-2"}> <Input
                                size={"small"} status={k12_2 ? "warning" : ""} onChange={(e) => {
                                friForm.setFieldValue("k12-2", e.target.value);
                                setK12_2(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Количество экскаваторных блоков"}> <Space.Compact>
                            <StyledFormItemComputing name={"k13-1"}> <Input size={"small"}
                                                                            status={k13_1 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k13-1", e.target.value);
                                                                                setK13_1(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"k13-2"}> <Input size={"small"}
                                                                            status={k13_2 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k13-2", e.target.value);
                                                                                setK13_2(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                        </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Объем экскаваторного блока на 1 взрыв "}> <Space.Compact>
                            <StyledFormItemComputing name={"k14-1"}> <Input size={"small"}
                                                                            status={k14_1 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k14-1", e.target.value);
                                                                                setK14_1(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"k14-2"}> <Input size={"small"}
                                                                            status={k14_2 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k14-2", e.target.value);
                                                                                setK14_2(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                        </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={""}> <Space.Compact>
                            <StyledFormItemComputing name={"k15-1"}> <Input size={"small"}
                                                                            status={k15_1 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k15-1", e.target.value);
                                                                                setK15_1(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"k15-2"}> <Input size={"small"}
                                                                            status={k15_2 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k15-2", e.target.value);
                                                                                setK15_2(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                        </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Количество скважин на 1 взрыв в 1 блоке"}> <Space.Compact>
                            <StyledFormItemComputing name={"k16-1"}> <Input size={"small"}
                                                                            status={k16_1 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k16-1", e.target.value);
                                                                                setK16_1(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"k16-2"}> <Input size={"small"}
                                                                            status={k16_2 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k16-2", e.target.value);
                                                                                setK16_2(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                        </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Объем бурения на 1 блок (с учетом 5% потерь)"}>
                            <Space.Compact> <StyledFormItemComputing name={"k17-1"}> <Input size={"small"}
                                                                                            status={k17_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                friForm.setFieldValue("k17-1", e.target.value);
                                                                                                setK17_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"k17-2"}> <Input
                                size={"small"} status={k17_2 ? "warning" : ""} onChange={(e) => {
                                friForm.setFieldValue("k17-2", e.target.value);
                                setK17_2(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Годовой объем бурения "}>
                            <Space.Compact> <StyledFormItemComputing name={"k18-1"}> <Input size={"small"}
                                                                                            status={k18_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                friForm.setFieldValue("k18-1", e.target.value);
                                                                                                setK18_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"k18-2"}> <Input
                                size={"small"} status={k18_2 ? "warning" : ""} onChange={(e) => {
                                friForm.setFieldValue("k18-2", e.target.value);
                                setK18_2(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Количество буровых смен в сутки"}> <Space.Compact>
                            <StyledFormItemComputing name={"k19-1"}> <Input size={"small"}
                                                                            status={k19_1 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k19-1", e.target.value);
                                                                                setK19_1(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"k19-2"}> <Input size={"small"}
                                                                            status={k19_2 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k19-2", e.target.value);
                                                                                setK19_2(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                        </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Сменная производительность бурового станка "}>
                            <Space.Compact> <StyledFormItemComputing name={"k20-1"}> <Input size={"small"}
                                                                                            status={k20_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                friForm.setFieldValue("k20-1", e.target.value);
                                                                                                setK20_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"k20-2"}> <Input
                                size={"small"} status={k20_2 ? "warning" : ""} onChange={(e) => {
                                friForm.setFieldValue("k20-2", e.target.value);
                                setK20_2(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Годовая производительность станка"}> <Space.Compact>
                            <StyledFormItemComputing name={"k21-1"}> <Input size={"small"}
                                                                            status={k21_1 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k21-1", e.target.value);
                                                                                setK21_1(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"k21-2"}> <Input size={"small"}
                                                                            status={k21_2 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k21-2", e.target.value);
                                                                                setK21_2(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                        </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Количество буровых станков - расчетное"}> <Space.Compact>
                            <StyledFormItemComputing name={"k22-1"}> <Input size={"small"}
                                                                            status={k22_1 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k22-1", e.target.value);
                                                                                setK22_1(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"k22-2"}> <Input size={"small"}
                                                                            status={k22_2 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k22-2", e.target.value);
                                                                                setK22_2(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                        </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"- принято"}>
                            <Space.Compact> <StyledFormItemComputing name={"k23-1"}> <Input size={"small"}
                                                                                            status={k23_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                friForm.setFieldValue("k23-1", e.target.value);
                                                                                                setK23_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"k23-2"}> <Input
                                size={"small"} status={k23_2 ? "warning" : ""} onChange={(e) => {
                                friForm.setFieldValue("k23-2", e.target.value);
                                setK23_2(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Взрывание скважин"}>
                            <Space.Compact> <StyledFormItemComputing name={"k24-1"}> <Input size={"small"}
                                                                                            status={k24_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                friForm.setFieldValue("k24-1", e.target.value);
                                                                                                setK24_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"k24-2"}> <Input
                                size={"small"} status={k24_2 ? "warning" : ""} onChange={(e) => {
                                friForm.setFieldValue("k24-2", e.target.value);
                                setK24_2(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Тип ВВ"}> <Space.Compact>
                            <StyledFormItemComputing name={"k25-1"}> <Input size={"small"}
                                                                            status={k25_1 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k25-1", e.target.value);
                                                                                setK25_1(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"k25-2"}> <Input size={"small"}
                                                                            status={k25_2 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k25-2", e.target.value);
                                                                                setK25_2(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                        </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={""}> <Space.Compact>
                            <StyledFormItemComputing name={"k26-1"}> <Input size={"small"}
                                                                            status={k26_1 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k26-1", e.target.value);
                                                                                setK26_1(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"k26-2"}> <Input size={"small"}
                                                                            status={k26_2 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k26-2", e.target.value);
                                                                                setK26_2(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                        </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Тип ВВ боевика"}>
                            <Space.Compact> <StyledFormItemComputing name={"k27-1"}> <Input size={"small"}
                                                                                            status={k27_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                friForm.setFieldValue("k27-1", e.target.value);
                                                                                                setK27_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"k27-2"}> <Input
                                size={"small"} status={k27_2 ? "warning" : ""} onChange={(e) => {
                                friForm.setFieldValue("k27-2", e.target.value);
                                setK27_2(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={""}> <Space.Compact>
                            <StyledFormItemComputing name={"k28-1"}> <Input size={"small"}
                                                                            status={k28_1 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k28-1", e.target.value);
                                                                                setK28_1(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"k28-2"}> <Input size={"small"}
                                                                            status={k28_2 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k28-2", e.target.value);
                                                                                setK28_2(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                        </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={""}> <Space.Compact>
                            <StyledFormItemComputing name={"k29-1"}> <Input size={"small"}
                                                                            status={k29_1 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k29-1", e.target.value);
                                                                                setK29_1(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"k29-2"}> <Input size={"small"}
                                                                            status={k29_2 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k29-2", e.target.value);
                                                                                setK29_2(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                        </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Способ взрывания"}>
                            <Space.Compact> <StyledFormItemComputing name={"k30-1"}> <Input size={"small"}
                                                                                            status={k30_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                friForm.setFieldValue("k30-1", e.target.value);
                                                                                                setK30_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"k30-2"}> <Input
                                size={"small"} status={k30_2 ? "warning" : ""} onChange={(e) => {
                                friForm.setFieldValue("k30-2", e.target.value);
                                setK30_2(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={""}> <Space.Compact>
                            <StyledFormItemComputing name={"k31-1"}> <Input size={"small"}
                                                                            status={k31_1 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k31-1", e.target.value);
                                                                                setK31_1(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"k31-2"}> <Input size={"small"}
                                                                            status={k31_2 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k31-2", e.target.value);
                                                                                setK31_2(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                        </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Способ инициирования "}>
                            <Space.Compact> <StyledFormItemComputing name={"k32-1"}> <Input size={"small"}
                                                                                            status={k32_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                friForm.setFieldValue("k32-1", e.target.value);
                                                                                                setK32_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"k32-2"}> <Input
                                size={"small"} status={k32_2 ? "warning" : ""} onChange={(e) => {
                                friForm.setFieldValue("k32-2", e.target.value);
                                setK32_2(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={""}> <Space.Compact>
                            <StyledFormItemComputing name={"k33-1"}> <Input size={"small"}
                                                                            status={k33_1 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k33-1", e.target.value);
                                                                                setK33_1(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"k33-2"}> <Input size={"small"}
                                                                            status={k33_2 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k33-2", e.target.value);
                                                                                setK33_2(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                        </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Масса заряда 1 скважины"}> <Space.Compact>
                            <StyledFormItemComputing name={"k34-1"}> <Input size={"small"}
                                                                            status={k34_1 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k34-1", e.target.value);
                                                                                setK34_1(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"k34-2"}> <Input size={"small"}
                                                                            status={k34_2 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k34-2", e.target.value);
                                                                                setK34_2(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                        </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Расход ВВ на 1 взрыв в 1 экскаваторном блоке"}>
                            <Space.Compact> <StyledFormItemComputing name={"k35-1"}> <Input size={"small"}
                                                                                            status={k35_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                friForm.setFieldValue("k35-1", e.target.value);
                                                                                                setK35_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"k35-2"}> <Input
                                size={"small"} status={k35_2 ? "warning" : ""} onChange={(e) => {
                                friForm.setFieldValue("k35-2", e.target.value);
                                setK35_2(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Расход СИНВ на 1 взрыв в 1 экскаваторном блоке"}>
                            <Space.Compact> <StyledFormItemComputing name={"k36-1"}> <Input size={"small"}
                                                                                            status={k36_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                friForm.setFieldValue("k36-1", e.target.value);
                                                                                                setK36_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"k36-2"}> <Input
                                size={"small"} status={k36_2 ? "warning" : ""} onChange={(e) => {
                                friForm.setFieldValue("k36-2", e.target.value);
                                setK36_2(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Расход ДША на 1 взрыв в 1 блоке"}> <Space.Compact>
                            <StyledFormItemComputing name={"k37-1"}> <Input size={"small"}
                                                                            status={k37_1 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k37-1", e.target.value);
                                                                                setK37_1(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"k37-2"}> <Input size={"small"}
                                                                            status={k37_2 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k37-2", e.target.value);
                                                                                setK37_2(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                        </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"}
                                                 label={"Расход ЭД на 1 взрыв в 1 блоке"}> <Space.Compact>
                            <StyledFormItemComputing name={"k38-1"}> <Input size={"small"}
                                                                            status={k38_1 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k38-1", e.target.value);
                                                                                setK38_1(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                            <StyledFormItemComputing name={"k38-2"}> <Input size={"small"}
                                                                            status={k38_2 ? "warning" : ""}
                                                                            onChange={(e) => {
                                                                                friForm.setFieldValue("k38-2", e.target.value);
                                                                                setK38_2(e.target.value)
                                                                            }}/> </StyledFormItemComputing>
                        </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Удельный расход ВВ"}>
                            <Space.Compact> <StyledFormItemComputing name={"k39-1"}> <Input size={"small"}
                                                                                            status={k39_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                friForm.setFieldValue("k39-1", e.target.value);
                                                                                                setK39_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"k39-2"}> <Input
                                size={"small"} status={k39_2 ? "warning" : ""} onChange={(e) => {
                                friForm.setFieldValue("k39-2", e.target.value);
                                setK39_2(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"в т.ч. - игданит"}>
                            <Space.Compact> <StyledFormItemComputing name={"k40-1"}> <Input size={"small"}
                                                                                            status={k40_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                friForm.setFieldValue("k40-1", e.target.value);
                                                                                                setK40_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"k40-2"}> <Input
                                size={"small"} status={k40_2 ? "warning" : ""} onChange={(e) => {
                                friForm.setFieldValue("k40-2", e.target.value);
                                setK40_2(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"- аммонит 6ЖВ (боевик)"}>
                            <Space.Compact> <StyledFormItemComputing name={"k41-1"}> <Input size={"small"}
                                                                                            status={k41_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                friForm.setFieldValue("k41-1", e.target.value);
                                                                                                setK41_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"k41-2"}> <Input
                                size={"small"} status={k41_2 ? "warning" : ""} onChange={(e) => {
                                friForm.setFieldValue("k41-2", e.target.value);
                                setK41_2(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Удельный расход ДШЭ"}>
                            <Space.Compact> <StyledFormItemComputing name={"k42-1"}> <Input size={"small"}
                                                                                            status={k42_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                friForm.setFieldValue("k42-1", e.target.value);
                                                                                                setK42_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"k42-2"}> <Input
                                size={"small"} status={k42_2 ? "warning" : ""} onChange={(e) => {
                                friForm.setFieldValue("k42-2", e.target.value);
                                setK42_2(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact> </StyledFormItemComputing>
                        <StyledFormItemComputing className={"two-level-form-item"} label={"Удельный расход СИНВ-С"}>
                            <Space.Compact> <StyledFormItemComputing name={"k43-1"}> <Input size={"small"}
                                                                                            status={k43_1 ? "warning" : ""}
                                                                                            onChange={(e) => {
                                                                                                friForm.setFieldValue("k43-1", e.target.value);
                                                                                                setK43_1(e.target.value)
                                                                                            }}/>
                            </StyledFormItemComputing> <StyledFormItemComputing name={"k43-2"}> <Input
                                size={"small"} status={k43_2 ? "warning" : ""} onChange={(e) => {
                                friForm.setFieldValue("k43-2", e.target.value);
                                setK43_2(e.target.value)
                            }}/> </StyledFormItemComputing> </Space.Compact> </StyledFormItemComputing>


                    </Form>
                </StyledBlockBig>
            </div>
            <div id="part-5">
                <StyledBlockBig label={"Погрузка"}>
                    <Form
                        labelWrap={true}
                        labelAlign={"left"}
                        labelCol={{span: 14}}
                        wrapperCol={{span: 7}}>


                    </Form>
                </StyledBlockBig>
            </div>
            <div id="part-6">
                <StyledBlockBig label={"Транспорт"}>
                    <Form
                        labelWrap={true}
                        labelAlign={"left"}
                        labelCol={{span: 14}}
                        wrapperCol={{span: 7}}>

                    </Form>
                </StyledBlockBig>

            </div>
            <div id="part-7">
                <StyledBlockBig label={"Бульдозер-отвал"}>

                </StyledBlockBig>

            </div>
            <div id="part-8">
                <StyledBlockBig label={"Шир раб площ"}>


                </StyledBlockBig>

            </div>
            <div id="part-9">
                <StyledBlockBig label={"Оборудование"}>


                </StyledBlockBig>

            </div>
            <div id="part-10">
                <StyledBlockBig label={"Расчет БВР"}>

                </StyledBlockBig>

            </div>
            <div id="part-11">
                <StyledBlockBig label={"Расчет топлива"}>

                </StyledBlockBig>

            </div>

        </Col>
        <Col span={8}>
            <Anchor
                items={[{
                    key: 'part-1', href: '#part-1', title: 'Part 1',
                }, {
                    key: 'part-2', href: '#part-2', title: 'Part 2',
                }, {
                    key: 'part-3', href: '#part-3', title: 'Part 3',
                }, {
                    key: 'part-4', href: '#part-4', title: 'Part 4',
                }, {
                    key: 'part-5', href: '#part-5', title: 'Part 5',
                }, {
                    key: 'part-6', href: '#part-6', title: 'Part 6',
                }, {
                    key: 'part-7', href: '#part-7', title: 'Part 7',
                }, {
                    key: 'part-8', href: '#part-8', title: 'Part 8',
                }, {
                    key: 'part-9', href: '#part-9', title: 'Part 9',
                }, {
                    key: 'part-10', href: '#part-10', title: 'Part 10',
                }, {
                    key: 'part-11', href: '#part-11', title: 'Part 11',
                }, {
                    key: 'part-12', href: '#part-12', title: 'Part 12',
                },]}
            />
        </Col>
    </Row>);
};
export default FirstComputingForm;