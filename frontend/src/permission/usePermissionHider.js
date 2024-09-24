import { useEffect } from 'react';
import { usePermissions } from './PermissionsProvider';

const usePermissionHider = () => {
    const hock = usePermissions();
 
    const permissions = JSON.parse(localStorage.getItem("userPermissions")).map(row=>row.name_key);
    // console.log(": = : permissions", permissions);

    useEffect(() => {
      //  console.log(": = :useEffect");
        const elements = document.querySelectorAll('[data-permission]');
       // console.log(": = :elements", elements);

        elements.forEach((element) => {
           // console.log(": = :element", element);

            const requiredPermissions = element.getAttribute('data-permission').split(',').map(p => p.trim());
           // console.log(": = :requiredPermissions", requiredPermissions);

            const hasRequiredPermission = requiredPermissions.some(permission => permissions.includes(permission));
           // console.log(": = :hasRequiredPermission", hasRequiredPermission);
            if (hasRequiredPermission) {
                element.style.display = '';

            } else {
                element.style.display = 'none';
            }
        });
    }, [hock]);
};

export default usePermissionHider;
