'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ImageIcon, UploadCloudIcon, TrashIcon, MailIcon } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { useAuth } from '@/app/contexts/auth-context'
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'

const countries = [
  { value: 'india', label: 'India', flag: 'https://cdn.shadcnstudio.com/ss-assets/flags/india.png' },
  { value: 'china', label: 'China', flag: 'https://cdn.shadcnstudio.com/ss-assets/flags/china.png' },
  { value: 'monaco', label: 'Monaco', flag: 'https://cdn.shadcnstudio.com/ss-assets/flags/monaco.png' },
  { value: 'serbia', label: 'Serbia', flag: 'https://cdn.shadcnstudio.com/ss-assets/flags/serbia.png' },
  { value: 'romania', label: 'Romania', flag: 'https://cdn.shadcnstudio.com/ss-assets/flags/romania.png' },
  { value: 'mayotte', label: 'Mayotte', flag: 'https://cdn.shadcnstudio.com/ss-assets/flags/mayotte.png' },
  { value: 'iraq', label: 'Iraq', flag: 'https://cdn.shadcnstudio.com/ss-assets/flags/iraq.png' },
  { value: 'syria', label: 'Syria', flag: 'https://cdn.shadcnstudio.com/ss-assets/flags/syria.png' },
  { value: 'korea', label: 'Korea', flag: 'https://cdn.shadcnstudio.com/ss-assets/flags/korea.png' },
  { value: 'zimbabwe', label: 'Zimbabwe', flag: 'https://cdn.shadcnstudio.com/ss-assets/flags/zimbabwe.png' }
]


export const profileSchema = z.object({
    firstName: z
        .string()
        .min(1, "First name is required"),

    lastName: z
        .string()
        .min(1, "Last name is required"),

    email: z
        .email("Invalid email"),

    roles: z.string(),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
}).superRefine((data, ctx) => {

    const changingPassword =
        data.currentPassword || data.newPassword;

    if (changingPassword) {

        if (!data.currentPassword) {
            ctx.addIssue({
                code: "custom",
                path: ["currentPassword"],
                message: "Current password is required."
            });
        }

        if (!data.newPassword) {
            ctx.addIssue({
                code: "custom",
                path: ["newPassword"],
                message: "New password is required."
            });
        }

    }

});

export type ProfileForm = z.infer<typeof profileSchema>;

async function updateProfile(
    data: ProfileForm,
    image?: File
) {

    const formData =
        new FormData();

    formData.append(
        'firstName',
        data.firstName
    );

    formData.append(
        'lastName',
        data.lastName
    );

    formData.append(
        'email',
        data.email
    );


    if (image) {

        formData.append(
            'profileImage',
            image
        );

    }

    if(data.currentPassword){
    formData.append(
        "currentPassword",
        data.currentPassword
    );
    }

    if(data.newPassword){
        formData.append(
            "newPassword",
            data.newPassword
        );
    }

    const response =
        await fetch(
            '/api/users/profile',
            {
                method: 'PUT',
                body: formData
            }
        );

    const result =
        await response.json();

    if (!response.ok) {

        throw new Error(

            result.message ??

            'Failed to update profile'

        );

    }
    return result;
}


const PersonalInfo = () => {

  const { user, refreshUser } = useAuth();
  

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        roles: "",
        currentPassword:"",
        newPassword:""
    }
});


useEffect(() => {
    if (!user) return;

    form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roles: user.roles.join(", ")
    });
}, [user, form]);

  const inputRef = useRef<HTMLInputElement | null>(null)
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const imageBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {

    if (file) {

        const url = URL.createObjectURL(file);

        setPreview(url);

        return () => URL.revokeObjectURL(url);
    }

    setPreview(
        user?.profileImage
            ? `${imageBaseUrl}/images/${user.profileImage}`
            : null
      );

  }, [file, user]);

  const onSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

      const f = e.target.files?.[0];

      if (!f) return;


      if (!f.type.startsWith("image/")) {

          toast.error(
              "Please upload an image."
          );

          return;
      }


      if (
          f.size >
          1024 * 1024
      ) {

          toast.error(
              "Maximum size is 1MB."
          );

          return;
      }


      setFile(f);

  };

  const openPicker = () => inputRef.current?.click()

  const remove = () => {

      setFile(null);


      setPreview(

          user?.profileImage ??

          null

      );


      if (inputRef.current) {

          inputRef.current.value = "";

      }

  };

  const mutation =
useMutation({

    mutationFn:
        (data: ProfileForm) =>
            updateProfile(
                data,
                file ?? undefined
            ),

    onSuccess: async () => {

        await refreshUser();

        toast.success(
            'Profile updated successfully.'
        );

    },

    onError: (
        error: Error
    ) => {

        toast.error(
            error.message
        );

    }

});

