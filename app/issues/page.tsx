import { IssueStatusBadge, Link } from "@/app/components";
import NextLink from "next/link";
import prisma from "@/prisma/client";
import { Box, Flex, Table } from "@radix-ui/themes";
import IssueActions from "./IssueActions";
import { Issue, Status } from "@prisma/client";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import Pagination from "../components/Pagination";
import { Metadata } from "next";

interface Props {
  searchParams: {
    status: Status;
    orderBy: keyof Issue;
    page: string;
    sortOrder: "asc" | "desc";
  };
}

const Issues = async ({ searchParams }: Props) => {
  const columns: {
    label: string;
    value: keyof Issue;
    className?: string;
  }[] = [
    { label: "Issue", value: "title" },
    { label: "Status", value: "status", className: "hidden md:table-cell" },
    {
      label: "Created",
      value: "createdAt",
      className: "hidden md:table-cell",
    },
  ];
  const statuses = Object.values(Status);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;

  const orderBy: { [x: string]: "asc" | "desc" } = columns
    .map((column) => column.value)
    .includes(searchParams.orderBy)
    ? { [searchParams.orderBy]: searchParams.sortOrder }
    : { createdAt: "desc" };

  const where = { status };

  const page = parseInt(searchParams.page) || 1;
  const pageSize = 10;

  const issues = await prisma.issue.findMany({
    where,
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const issueCount = await prisma.issue.count({ where });

  return (
    <div>
      <div className="mb-5">
        <IssueActions />
      </div>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            {columns.map((column) => (
              <Table.ColumnHeaderCell
                key={column.value}
                className={column.className}
              >
                <NextLink
                  href={{
                    query: {
                      ...searchParams,
                      orderBy: column.value,
                      sortOrder:
                        searchParams.sortOrder === "asc" ? "desc" : "asc",
                    },
                  }}
                >
                  {column.value === searchParams.orderBy && (
                    <>
                      {orderBy && Object.values(orderBy)?.[0] === "asc" ? (
                        <ArrowUpIcon className="inline" />
                      ) : (
                        <ArrowDownIcon className="inline" />
                      )}
                    </>
                  )}
                  {column.label}
                </NextLink>
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue.id}>
              <Table.Cell>
                <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                <div className="block md:hidden">
                  <IssueStatusBadge status={issue.status} />
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <IssueStatusBadge status={issue.status} />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {issue.createdAt.toDateString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Box mt="4">
        <Pagination
          pageSize={pageSize}
          currentPage={page}
          totalCount={issueCount}
        />
      </Box>
    </div>
  );
};

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Issue List",
  description: "View all project issues",
};

export default Issues;
