"use client";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useProjectService } from "@/context/DI";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";



export default function ScoreboardPage() {
    const projectService = useProjectService();
    const { isPending, error, data } = useQuery({
        queryKey: ["projectData"],
        queryFn: async () => await projectService.getProjects()
    });
    const router = useRouter();

    if (isPending) return 'Loading...';
    if (error) return 'an error has occured';

    return (
        <>
            <h1 className="text-indigo-700 text-4xl ms-3">Scoreboard</h1>
            <Table className="mt-5 ">
                <TableCaption>Scoreboard</TableCaption>
                <TableHeader className="font-bold text-3xl">
                    <TableRow >
                        <TableHead className="">N°</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="">Score</TableHead>
                        <TableHead className="">User</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="text-xl ">
                    {data?.map((project, index) => (
                        <TableRow key={index}>
                            <TableCell className="">{index + 1}</TableCell>
                            <TableCell>{project.url}</TableCell>
                            <TableCell>{project.type}</TableCell>
                            <TableCell>{project.score}</TableCell>
                            <TableCell>{project.user.name}</TableCell>
                            <TableCell>
                                <Button className="bg-teal-400 hover:bg-teal-600 rounded-full text-sm" onClick={() => {
                                    router.push(`${project.id}/details`)
                                }}>
                                    More Details
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}

