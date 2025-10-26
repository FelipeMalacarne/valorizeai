import { FormEventHandler } from "react"
import { useForm } from "@inertiajs/react"

import MultiFileUpload from "@/components/multi-file-upload"
import InputError from "@/components/input-error"
import { Button } from "@/components/ui/button"
import type { FileWithPreview } from "@/hooks/use-file-upload"

type ImportTransactionsFormData = {
  files: File[]
}

type ImportTransactionsFormProps = {
  onClose?: () => void
}

export const ImportTransactionsForm = ({ onClose }: ImportTransactionsFormProps) => {
  const { data, setData, post, processing, errors, reset } = useForm<
    ImportTransactionsFormData
  >({
    files: [],
  })

  const handleFilesChange = (fileEntries: FileWithPreview[]) => {
    const files = fileEntries
      .map((entry) => (entry.file instanceof File ? entry.file : null))
      .filter((file): file is File => Boolean(file))

    setData("files", files)
  }

  const submit: FormEventHandler = (event) => {
    event.preventDefault()


    post(route("imports.store"), {
      forceFormData: true,
      onSuccess: () => {
        reset()
        onClose?.()
      },
    })
  }


  return (
    <form className="space-y-4" onSubmit={submit}>
      <MultiFileUpload
        name="files"
        onChange={handleFilesChange}
        disabled={processing}
        accept=".csv,.ofx"
        maxFiles={20}
      />

      {Object.keys(errors)
        .filter((key) => key.startsWith("files."))
        .map((key) => (
          <InputError key={key} message={errors[key as keyof typeof errors]} />
        ))}
      <InputError message={errors.files} />
        <Button className="w-full" type="submit" disabled={processing || data.files.length === 0}>
          Importar
        </Button>
    </form>
  )
}

export default ImportTransactionsForm
