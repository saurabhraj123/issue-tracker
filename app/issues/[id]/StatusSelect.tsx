"use client";
import { Issue, Status } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const StatusSelect = ({ issue }: { issue: Issue }) => {
  const router = useRouter();

  const statuses: { label: string; value: Status }[] = [
    { label: "Open", value: "OPEN" },
    { label: "In progress", value: "IN_PROGRESS" },
    { label: "Closed", value: "CLOSED" },
  ];

  return (
    <Select.Root
      defaultValue={issue.status || ""}
      onValueChange={async (status) => {
        await axios
          .patch(`/api/issues/${issue.id}`, {
            status: status || null,
          })
          .catch(() => {
            toast.error("Failed to update assignee");
          });
        router.refresh();
      }}
    >
      <Select.Trigger />
      <Select.Content>
        <Select.Group>
          <Select.Label>Status</Select.Label>
          {statuses.map((status) => (
            <Select.Item key={status.value} value={status.value}>
              {status.label}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

export default StatusSelect;
