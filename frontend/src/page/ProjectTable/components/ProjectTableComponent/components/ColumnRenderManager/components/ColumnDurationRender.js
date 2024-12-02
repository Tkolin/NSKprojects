import { Space, Typography } from "antd";
import dayjs from "dayjs";

const { Text } = Typography;

const ColumnDurationRender = ({
  record,
  option = { projectDuration: false, projectCurrentStageInfo: true },
}) => {
  const projectDuration =
    record?.date_start && record?.date_end
      ? dayjs(record.date_end).diff(dayjs(record.date_start), "days")
      : null;

  const daysRemaining = record?.date_end
    ? dayjs(record.date_end).diff(dayjs(), "days")
    : null;

  const currentStage = record?.project_stages?.find(
    (row) =>
      dayjs(row.date_start).isBefore(dayjs()) &&
      dayjs(row.date_end).isAfter(dayjs())
  );

  const nextStage = record?.project_stages?.find((row) =>
    dayjs(row.date_start).isAfter(dayjs())
  );

  const daysToNextStage = nextStage
    ? dayjs(nextStage.date_start).diff(dayjs(), "days")
    : null;

  const daysToEndOfCurrentStage = currentStage
    ? dayjs(currentStage.date_end).diff(dayjs(), "days")
    : null;

  const currentStageDuration = currentStage
    ? dayjs(currentStage.date_end).diff(dayjs(currentStage.date_start), "days")
    : null;

  return (
    <Space direction="vertical">
      {option?.projectDuration && (
        <Text>
          {record?.date_start
            ? dayjs(record.date_start).format("DD.MM.YYYY") + "г."
            : "—"}{" "}
          -{" "}
          {record?.date_start
            ? dayjs(record.date_start)
                .add(record.duration, "day")
                .format("DD.MM.YYYY") + "г."
            : "—"}
          {projectDuration !== null && `(${projectDuration} дней)`}{" "}
          {daysRemaining !== null && `(осталось ${daysRemaining} дней)`}
        </Text>
      )}
      {option?.projectCurrentStageInfo && (
        <Text style={{ whiteSpace: "pre-wrap" }}>
          {currentStage
            ? `№${currentStage.number} ${currentStage.stage.name}\n(${
                dayjs(currentStage.date_start).format("DD.MM.YYYY") + "г."
              } - ${dayjs(currentStage.date_end).format("DD.MM.YYYY") + "г."})`
            : "—"}
          {"\n"}
          {currentStageDuration !== null &&
            `Продолжительность: ${currentStageDuration} дней (прошло ${daysToEndOfCurrentStage}/ осталось ${
              currentStageDuration - daysToEndOfCurrentStage
            })`}
        </Text>
      )}
    </Space>
  );
};

export default ColumnDurationRender;
