import { useEffect } from "react";
import { usePermissions } from "./PermissionsProvider";

const usePermissionHider = () => {
  const hock = usePermissions();
  // Берём список ключей (name_key)
  const permissions = localStorage.getItem("userPermissions")
    ? JSON.parse(localStorage.getItem("userPermissions")).map(
        (row) => row.name_key
      )
    : [];

  useEffect(() => {
    const devMode = localStorage.getItem("developer_mode") === "true";
    const elements = document.querySelectorAll("[data-permission]");

    elements.forEach((element) => {
      const requiredPermissions = element
        .getAttribute("data-permission")
        .split(",")
        .map((p) => p.trim());

      const hasRequiredPermission = requiredPermissions.some((perm) =>
        permissions.includes(perm)
      );

      if (hasRequiredPermission) {
        element.style.display = ""; // показать элемент

        // Если devMode включён
        if (devMode) {
          // Если уже обёрнут (например, при повторном срабатывании эффекта) — пропускаем
          if (element.parentElement?.dataset?.devwrapper === "true") {
            return;
          }

          // Создаём обёртку с position: relative
          const wrapper = document.createElement("div");
          wrapper.style.position = "relative";
          // Чтобы не оборачивать повторно, метим обёртку
          wrapper.dataset.devwrapper = "true";

          // Создаём оверлей с position: absolute
          const overlay = document.createElement("div");
          overlay.style.position = "absolute";
          overlay.style.top = "0";
          overlay.style.right = "0";
          overlay.style.padding = "2px 4px";
          overlay.style.fontSize = "10px";
          overlay.style.backgroundColor = "rgba(0,0,0,0.6)";
          overlay.style.color = "#fff";
          overlay.textContent = requiredPermissions.join(", ");

          // Заменяем исходный элемент на wrapper
          // и внутрь wrapper помещаем исходный элемент + overlay
          element.replaceWith(wrapper);
          wrapper.appendChild(element);
          wrapper.appendChild(overlay);
        }
      } else {
        // Нет нужных прав - скрываем элемент
        element.style.display = "none";
      }
    });
  }, [hock, permissions]);

  // Хук не возвращает JSX
};

export default usePermissionHider;
