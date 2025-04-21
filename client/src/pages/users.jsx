import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Users,
  UserPlus,
  Search,
  Lock,
  Mail,
  User,
  AtSign,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { customAxios } from "@/components/config/axios";

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    role: z.enum(["user", "author", "admin"], "Invalid role"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const response = await customAxios.get(`auth/admin/users?page=${page}`);
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await customAxios.patch(`auth/admin/users/role`, {
        userId,
        role: newRole,
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleCreateUser = async (data) => {
    try {
      const response = await customAxios.post("auth/admin/create-user", {
        name: data.name,
        userName: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      fetchUsers();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground mt-1">
              Manage your system users
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add New User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
              </DialogHeader>
              <CreateUserForm onSubmit={handleCreateUser} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <Label htmlFor="search" className="sr-only">
              Search users
            </Label>
            <Input
              id="search"
              placeholder="Search users..."
              className="w-full"
              type="search"
            />
          </div>
          <Button variant="outline">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User List</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2 items-center">
                      <Select
                        value={user.role}
                        onValueChange={(newRole) =>
                          handleRoleChange(user._id, newRole)
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="author">Author</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      {/* <Button variant="outline" size="sm">
                        Edit
                      </Button> */}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUserId(user._id);
                          setIsResetDialogOpen(true);
                        }}
                      >
                        Reset Password
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <p>
            Page {page} of {totalPages}
          </p>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </Button>
        </div>

        <Dialog
          open={isResetDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsResetDialogOpen(false);
              setSelectedUserId(null);
            }
          }}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
            </DialogHeader>
            {selectedUserId && (
              <ResetPasswordForm
                userId={selectedUserId}
                onClose={() => setIsResetDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
};

const CreateUserForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
    },
    mode: "onChange",
  });

  const handleRoleChange = (value) => {
    setValue("role", value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" {...register("name")} placeholder="John Doe" />
        {errors.name && (
          <Alert variant="destructive" className="py-2 text-sm mt-1">
            <AlertDescription>{errors.name.message}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          {...register("username")}
          placeholder="johndoe123"
        />
        {errors.username && (
          <Alert variant="destructive" className="py-2 text-sm mt-1">
            <AlertDescription>{errors.username.message}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          {...register("email")}
          placeholder="you@example.com"
        />
        {errors.email && (
          <Alert variant="destructive" className="py-2 text-sm mt-1">
            <AlertDescription>{errors.email.message}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          placeholder="••••••••"
        />
        {errors.password && (
          <Alert variant="destructive" className="py-2 text-sm mt-1">
            <AlertDescription>{errors.password.message}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          placeholder="••••••••"
        />
        {errors.confirmPassword && (
          <Alert variant="destructive" className="py-2 text-sm mt-1">
            <AlertDescription>
              {errors.confirmPassword.message}
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select onValueChange={handleRoleChange} defaultValue="user">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="author">Author</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.role && (
          <Alert variant="destructive" className="py-2 text-sm mt-1">
            <AlertDescription>{errors.role.message}</AlertDescription>
          </Alert>
        )}
      </div>

      <Button type="submit" className="w-full">
        Create User
      </Button>
    </form>
  );
};

const ResetPasswordForm = ({ userId, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleResetPassword = async (data) => {
    try {
      await customAxios.patch("/auth/admin/reset-password", {
        userId,
        newPassword: data.password,
      });
      alert("Password reset successfully!");
      onClose();
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Failed to reset password. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          placeholder="••••••••"
        />
        {errors.password && (
          <Alert variant="destructive" className="py-2 text-sm mt-1">
            <AlertDescription>{errors.password.message}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          placeholder="••••••••"
        />
        {errors.confirmPassword && (
          <Alert variant="destructive" className="py-2 text-sm mt-1">
            <AlertDescription>
              {errors.confirmPassword.message}
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Button type="submit" className="w-full">
        Reset Password
      </Button>
    </form>
  );
};

export default UsersPage;
