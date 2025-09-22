import { useForm } from 'react-hook-form'

export interface FormConfig<T = any> {
  onSubmit: (data: T) => Promise<void> | void
  initialValues?: Partial<T>
  mode?: 'onChange' | 'onBlur' | 'onSubmit'
}

export function useFormManager<T extends Record<string, any>>(config: FormConfig<T>) {
  const { onSubmit, initialValues = {}, mode = 'onChange' } = config

  const form = useForm<T>({
    defaultValues: initialValues as any,
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