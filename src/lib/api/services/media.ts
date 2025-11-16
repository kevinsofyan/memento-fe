import { apiClient } from "../client";

interface IMediaUploadResponse {
  media_file: {
    id: string;
    entry_id: string;
    file_url: string;
    file_type: string;
    created_at: string;
  };
  message: string;
}

export const mediaService = {
  upload: async (file: File, entryId?: string): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);
    if (entryId) {
      formData.append("entry_id", entryId);
    }

    const response = await apiClient.post<IMediaUploadResponse>(
      "/media/upload",
      formData
    );

    return response.media_file.file_url;
  },

  delete: async (mediaId: string): Promise<void> => {
    await apiClient.delete(`/media/${mediaId}`);
  },
};
