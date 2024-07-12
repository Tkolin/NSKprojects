import { useEffect } from 'react';
import { usePermissions } from './PermissionsProvider';

const usePermissionHider = () => {
    const permissions = usePermissions();

    useEffect(() => {
        console.log("Fdafdafadfda");
        const elements = document.querySelectorAll('[data-permission]');
        elements.forEach((element) => {
            const requiredPermissions = element.getAttribute('data-permission').split(',').map(p => p.trim());
            const hasRequiredPermission = requiredPermissions.some(permission => permissions.includes(permission));
            if (hasRequiredPermission) {
                element.style.display = '';
            } else {
                element.style.display = 'none';
            }
        });
    }, [permissions]);
};

export default usePermissionHider;
