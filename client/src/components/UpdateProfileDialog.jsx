import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X } from "lucide-react";

const UpdateProfileDialog = ({
  open,
  onOpenChange,
  profileForm,
  updating,
  imagePreview,
  isDragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleImageChange,
  removeImage,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>
        <Form {...profileForm}>
          <form
            onSubmit={profileForm.handleSubmit(profileForm.onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={profileForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage>
                    {profileForm.formState.errors.name?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={profileForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage>
                    {profileForm.formState.errors.email?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={profileForm.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Profile Image</FormLabel>
                  <FormControl>
                    <div
                      className={`border-2 border-dashed rounded-lg transition-colors h-[200px] flex items-center justify-center ${
                        isDragging
                          ? "border-primary"
                          : "border-muted-foreground"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      {imagePreview ? (
                        <div className="relative h-full w-full">
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 z-10"
                            onClick={removeImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="rounded-lg object-cover w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-4">
                          <Upload className="w-10 h-10 mb-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Drag and drop your image here
                          </p>
                          <p className="text-sm text-muted-foreground mb-4">
                            or
                          </p>
                          <Input
                            id="image"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() =>
                              document.getElementById("image").click()
                            }
                            size="sm"
                          >
                            Choose File
                          </Button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage>
                    {profileForm.formState.errors.image?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={updating}>
              {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Profile
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
