/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from "axios";
import { toast } from "sonner";

const errorResponse = (error: AxiosError) => {
  if (error?.response?.data) {
    const message = error.response.data as any;
    toast.error(message.message);
    return;
  }
  toast.error(error.message);
};

export default errorResponse;
