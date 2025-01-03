import { createWithEqualityFn } from "zustand/traditional";

interface LiostoreState {
  imageUri: string;
  imageBlob: Blob | null;
  imageBlobArray: Blob[];
  bears: number;
  imageUriArray: string[];
  imageUrlArray: string[];
  projectId: string;
  portfolioInformation: {
    name: string;
    nickname: string;
    description: string;
    technologyStack: string;
    url: string;
    category: string;
    status: string;
    challenges: string;
    overcome: string;
  };
  albumName: string;
  imageUrl: string;
  profileBlobArray: {
    dp: string;
    coverImage: string;
  };
  userInformationArray: {
    displayName: string;
    bio: string;
    technologyStack: string;
    email: string;
    phone: string;
    username: string;
  };
  links: {
    twitter: string;
    github: string;
    facebook: string;
    instagram: string;
    others: string;
    linkedin: string;
  };
  setProfileBlobArray: (image: any) => void;
  setUserInformationArray: (info: any) => void;
  setLinks: (links: any) => void;
}

const Liostore = createWithEqualityFn<LiostoreState>(
  (set) => ({
    imageBlob: null,
    imageUri: "",
    imageUrl: "",
    imageBlobArray: [],
    imageUriArray: [],
    imageUrlArray: [],
    projectId: "",
    bears: 0,
    portfolioInformation: {
      name: "",
      nickname: "",
      description: "",
      technologyStack: "",
      url: "",
      category: "",
      status: "",
      challenges: "",
      overcome: "",
    },
    albumName: "",
    profileBlobArray: {
      dp: "",
      coverImage: "",
    },
    userInformationArray: {
      displayName: "",
      bio: "",
      technologyStack: "",
      email: "",
      phone: "",
      username: "",
    },
    links: {
      twitter: "",
      github: "",
      facebook: "",
      instagram: "",
      others: "",
      linkedin: "",
    },
    setImageUri: (uri: string) => set({ imageUri: uri }),
    setImageUrl: (uri: string) => set({ imageUrl: uri }),
    setImageBlob: (blob: Blob | null) => set({ imageBlob: blob }),
    setAlbumName: (album: string) => set({ albumName: album }),
    setImageBlobArray: (newBlobArray: Blob[]) => {
      set((state) => ({
        imageBlobArray: state.imageBlobArray.concat(newBlobArray),
      }));
    },
    setImageUriArray: (newUriArray: string[]) => {
      set((state) => ({
        imageUriArray: state.imageUriArray.concat(newUriArray),
      }));
    },
    setImageUrlArray: (newUriArray: string[]) => {
      set((state) => ({
        imageUrlArray: state.imageUrlArray.concat(newUriArray),
      }));
    },
    setPortfolioInformation: (info: any) => {
      set((state) => ({
        portfolioInformation: {
          ...state.portfolioInformation,
          ...info,
        },
      }));
    },
    setUserInformationArray: (info: any) => {
      set((state) => ({
        userInformationArray: {
          ...state.userInformationArray,
          ...info,
        },
      }));
    },
    setLinks: (links: any) => {
      set((state) => ({
        links: {
          ...state.links,
          ...links,
        },
      }));
    },
    setProfileBlobArray: (image) => {
      set((state: any) => ({
        profileBlobArray: {
          dp: image.dp || state.profileBlobArray.dp,
          coverImage: image.coverImage || state.profileBlobArray.coverImage,
        },
      }));
    },
    clearPortfolio: () =>
      set({
        portfolioInformation: {
          name: "",
          nickname: "",
          description: "",
          technologyStack: "",
          url: "",
          category: "",

          status: "",

          challenges: "",
          overcome: "",
        },
        albumName: "",
        imageUri: "",
        imageBlob: null,
        imageBlobArray: [],
        imageUriArray: [],
        imageUrlArray: [],
      }),
    setProjectId: (state: string) => set({ projectId: state }),
    removeAllBears: () => set({ bears: 0 }),
  }),
  Object.is
);

export { Liostore };
