import { useForm, DefaultValues } from 'react-hook-form'

export interface FormConfig<T = Record<string, unknown>> {
  onSubmit: (data: T) => Promise<void> | void
  initialValues?: Partial<T>
  mode?: 'onChange' | 'onBlur' | 'onSubmit'
}

export function useFormManager<T extends Record<string, unknown>>(config: FormConfig<T>) {
  const { onSubmit, initialValues = {}, mode = 'onChange' } = config

  const form = useForm<T>({
    defaultValues: initialValues as DefaultValues<T>,
    mode,
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Form submission error:', error)
      alert('Une erreur est survenue lors de la soumission')
    }
  })

  return {
    form,
    handleSubmit,
  }
}