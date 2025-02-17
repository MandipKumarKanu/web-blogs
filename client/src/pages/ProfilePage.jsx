import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
// import ProfileCard from "./ProfileCard";
// import UpdateProfileDialog from "./UpdateProfileDialog";
// import UpdatePasswordDialog from "./UpdatePasswordDialog";
// import UserBlogs from "./UserBlogs";
import { blogByUserId, updatePass, updateUser } from "@/components/api/user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ProfileCard from "@/components/ProfileCard";
import UpdateProfileDialog from "@/components/UpdateProfileDialog";
import UpdatePasswordDialog from "@/components/UpdatePasswordDialog";
import UserBlogs from "@/components/UserBlogs";

// Schemas
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  image: z.any().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const ProfilePage = () => {
  const { user, logout, token } = useAuthStore();
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateProfile, setUpdateProfile] = useState(false);
  const [updatePassword, setUpdatePassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      image: null,
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user && token) fetchUserBlogs();
  }, [user]);

  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name || "",
        email: user.email || "",
        image: null,
      });
      setImagePreview(user?.profileImage);
    }
  }, [user]);

  const fetchUserBlogs = async () => {
    try {
      const response = await blogByUserId(user?.id || user?._id);
      const data = response.data.blogs;
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoadingBlogs(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      profileForm.setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      profileForm.setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    profileForm.setValue("image", null);
    setImagePreview(null);
  };

  const onSubmitProfile = async (data) => {
    setUpdating(true);
    try {
      let imageUrl = user.profileImage;
      if (data.image) {
        const formData = new FormData();
        formData.append("image", data.image);
        const imgbbRes = await fetch(
          `https://api.imgbb.com/1/upload?key=39155f715e13e66488803fb4160d90d0`,
          {
            method: "POST",
            body: formData,
          }
        );
        const imgbbData = await imgbbRes.json();
        imageUrl = imgbbData.data.url;
      }
      const response = await updateUser({
        name: data.name,
        email: data.email,
        profileImage: imageUrl,
      });
      if (response.status === 201) {
        setUpdateProfile(false);
        profileForm.reset();
        setImagePreview(null);
        useAuthStore.setState({ user: response.data });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setUpdating(false);
    }
  };

  const onSubmitPassword = async (data) => {
    setUpdating(true);
    try {
      const response = await updatePass({
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      if (response.status === 201) {
        setUpdatePassword(false);
        passwordForm.reset();
      }
    } catch (error) {
      console.error("Error updating password:", error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-12">
      <ProfileCard
        user={user}
        onUpdateProfile={() => setUpdateProfile(true)}
        onUpdatePassword={() => setUpdatePassword(true)}
      />

      <UpdateProfileDialog
        open={updateProfile}
        onOpenChange={setUpdateProfile}
        profileForm={{ ...profileForm, onSubmit: onSubmitProfile }}
        updating={updating}
        imagePreview={imagePreview}
        isDragging={isDragging}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        handleDrop={handleDrop}
        handleImageChange={handleImageChange}
        removeImage={removeImage}
      />

      <UpdatePasswordDialog
        open={updatePassword}
        onOpenChange={setUpdatePassword}
        passwordForm={passwordForm}
        updating={updating}
        onSubmitPassword={onSubmitPassword}
      />

      <UserBlogs blogs={blogs} loadingBlogs={loadingBlogs} />
    </div>
  );
};

export default ProfilePage;
