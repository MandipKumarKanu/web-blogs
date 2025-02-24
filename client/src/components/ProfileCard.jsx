import React from "react";
import { MoreVertical, Pencil, Key } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ProfileCard = ({ user, onUpdateProfile, onUpdatePassword }) => {
  return (
    <Card className="mb-8 mx-auto max-w-4xl">
      <CardContent className="pt-6 relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 sm:gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 w-full">
            <Avatar className="h-24 w-24 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
              <AvatarImage
                src={user?.profileImage}
                alt={user?.name}
                className="object-cover"
              />
              <AvatarFallback className="text-2xl">
                {user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-muted-foreground">@{user?.userName}</p>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:relative sm:top-0 sm:right-0 absolute top-2 right-2"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem onClick={onUpdateProfile}>
                <Pencil className="mr-2 h-4 w-4" />
                Update Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onUpdatePassword}>
                <Key className="mr-2 h-4 w-4" />
                Change Password
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
