import React, { useState } from 'react';
import {Button, Drawer, FloatButton} from 'antd';
const App = () => {
    const [openEditTaskDrawer, setOpenEditTaskDrawer] = useState(false);
    const [childrenDrawer, setChildrenDrawer] = useState(false);
    const showEditTasks = () => {
        setOpenEditTaskDrawer(true);
    };
    const onClose = () => {
        setOpenEditTaskDrawer(false);
    };
    const showChildrenDrawer = () => {
        setChildrenDrawer(true);
    };
    const onChildrenDrawerClose = () => {
        setChildrenDrawer(false);
    };
    return (
        <>

            <FloatButton
                shape="circle"
                onClick={showEditTasks}
            />
            <Drawer title="Данные об задаче" width={520} closable={false} onClose={onClose} open={openEditTaskDrawer}>
                <Button type="primary" onClick={showChildrenDrawer}>
                    Two-level drawer
                </Button>
                <Drawer
                    title="Two-level Drawer"
                    width={320}
                    closable={false}
                    onClose={onChildrenDrawerClose}
                    open={childrenDrawer}
                >
                    This is two-level drawer
                </Drawer>
            </Drawer>
        </>
    );
};
export default App;