const onSubmit = (

    data: ProfileForm

) => {

    mutation.mutate(

        data

    );

};

  return (
    <div className='grid grid-cols-1 gap-10 lg:grid-cols-3'>
      {/* Vertical Tabs List */}
      <div className='flex flex-col space-y-1'>
        <h3 className='font-semibold'>Personal Information</h3>
        <p className='text-muted-foreground text-sm'>Manage your personal information and role.</p>
      </div>

      {/* Content */}
      <div className='space-y-6 lg:col-span-2'>
        <form className='mx-auto' id="profile-form" onSubmit={
            form.handleSubmit(
                onSubmit
            )
        }>
          <div className='mb-6 w-full space-y-2'>
            <Label>Your Avatar</Label>
            <div className='flex items-center gap-4'>
              <div  
                role='button'
                tabIndex={0}
                aria-label='Upload your avatar'
                onClick={openPicker}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    openPicker()
                  }
                }}
                className='flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed hover:opacity-95'
              >
                {preview ? (

                  <img
                      src={preview}
                      alt="avatar"
                      className="h-full w-full object-cover"
                  />

              ) : (

                  <div
                      className="flex h-full w-full items-center justify-center"
                  >

                      <ImageIcon
                          className="size-6 text-muted-foreground"
                      />

                  </div>

              )}
              </div>

              <div className='flex items-center gap-2'>
                <input ref={inputRef} type='file' accept='image/*' className='hidden' onChange={onSelect} />
                <Button type='button' variant='outline' onClick={openPicker} className='flex items-center gap-2'>
                  <UploadCloudIcon />
                  Upload avatar
                </Button>
                <Button type='button' variant='ghost' onClick={remove} disabled={!file} className='text-destructive!'>
                  <TrashIcon />
                </Button>
              </div>
            </div>
            <p className='text-muted-foreground text-sm'>Pick a photo up to 1MB.</p>
          </div>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            <div className='flex flex-col items-start gap-2'>
              <div className="w-full">
                <Controller
                  control={form.control}
                  name="firstName"
                  render={({ field, fieldState }) => (

                      <div className='flex flex-col items-start gap-2'>

                          <Label htmlFor='multi-step-personal-info-first-name'>
                              First Name
                          </Label>

                          <Input
                              {...field}
                              id='multi-step-personal-info-first-name'
                              placeholder='John'
                              aria-invalid={fieldState.invalid}
                          />

                          {fieldState.error && (
                              <p className='text-sm text-destructive'>
                                  {fieldState.error.message}
                              </p>
                          )}

                      </div>

                  )}
                />
              </div>
            </div>
            <div className='flex flex-col items-start gap-2'>
              <div className="w-full">
                <Controller
                  control={form.control}
                  name="lastName"
                  render={({ field, fieldState }) => (

                      <div className='flex flex-col items-start gap-2'>

                          <Label htmlFor='multi-step-personal-info-last-name'>
                              Last Name
                          </Label>

                          <Input
                              {...field}
                              id='multi-step-personal-info-last-name'
                              placeholder='Doe'
                              aria-invalid={fieldState.invalid}
                          />

                          {fieldState.error && (

                              <p className='text-sm text-destructive'>
                                  {fieldState.error.message}
                              </p>

                          )}

                      </div>

                  )}
                />
              </div>
            </div>
            <div className='flex flex-col items-start gap-2'>
              <div className="w-full">
                <Controller
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (

                      <div className='flex flex-col items-start gap-2'>

                          <Label
                              htmlFor='email'
                              className='gap-1'
                          >

                              Email

                              <span className='text-destructive'>
                                  *
                              </span>

                          </Label>


                          <InputGroup>

                              <InputGroupInput

                                  {...field}

                                  id='email'

                                  type='email'

                                  placeholder='Email address'

                                  aria-invalid={
                                      fieldState.invalid
                                  }

                              />


                              <InputGroupAddon
                                  align='inline-end'
                                  className='pr-1.5'
                              >

                                  <MailIcon className='size-4' />

                              </InputGroupAddon>

                          </InputGroup>


                          {fieldState.error && (

                              <p className='text-sm text-destructive'>
                                  {fieldState.error.message}
                              </p>

                          )}

                      </div>

                  )}
                />
              </div>
            </div>
            

            <div className='space-y-2'>
              <div className="w-full">
                <Controller
                  control={form.control}
                  name="roles"
                  render={({ field }) => (

                      <div className='space-y-2'>

                          <Label htmlFor='role'>
                              Role
                          </Label>


                          <Input

                              {...field}

                              readOnly

                              id='role'

                              className='bg-muted'

                          />


                      </div>

                  )}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <div className="w-full">
                <Controller
                  control={form.control}
                  name="currentPassword"
                  render={({field,fieldState})=>(

                      <div className="space-y-2">

                          <Label>
                              Current Password
                          </Label>

                          <Input

                              {...field}

                              type="password"

                              placeholder="Current password"

                              aria-invalid={
                                  fieldState.invalid
                              }

                          />

                          {fieldState.error && (

                              <p
                                  className="
                                  text-sm
                                  text-destructive
                                  "
                              >
                                  {fieldState.error.message}
                              </p>

                          )}

                      </div>

                  )}
              />
              </div>
            </div>

            <div className='space-y-2'>
              <div className="w-full">
                <Controller
                  control={form.control}
                  name="newPassword"
                  render={({field,fieldState})=>(

                      <div className="space-y-2">

                          <Label>
                              New Password
                          </Label>

                          <Input

                              {...field}

                              type="password"

                              placeholder="Leave empty to keep current password"

                              aria-invalid={
                                  fieldState.invalid
                              }

                          />

                          {fieldState.error && (

                              <p
                                  className="
                                  text-sm
                                  text-destructive
                                  "
                              >
                                  {fieldState.error.message}
                              </p>

                          )}

                      </div>

                  )}
              />
              </div>
            </div>
          </div>
        </form>
        <div className='flex justify-end'>
          <Button
              type='submit'
              form="profile-form"
              disabled={
                  mutation.isPending
              }
              className='max-sm:w-full'
          >

          {
          mutation.isPending
          ?
          "Saving..."
          :
          "Save Changes"
          }

          </Button>
        </div>
      </div>
    </div>
  )
}

export default PersonalInfo 
