import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { blogByUserId, updatePass, updateUser } from "@/components/api/user";
import ProfileCard from "@/components/ProfileCard";
import UpdateProfileDialog from "@/components/UpdateProfileDialog";
import UpdatePasswordDialog from "@/components/UpdatePasswordDialog";
import UserBlogs from "@/components/UserBlogs";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import { customAxios } from "@/components/config/axios";

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API;

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

const useProfileForm = (user) => {
  const [imagePreview, setImagePreview] = useState(user?.profileImage);
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      image: null,
    },
  });

  const handleImageChange = (file) => {
    if (file) {
      form.setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDragDrop = {
    onDragOver: (e) => {
      e.preventDefault();
      setIsDragging(true);
    },
    onDragLeave: () => setIsDragging(false),
    onDrop: (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file?.type.startsWith("image/")) {
        handleImageChange(file);
      }
    },
  };

  const removeImage = () => {
    form.setValue("image", null);
    setImagePreview(null);
  };

  return {
    form,
    imagePreview,
    isDragging,
    handleImageChange,
    handleDragDrop,
    removeImage,
  };
};

const ProfilePage = () => {
  const { id: pId } = useParams();
  const { user, token } = useAuthStore();
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateProfile, setUpdateProfile] = useState(false);
  const [updatePassword, setUpdatePassword] = useState(false);

  const [profileUser, setProfileUser] = useState(null);
  const [loadingProfileUser, setLoadingProfileUser] = useState(!!pId);

  const displayUser = pId ? profileUser : user;

  const {
    form: profileForm,
    imagePreview,
    isDragging,
    handleImageChange,
    handleDragDrop,
    removeImage,
  } = useProfileForm(displayUser || {});

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const fetchProfileUser = async () => {
      if (pId) {
        setLoadingProfileUser(true);
        try {
          const res = await customAxios.get(`auth/user/${pId}`);
          setProfileUser(res.data.user);
        } catch (err) {
          setProfileUser(null);
        } finally {
          setLoadingProfileUser(false);
        }
      }
    };
    fetchProfileUser();
  }, [pId]);

  useEffect(() => {
    if ((user && token) || pId) {
      fetchUserBlogs();
    }
  }, [user, token, pId]);

  useEffect(() => {
    if (displayUser) {
      profileForm.reset({
        name: displayUser.name || "",
        email: displayUser.email || "",
        image: null,
      });
    }
  }, [displayUser]);

  const fetchUserBlogs = async () => {
    try {
      const userId = pId || user?.id || user?._id;
      const response = await blogByUserId(userId);
      setBlogs(response.data.blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoadingBlogs(false);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    return data.data.url;
  };

  const onSubmitProfile = async (data) => {
    setUpdating(true);
    try {
      let imageUrl = user.profileImage;
      if (data.image) {
        imageUrl = await uploadImage(data.image);
      }

      const response = await updateUser({
        name: data.name,
        email: data.email,
        profileImage: imageUrl,
      });

      if (response.status === 201) {
        setUpdateProfile(false);
        profileForm.reset();
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
    <div className="max-w-[1460px] mx-auto px-4 py-8 space-y-12">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-center">
          Profile Information
        </h2>
        <ProfileCard
          user={displayUser}
          loading={loadingProfileUser}
          onUpdateProfile={() => setUpdateProfile(true)}
          onUpdatePassword={() => setUpdatePassword(true)}
          pId={pId}
        />
      </div>

      <UpdateProfileDialog
        open={updateProfile}
        onOpenChange={setUpdateProfile}
        profileForm={{
          ...profileForm,
          onSubmit: profileForm.handleSubmit(onSubmitProfile),
        }}
        updating={updating}
        imagePreview={imagePreview}
        isDragging={isDragging}
        handleDragDrop={handleDragDrop}
        handleImageChange={(e) => handleImageChange(e.target.files?.[0])}
        removeImage={removeImage}
      />

      <UpdatePasswordDialog
        open={updatePassword}
        onOpenChange={setUpdatePassword}
        passwordForm={{
          ...passwordForm,
          onSubmit: passwordForm.handleSubmit(onSubmitPassword),
        }}
        updating={updating}
      />

      <div>
        <h2 className="text-2xl font-bold mb-4">
          {pId ? "User's Blogs" : "Your Blogs"}
        </h2>
        <UserBlogs blogs={blogs} loadingBlogs={loadingBlogs} pId={pId} />
      </div>
    </div>
  );
};

export default ProfilePage;
