"use client";
import React from "react";
import { UserProfile } from "@/dto/Profile";
import { ProfileService } from "@/services/ProfileService";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import Image from "next/image";
interface ProfileProps {
  userData: UserProfile | null;
}

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=User&background=random";

const Profile = ({ userData }: ProfileProps) => {
  const profileService = ProfileService.Client();

 console.log(userData)
  const initialFullnameRef = React.useRef(userData?.fullname ?? "");

  const [avatarUrl, setAvatarUrl] = React.useState(
    userData?.avatar_url ?? null,
  );

  React.useEffect(() => {
    initialFullnameRef.current = userData?.fullname ?? "";
    setAvatarUrl(userData?.avatar_url ?? null);
  }, [userData?.avatar_url, userData?.fullname]);

  const form = useForm({
    defaultValues: {
      fullname: userData?.fullname ?? "",
      avatarFile: undefined as File | undefined,
    },

    onSubmit: async ({ value }) => {
      const payload: {
        fullname?: string;
        avatarFile?: File;
      } = {};

      const fullnameChanged =
        value.fullname.trim() !== initialFullnameRef.current.trim();

      const avatarChanged = value.avatarFile !== undefined;

      if (!fullnameChanged && !avatarChanged) {
        toast.info("Nothing changed");
        return;
      }

      if (fullnameChanged) {
        payload.fullname = value.fullname;
      }

      if (avatarChanged) {
        payload.avatarFile = value.avatarFile;
      }

      updateProfile.mutate(payload);
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (data: { fullname?: string; avatarFile?: File }) => {
      return await profileService.updateProfile(data);
    },

    onSuccess: (res) => {
      if (res.success) {
        const newName = res.data.fullname ?? "";
        console.log(newName)
        

        initialFullnameRef.current = newName;
       

        toast.success("Profile updated");
      } else {
        toast.error("Update failed");
      }
    },

    onError: () => toast.error("Update failed"),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="mx-auto max-w-lg space-y-5 rounded-lg border p-6 shadow mt-4"
    >
      <form.Subscribe selector={(state) => state.values.avatarFile}>
        {(avatarFile) => {
          if (avatarFile) {
            const previewUrl = URL.createObjectURL(avatarFile);

            return (
              <img
                src={previewUrl}
                className="h-24 w-24 rounded-full object-cover mx-auto"
                onLoad={() => URL.revokeObjectURL(previewUrl)}
              />
            );
          }

          if (avatarUrl) {
            return (
              <Image
                src={avatarUrl}
                height={96}
                width={96}
                alt="Avatar"
                className="h-24 w-24 rounded-full object-cover mx-auto"
              />
            );
          }

          return (
            <Image
              src={DEFAULT_AVATAR}
              height={96}
              width={96}
              alt="Default"
              className="h-24 w-24 rounded-full object-cover mx-auto"
            />
          );
        }}
      </form.Subscribe>

      <form.Field name="avatarFile">
        {(field) => (
          <div>
            <label className="block text-sm font-medium text-slate-600">
              Avatar
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => field.handleChange(e.target.files?.[0])}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="fullname">
        {(field) => (
          <div>
            <label className="block text-sm font-medium text-slate-600">
              Full Name
            </label>

            <input
              type="text"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />

            {field.state.meta.errors?.length > 0 && (
              <p className="text-xs text-red-500">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <div>
        <label className="block text-sm font-medium text-slate-600">
          Email
        </label>
        <input
          type="email"
          value={userData?.email ?? ""}
          disabled
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <form.Subscribe selector={(state) => state.values}>
        {(values) => {
          const fullnameChanged =
            values.fullname.trim() !== initialFullnameRef.current.trim();

          const avatarChanged = values.avatarFile !== undefined;

          const isDirty = fullnameChanged || avatarChanged;

          return (
            <button
              type="submit"
              disabled={!isDirty || updateProfile.isPending}
              className="w-full rounded-md bg-slate-900 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {updateProfile.isPending
                ? "Saving..."
                : isDirty
                  ? "Save Changes"
                  : "Nothing to save"}
            </button>
          );
        }}
      </form.Subscribe>
    </form>
  );
};

export default Profile;
