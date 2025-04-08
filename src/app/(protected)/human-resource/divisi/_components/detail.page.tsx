/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import DivisionService from "@/services/divisi/divisi.service";
import { TDivision } from "@/services/divisi/divisi.type";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "antd";
import { useParams } from "next/navigation";
import { Tree, TreeNode } from "react-organizational-chart";

function getDeepestMainId(data: TDivision) {
  if (data?.main) {
    return getDeepestMainId(data.main);
  }
  return data?.id;
}

function DetailDivisi() {
  const { divId } = useParams();

  const { data: division, isLoading } = useQuery({
    queryKey: ["DIVISION", divId],
    queryFn: async () => {
      const response = await DivisionService.getOne(+divId, {
        with: "sub.sub.sub,main.main.main",
      });
      return response;
    },
  });

  const { data: divisionParent, isLoading: loadingParent } = useQuery({
    queryKey: [
      "DIVISION_PARENT",
      getDeepestMainId(division?.data as TDivision),
    ],
    enabled: !!division?.data.main,
    queryFn: async () => {
      const response = await DivisionService.getOne(
        +(getDeepestMainId(division?.data as TDivision) as any),
        {
          with: "sub.sub.sub",
        }
      );
      return response;
    },
  });

  const renderTreeNodes = (node: TDivision) =>
    node.sub?.map((child) => (
      <TreeNode key={child.id} label={<BoxNode name={child.name} />}>
        {renderTreeNodes(child)}
      </TreeNode>
    ));

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <AppBreadcrumbs
          items={[
            {
              title: "Home",
              url: "/",
            },
            {
              title: "Divisi",
              url: "/human-resource/divisi",
            },
            {
              title: division?.data.name || "",
              url: "#",
            },
          ]}
        />
      </div>
      <div className="bg-white p-4 rounded-lg space-y-4">
        <div className="border-b pb-3">
          <p className="text-xl font-medium">{division?.data.name || ""}</p>
        </div>

        {isLoading || loadingParent ? (
          <div className="flex justify-center py-10">
            <Skeleton />
          </div>
        ) : (
          <Tree
            label={
              <BoxNode
                name={
                  division?.data?.main
                    ? (divisionParent?.data.name as string)
                    : (division?.data.name as string)
                }
              />
            }
          >
            {renderTreeNodes(
              division?.data.main
                ? (divisionParent?.data as TDivision)
                : (division?.data as TDivision)
            )}
          </Tree>
        )}
      </div>
    </div>
  );
}

function BoxNode({ name }: { name: string }) {
  return (
    <span className="w-fit mx-auto text-white block p-3 bg-[#0080DCCF] rounded border-gray-500">
      {name}
    </span>
  );
}

export default DetailDivisi;
