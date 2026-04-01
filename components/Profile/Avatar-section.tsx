"use client";
import React, { useEffect, useState, memo, useCallback } from "react";

interface AvatarSectionProps {
  form: any;
  initialAvatarUrl: string | null;
  savedFullname: string;
}

const AvatarSection = memo(({
  form,
  initialAvatarUrl,
  savedFullname,
}: AvatarSectionProps) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialAvatarUrl ?? null
  );

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    form.setFieldValue("avatarFile", file); 
  }, [form]);

  return (
    <div className="text-center space-y-2">
      {avatarPreview ? (
        <img src={avatarPreview} alt="Avatar"
          className="mx-auto h-24 w-24 rounded-full object-cover"
        />
      ) : (
        <div className="mx-auto h-24 w-24 rounded-full bg-gray-200" />
      )}
      <div>
        <label className="text-sm font-medium">Update avatar</label>
        <input
          type="file"
          accept="image/*"
          className="mt-2 text-xs block mx-auto"
          onChange={handleFileChange}
        />
      </div>
      <p className="text-sm text-slate-500">
        {savedFullname ? `Currently: ${savedFullname}` : "Full name not provided yet."}
      </p>
    </div>
  );
});
AvatarSection.displayName = "AvatarSection";
export default AvatarSection;