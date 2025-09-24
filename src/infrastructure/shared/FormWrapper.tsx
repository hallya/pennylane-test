import { ReactNode } from 'react'
import { useForm, FormProvider, UseFormReturn, DefaultValues } from 'react-hook-form'

interface FormWrapperProps<T extends Record<string, any>, P = {}> {
  children: (form: UseFormReturn<T>, props?: P) => ReactNode
  defaultValues?: DefaultValues<T>
  onSubmit?: (data: T) => void
  childrenProps?: P
}

export function FormWrapper<T extends Record<string, any>, P = {}>({
  children,
  defaultValues,
  onSubmit,
  childrenProps,
}: FormWrapperProps<T, P>) {
  const form = useForm<T>({
    defaultValues,
  })

  const handleSubmit = onSubmit ? form.handleSubmit(onSubmit) : undefined

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit}>
        {children(form, childrenProps)}
      </form>
    </FormProvider>
  )
}