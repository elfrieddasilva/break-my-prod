"use client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useProjectService } from "@/context/DI";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { use } from 'react'

const ProjectDetailsPage = ({ params }: { params: Promise<{ projectId: string }> }) => {
    const projectService = useProjectService();
    const { projectId } = use(params);
    const { isPending, error, data } = useQuery({
        queryKey: ["project"],
        queryFn: async () => await projectService.getProjectById(projectId)
    });
    if (isPending) return 'Loading...';
    if (error) return 'an error has occured';
    return (
        <>
            <div className="">
                <h1 className="text-indigo-700 text-xl ">Project n° {projectId}</h1>
                <h3>Url : {data?.url}</h3>
                <h3>Score : {data?.score}</h3>
                <h3>Created by : {data?.user.name}</h3>
            </div>
            <h3 className="text-red-400 text-2xl text-semibold">
                Errors
            </h3>
            <Table className="mt-5 ">
                <TableHeader className="font-bold text-md">
                    <TableRow >
                        <TableHead className="">N°</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead className="">Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="text-md ">
                    {data?.errorLogs.map((error, index) => (
                        <TableRow key={index}>
                            <TableCell className="">{index + 1}</TableCell>
                            <TableCell>{error.description}</TableCell>
                            <TableCell>
                                <span className={`rounded-full p-1 text-sm  text-white 
                                    ${error.severity === 'CRITICAL' ? "bg-red-700" : "bg-orange-700"} 
                                    ${error.severity === 'LOW' && "bg-lime-700"}`}
                                >
                                    {error.severity}
                                </span>
                            </TableCell>
                            <TableCell>{new Date(error.timestamp).toDateString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Link href="/scoreboard" className="text-teal-500 mt-3">Return to scoreboard</Link>
        </>
    )
}

export default ProjectDetailsPage





