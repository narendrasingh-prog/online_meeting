"use client";
import React, { useState, memo } from "react";
import { UserProfile } from "@/dto/Profiletype";
import { ProfileService } from "@/services/ProfileService";
import { useMutation } from "@tanstack/react-query";
import { useForm, useStore } from "@tanstack/react-form";
import { toast } from "sonner";
import AvatarSection from "./Avatar-section";

interface ProfileProps {
  userData: UserProfile | null;
}


const EmailField = memo(({ email }: { email: string }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600">Email</label>
    <input
      type="email"
      disabled
      value={email}
      readOnly
      className="w-full rounded-md border px-3 py-2 text-sm"
    />
  </div>
));
EmailField.displayName = "EmailField";


const FullnameField = memo(({ form }: { form: any }) => {
  const { value, errors, isTouched } = useStore(form.store, (state: any) => ({
    value:     state.values.fullname          as string,
    errors:    state.fieldMeta?.fullname?.errors   ?? [],
    isTouched: state.fieldMeta?.fullname?.isTouched ?? false,
  }));

  return (
    <div>
      <label className="block text-sm font-medium text-slate-600">
        Full Name
      </label>
      <input
        type="text"
        value={value}
        onBlur={() => form.validateField("fullname", "blur")}
        onChange={(e) => form.setFieldValue("fullname", e.target.value)}
        placeholder="Add your full name"
        className="w-full rounded-md border px-3 py-2 text-sm"
      />
      {isTouched && errors.length > 0 && (
        <p className="mt-1 text-xs text-rose-500">{errors[0]}</p>
      )}
    </div>
  );
});
FullnameField.displayName = "FullnameField";

const SubmitButton = memo(({
  form,
  savedFullname,
  isPending,
}: {
  form: any;
  savedFullname: string;
  isPending: boolean;
}) => {
  const { canSubmit, isSubmitting, fullname, avatarFile } = useStore(
    form.store,
    (state: any) => ({
      canSubmit:    state.canSubmit         as boolean,
      isSubmitting: state.isSubmitting      as boolean,
      fullname:     state.values.fullname   as string,
      avatarFile:   state.values.avatarFile as File | undefined,
    })
  );

  const fullnameChanged = fullname.trim() !== savedFullname.trim();
  const avatarChanged   = avatarFile !== undefined;
  const isDirty         = fullnameChanged || avatarChanged;

  return (
    <div className="space-y-2">
      {isDirty && (
        <div className="text-xs text-slate-500 space-y-1">
          {fullnameChanged && (
            <p>
              Name: <span className="line-through">{savedFullname}</span>
              {" → "}
              {fullname}
            </p>
          )}
          {avatarChanged && <p>Avatar: new image selected</p>}
        </div>
      )}
      <button
        type="submit"
        disabled={!canSubmit || !isDirty || isPending}
        className="w-full rounded-md bg-slate-900 py-2 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending || isSubmitting
          ? "Saving..."
          : !isDirty
          ? "Nothing to save"
          : "Save Changes"}
      </button>
    </div>
  );
});
SubmitButton.displayName = "SubmitButton";

// ✅ Profile — owns form + mutation only
const Profile = ({ userData }: ProfileProps) => {
  const profileService = ProfileService.Client();

  const [savedFullname, setSavedFullname] = useState<string>(
    userData?.fullname ?? ""
  );
  const [savedAvatarUrl, setSavedAvatarUrl] = useState<string | null>(
    userData?.avatar_url ?? null
  );

  const form = useForm({
    defaultValues: {
      fullname:   userData?.fullname ?? "",
      avatarFile: undefined as File | undefined,
    },
    onSubmit: async ({ value }) => {
      const fullnameChanged = value.fullname.trim() !== savedFullname.trim();
      const avatarChanged   = value.avatarFile !== undefined;

      if (!fullnameChanged && !avatarChanged) {
        toast.info("Nothing has changed");
        return;
      }

      updateProfile.mutate({
        fullname:   value.fullname,
        avatarFile: value.avatarFile,
      });
    },
  });

  const updateProfile = useMutation({
    mutationFn: async ({
      fullname,
      avatarFile,
    }: {
      fullname: string;
      avatarFile?: File;
    }) => {
      return await profileService.updateProfile({ fullname, avatarFile });
    },
    onSuccess: (response) => {
      if (response.success) {
        setSavedFullname(response.data.fullname ?? "");
        setSavedAvatarUrl(response.data.avatar_url ?? null);
        form.setFieldValue("avatarFile", undefined);
        form.setFieldValue("fullname", response.data.fullname ?? "");
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    },
    onError: () => toast.error("Failed to update profile"),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="mx-auto max-w-lg space-y-5 rounded-lg border p-6 shadow mt-4"
    >
      <AvatarSection
        form={form}
        initialAvatarUrl={savedAvatarUrl}
        savedFullname={savedFullname}
      />
      <EmailField email={userData?.email ?? ""} />
      <FullnameField form={form} />
      <SubmitButton
        form={form}
        savedFullname={savedFullname}
        isPending={updateProfile.isPending}
      />
    </form>
  );
};

export default Profile;