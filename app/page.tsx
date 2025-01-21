"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {useRouter} from "next/navigation";


import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
//import { useProjectService } from "@/context/DI";



export default function Home() {
  const router = useRouter();
  //const projectService = useProjectService();
 
  const formSchema = z.object({
    githubUrl: z.string().url(
  "Invalid url",
    ),
    projectType: z.string({
      required_error: "Please select a project type",
    })
  })

  type FormType = z.infer<typeof formSchema>;
  
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      githubUrl: "",
    },
  })
  
  const onSubmit = (values: FormType) => {
    router.push('/scoreboard');
  }

  return (
    <div className="grid justify-items-center sm:my-0 lg:my-[14rem]">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <FormField
          control={form.control}
          name="githubUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-3xl">Github Url</FormLabel>
              <FormDescription className="text-indigo-500">
                This is the link to the project you want to deploy
              </FormDescription>
              <FormControl>
                <Input className="focus:outline-none focus:ring focus:border-blue-500" placeholder="https://github.com/" {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="projectType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-xl">Project Type</FormLabel>
              <Select onValueChange={field.onChange} >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="nodejs">nodejs</SelectItem>
                  <SelectItem value="java">java</SelectItem>
                  <SelectItem value="python">python</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="bg-blue-400 hover:bg-blue-600 my-4" type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  )
}
