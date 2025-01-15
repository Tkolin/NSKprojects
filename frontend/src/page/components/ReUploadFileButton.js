import { FileSyncOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";

const ReUploadFileButton = ({ ...props }) => {
  return (
    <Tooltip title="Заменить прикреплённый файл">
      <Button danger {...props}>
        <FileSyncOutlined />
      </Button>
    </Tooltip>
  );
};
export default ReUploadFileButton;
