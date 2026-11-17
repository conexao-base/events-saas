import axios from 'axios'

interface ApiErrorResponse {
  message?: string
  errors?: {
    code?: string
    description?: string
  }[]
}

export function getApiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return 'Ocorreu um erro inesperado.'
  }

  const response = error.response

  if (!response) {
    return 'Não foi possível conectar ao servidor.'
  }

  const data = response.data

  if (data.errors?.length) {
    return data.errors
      .map((item) => item.description)
      .filter(Boolean)
      .join(', ')
  }

  return data.message ?? 'Não foi possível concluir a operação.'
}
