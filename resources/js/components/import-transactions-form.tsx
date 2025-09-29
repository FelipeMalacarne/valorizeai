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

  const handleCancel = () => {
    reset()
    onClose?.()
  }

  const submit: FormEventHandler = (event) => {
    event.preventDefault()
        console.log(data.files)

    post(route("imports.store"), {
      forceFormData: true,
      onSuccess: () => {
        reset()
        onClose?.()
      },
    })
  }

    console.log(errors['files.0'])
  return (
    <form className="space-y-4" onSubmit={submit}>
      <MultiFileUpload name="files" onChange={handleFilesChange} disabled={processing} />

            {/* make a input error for each files error */}
        {errors.files && Array.isArray(errors.files) ? (
            errors.files.map((error, index) => (
                <InputError key={index} message={error} />
            )
        )) : (
            <InputError message={errors.files} />
        )}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={handleCancel} disabled={processing}>
          Cancelar
        </Button>
        <Button type="submit" disabled={processing || data.files.length === 0}>
          Importar
        </Button>
      </div>
    </form>
  )
}

export default ImportTransactionsForm
