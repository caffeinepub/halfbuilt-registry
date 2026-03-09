import { type ReactNode, createContext, useContext, useState } from "react";

interface PostModalContextValue {
  openPostModal: () => void;
  postModalOpen: boolean;
  setPostModalOpen: (open: boolean) => void;
}

const PostModalContext = createContext<PostModalContextValue>({
  openPostModal: () => {},
  postModalOpen: false,
  setPostModalOpen: () => {},
});

export function PostModalProvider({ children }: { children: ReactNode }) {
  const [postModalOpen, setPostModalOpen] = useState(false);

  const openPostModal = () => setPostModalOpen(true);

  return (
    <PostModalContext.Provider
      value={{ openPostModal, postModalOpen, setPostModalOpen }}
    >
      {children}
    </PostModalContext.Provider>
  );
}

export function usePostModal() {
  return useContext(PostModalContext);
}
