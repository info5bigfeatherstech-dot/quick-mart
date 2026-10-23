import { useMutation } from '@tanstack/react-query';
import { submitContactForm } from '@/api/contactApi';
import { toast } from 'sonner';

/**
 * Hook to submit contact form message
 */
export const useSubmitContact = () => {
  return useMutation({
    mutationFn: (formData) => submitContactForm(formData),
    onSuccess: (response) => {
      const ticketId = response.data?.ticketId;
      toast.success(
        ticketId
          ? `Thanks, we will get back to you soon! (Ticket #${ticketId})`
          : 'Thanks, we will get back to you soon!'
      );
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Could not send message. Please try again.';
      toast.error(message);
    },
  });
};
