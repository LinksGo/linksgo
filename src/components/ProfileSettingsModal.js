'use client'

import { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Switch } from "@nextui-org/react";
import { FaSave, FaImage, FaTrash } from 'react-icons/fa';
import useUserStore from '@/store/userStore';
import Image from 'next/image';
import toast from 'react-hot-toast';

const socialPlatforms = {
  instagram: <i className="fa-brands fa-instagram"></i>,
  twitter: <i className="fa-brands fa-twitter"></i>,
  github: <i className="fa-brands fa-github"></i>,
  linkedin: <i className="fa-brands fa-linkedin"></i>,
}

export default function ProfileSettingsModal({ isOpen, onClose }) {
  const { userData, updateUserData } = useUserStore();
  const [formData, setFormData] = useState({
    displayName: userData?.name || "",
    username: userData?.username || "",
    bio: userData?.bio || "",
    image: userData?.image || "",
    backgroundImage: userData?.backgroundImage || "",
    backgroundBlur: userData?.backgroundBlur ?? true,
    socialLinks: {
      instagram: userData?.socialLinks?.instagram || "",
      twitter: userData?.socialLinks?.twitter || "",
      github: userData?.socialLinks?.github || "",
      linkedin: userData?.socialLinks?.linkedin || ""
    }
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast.error('Profile picture size should be less than 2MB');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        handleInputChange('image', base64String);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to upload profile picture');
    }
  };

  const handleRemoveAvatar = () => {
    handleInputChange('image', '');
  };

  const handleBackgroundUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        handleInputChange('backgroundImage', base64String);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleRemoveBackground = () => {
    handleInputChange('backgroundImage', '');
  };

  const handleSubmit = () => {
    updateUserData({
      name: formData.displayName,
      username: formData.username,
      bio: formData.bio,
      image: formData.image,
      backgroundImage: formData.backgroundImage,
      backgroundBlur: formData.backgroundBlur,
      socialLinks: formData.socialLinks,
      initialized: true
    });
    onClose();
    toast.success('Profile updated successfully');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      size="lg"
      scrollBehavior="inside"
      classNames={{
        base: "max-w-xl",
        backdrop: "bg-black/50 backdrop-blur-sm",
        body: "p-6",
        header: "p-6 border-b border-divider",
        footer: "p-6 border-t border-divider",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-foreground">Profile Settings</h2>
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              {/* Profile Picture Section */}
              <div className="space-y-1.5">
                <label className="text-default-500 dark:text-default-400 font-medium block">
                  Profile Picture
                </label>
                <div className="space-y-2">
                  {formData.image && (
                    <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden">
                      <Image
                        src={formData.image}
                        alt="Profile picture"
                        width={128}
                        height={128}
                        className="object-cover"
                      />
                      <Button
                        isIconOnly
                        color="danger"
                        variant="flat"
                        size="sm"
                        onPress={handleRemoveAvatar}
                        className="absolute top-2 right-2"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <Button
                      color="primary"
                      variant="flat"
                      startContent={<FaImage />}
                      className="w-full"
                      as="label"
                    >
                      {formData.image ? 'Change Profile Picture' : 'Upload Profile Picture'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-default-500 dark:text-default-400 font-medium block">
                  Display Name
                </label>
                <Input
                  placeholder="Your display name"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  size="lg"
                  classNames={{
                    input: "h-12 bg-background dark:bg-content2",
                    innerWrapper: "bg-transparent",
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-default-500 dark:text-default-400 font-medium block">
                  Username
                </label>
                <Input
                  placeholder="your-username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  size="lg"
                  classNames={{
                    input: "h-12 bg-background dark:bg-content2",
                    innerWrapper: "bg-transparent",
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-default-500 dark:text-default-400 font-medium block">
                  Bio
                </label>
                <Textarea
                  placeholder="Tell visitors about yourself"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  size="lg"
                  minRows={2}
                  maxRows={3}
                  classNames={{
                    input: "bg-background dark:bg-content2",
                    innerWrapper: "bg-transparent",
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-default-500 dark:text-default-400 font-medium block">
                  Background Image
                </label>
                <div className="space-y-2">
                  {formData.backgroundImage && (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden">
                      <Image
                        src={formData.backgroundImage}
                        alt="Background preview"
                        fill
                        className="object-cover"
                      />
                      <Button
                        isIconOnly
                        color="danger"
                        variant="flat"
                        size="sm"
                        onPress={handleRemoveBackground}
                        className="absolute top-2 right-2"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <Button
                      color="primary"
                      variant="flat"
                      startContent={<FaImage />}
                      className="w-full"
                      as="label"
                    >
                      {formData.backgroundImage ? 'Change Background' : 'Upload Background'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleBackgroundUpload}
                      />
                    </Button>
                    {formData.backgroundImage && (
                      <Switch
                        isSelected={formData.backgroundBlur}
                        size="sm"
                        color="primary"
                        onValueChange={(isSelected) => handleInputChange('backgroundBlur', isSelected)}
                      >
                        Enable background blur effect
                      </Switch>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-default-500 dark:text-default-400 font-medium block">
                  Social Links
                </label>
                {Object.keys(socialPlatforms).map((platform) => (
                  <Input
                    key={platform}
                    placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                    value={formData.socialLinks[platform]}
                    onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                    size="lg"
                    classNames={{
                      input: "h-12 bg-background dark:bg-content2",
                      innerWrapper: "bg-transparent",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="light"
            onPress={onClose}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            variant="solid"
            onPress={handleSubmit}
            startContent={<FaSave />}
          >
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
