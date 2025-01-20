import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


export default function ScoreboardPage() {
    return (
        <>
            <Table>
                <TableCaption>Scoreboard</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Rank</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead className="text-right">Project</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">INV001</TableCell>
                        <TableCell>Paid</TableCell>
                        <TableCell>Credit Card</TableCell>
                        <TableCell className="text-right">$250.00</TableCell>
                    </TableRow>
                </TableBody>
            </Table>

        </>
    )
}
