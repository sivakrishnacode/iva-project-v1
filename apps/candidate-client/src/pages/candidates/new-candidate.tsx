"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@radix-ui/react-separator";
import { API_URL } from "@/lib/config";
import { useEffect, useState } from "react";
import { UploadCloud } from "lucide-react";

const accountFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." })
    .max(30, { message: "First name must not be longer than 30 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." })
    .max(30, { message: "Last name must not be longer than 30 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Invalid phone number." }),
  address: z.string().min(5, { message: "Address is too short." }),
  dob: z.string().min(10, { message: "Invalid date format (YYYY-MM-DD)." }),
  jobRole: z.string().min(3, { message: "Job role is required." }), // Add jobRole
  experience: z.coerce
    .number()
    .min(0, { message: "Experience must be a positive number." }),
  resume: z.any().optional(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

const defaultValues: Partial<AccountFormValues> = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  dob: "2000-01-01",
  jobRole: "", // Ensure jobRole is initialized,
  experience: 0, // Default value for experience
  resume: null,
};

export function NewCandidateForm() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  useEffect(() => {
    async function fetchCandidateData() {
      try {
        const response = await fetch(
          `${API_URL}candidates/?email=${localStorage.getItem("candidateEmail")}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch candidate data");
        }

        const data = await response.json();

        let candidate = data[0];

        // Update the form fields with fetched data
        form.reset({
          firstName: candidate.firstName,
          lastName: candidate.lastName,
          email: candidate.email,
          phone: candidate.phone,
          address: candidate.address,
          dob: candidate.dob,
          jobRole: candidate.jobRole,
          experience: candidate.experience,
          resume: candidate.resume ? candidate.resume : null,
        });

        // Handle resume file separately
        if (candidate.resume) {
          setResumeFile(new File([], candidate.resume)); // Simulating file state
        }
      } catch (error) {
        console.error("Error fetching candidate data:", error);
      }
    }

    fetchCandidateData();
  }, []);

  async function onSubmit(data: AccountFormValues) {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("address", data.address);
    formData.append("dob", data.dob);
    formData.append("jobRole", data.jobRole);
    formData.append("experience", data.experience.toString());

    if (resumeFile) {
      formData.append("resume", resumeFile);
    }

    try {
      const response = await fetch(`${API_URL}candidates/create`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create candidate");
      }

      const result = await response.json();

      alert(JSON.stringify(result));

      toast({
        title: "Candidate Created",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(result, null, 2)}
            </code>
          </pre>
        ),
      });

      // Optionally reset form
      form.reset();
      setResumeFile(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not create candidate. Please try again.",
      });
    }
  }

  return (
    <div className="flex-1 lg:max-w-2xl">
      <div className="space-y-6 p-12">
        <div>
          <h3 className="text-lg font-medium">Profile</h3>
          <p className="text-sm text-muted-foreground">
            This is how others will see you on the site.
          </p>
        </div>
        <Separator />
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the name that will be displayed on your profile and
                    in emails.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the name that will be displayed on your profile and
                    in emails.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="YYYY-MM-DD" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Role</FormLabel>
                  <FormControl>
                    <Input placeholder="Job Role" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience (Years)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter years of experience"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))} // Ensure it's a number
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resume"
              render={() => (
                <FormItem>
                  <FormLabel>Resume</FormLabel>
                  <FormControl>
                    <label className="border p-3 flex items-center gap-2 cursor-pointer">
                      <UploadCloud className="w-5 h-5" />
                      <span>
                        {resumeFile ? resumeFile.name : "Upload Resume (PDF)"}
                      </span>
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) =>
                          setResumeFile(e.target.files?.[0] || null)
                        }
                      />
                    </label>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit Profile</Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
