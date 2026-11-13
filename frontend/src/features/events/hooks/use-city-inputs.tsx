import { useEffect, useRef, useState } from 'react'
import type { City } from '@/services/ibge.service'
import { ibgeService } from '@/services/ibge.service'

export function useCityInput(value: string, onChange: (value: string) => void) {
  const inputRef = useRef<HTMLDivElement>(null)

  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(false)

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  })

  useEffect(() => {
    const query = value.trim()
    
    const isSelectedCity = /\s-\s[A-Z]{2}$/i.test(query)

    if (selected || isSelectedCity) {
      setCities([])
      setOpen(false)
      setLoading(false)
      return
    }

    if (query.length < 2) {
      setCities([])
      setOpen(false)
      setLoading(false)
      return
    }

    let active = true

    const timeout = setTimeout(async () => {
      try {
        setLoading(true)

        const results = await ibgeService.searchCities(query)

        if (active) {
          setCities(results)
          setOpen(true)
        }
      } catch {
        if (active) {
          setCities([])
          setOpen(false)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }, 300)

    return () => {
      active = false
      clearTimeout(timeout)
    }
  }, [value, selected])

  useEffect(() => {
    if (!open || !inputRef.current) return

    function updatePosition() {
      const rect = inputRef.current?.getBoundingClientRect()

      if (!rect) return

      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      })
    }

    updatePosition()

    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)

    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [open])

  function handleSelect(city: City) {
    setSelected(true)
    setOpen(false)
    setCities([])
    onChange(`${city.name} - ${city.state}`)
  }

  function handleChange(newValue: string) {
    setSelected(false)
    onChange(newValue)
  }

  return {
    inputRef,
    cities,
    loading,
    open,
    position,
    handleSelect,
    handleChange,
  }
}
