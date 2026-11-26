import { useQuery } from '@tanstack/react-query'
import { paymentService } from '@/services/event-payment.service'

export function usePublicPaymentOptions(eventId: string) {
  return useQuery({
    queryKey: ['public-payment-options', eventId],
    queryFn: () => paymentService.findPublicOptions(eventId),
    enabled: Boolean(eventId),
  })
}
