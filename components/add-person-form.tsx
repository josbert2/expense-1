"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddPersonFormProps {
  onSubmit: (person: { name: string }) => void
  onCancel: () => void
}

export function AddPersonForm({ onSubmit, onCancel }: AddPersonFormProps) {
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError("El nombre es obligatorio")
      return
    }

    onSubmit({ name })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm text-gray-300">
          Nombre
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError("")
          }}
          placeholder="Nombre de la persona"
          className="h-10 text-sm bg-gray-800/70 border-gray-700/50 text-white focus:border-blue-500/50 focus:ring-blue-500/20"
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="text-gray-400 hover:text-white hover:bg-gray-800/70"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0"
        >
          Guardar
        </Button>
      </div>
    </form>
  )
}
