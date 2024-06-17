"use client"


import { useEffect, useState } from "react"
import ProModal from "./ProModal"

const ModalProvider = () => {

    const [isMounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!isMounted) return null


  return (
    <>
        <ProModal />
    </>
  )
}

export default ModalProvider