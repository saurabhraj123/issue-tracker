import prisma from "@/prisma/client";
import React from "react";

interface Props {
  params: { id: string };
}

const IssuePage = async ({ params }: Props) => {
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });

  return (
    <div>
      <div>Issue Page</div>
      <div>{issue?.title}</div>
      <div>{issue?.description}</div>
      <div>{issue?.createdAt.toDateString()}</div>
    </div>
  );
};

export default IssuePage;
