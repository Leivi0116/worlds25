"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

interface TicketFormProps {
  ticket: {
    type: string
    price: number
    quantity: number
    id: string
  }
  seats: string[]
  onSubmit: (data: any) => void
  onBack: () => void
}

function generatePaymentCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = "PRC-RRW25-"
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export default function TicketForm({ ticket, seats, onSubmit, onBack }: TicketFormProps) {
  const [paymentCode, setPaymentCode] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    screenshotFile: null as File | null,
    termsAccepted: false,
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(900)
  const [uploadedFileName, setUploadedFileName] = useState("")
  const dragRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setPaymentCode(generatePaymentCode())
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setErrors({ submit: "Your 15-minute hold has expired. Please re-select your tickets." })
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dragRef.current) {
      dragRef.current.classList.add("border-primary", "bg-primary/5")
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dragRef.current) {
      dragRef.current.classList.remove("border-primary", "bg-primary/5")
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dragRef.current) {
      dragRef.current.classList.remove("border-primary", "bg-primary/5")
    }

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        screenshotFile: "Only image files are allowed (JPG, PNG, etc.)",
      }))
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        screenshotFile: "File size must be less than 10MB",
      }))
      return
    }

    setFormData((prev) => ({
      ...prev,
      screenshotFile: file,
    }))
    setUploadedFileName(file.name)
    setErrors((prev) => ({
      ...prev,
      screenshotFile: "",
    }))
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0])
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required"
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Valid email address is required"
    }
    if (!formData.contact.trim()) {
      newErrors.contact = "Mobile number is required"
    }
    if (!formData.screenshotFile) {
      newErrors.screenshotFile = "Payment proof screenshot is required"
    }
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "You must agree to the terms before continuing"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append("file", formData.screenshotFile!)
      uploadFormData.append("paymentCode", paymentCode)

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      })

      if (!uploadResponse.ok) throw new Error("Failed to process screenshot")

      const uploadData = await uploadResponse.json()

      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          contact: formData.contact,
          ticket,
          seats,
          paymentCode,
          totalAmount: ticket.price * ticket.quantity,
          timestamp: new Date().toISOString(),
          fileUrl: uploadData.fileUrl,
        }),
      })

      if (!response.ok) throw new Error("Failed to submit form")

      onSubmit({
        name: formData.name,
        email: formData.email,
        contact: formData.contact,
        ticket,
        seats,
        paymentCode,
        totalAmount: ticket.price * ticket.quantity,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error submitting form:", error)
      setErrors({ submit: "Something went wrong. Please try again or contact support." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalAmount = ticket.price * ticket.quantity

  return (
    <div className="min-h-screen bg-background">
      <div className="text-center mb-16 relative w-full">
          <div className="absolute inset-0 opacity-100">
            <img src="/ticket-header.png" alt="" className="w-full h-full object-cover " />
          </div>
          <h1 style={{ fontFamily: "Anton" }} className="text-[100px] leading-none py-20 text-white mb-8 relative z-10">
            COMPLETE YOUR  PURCHASE
          </h1>

          <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-12 relative z-10 py-10">
            <div className="text-left">
              <p style={{ fontFamily: "Montserrat" }} className="text-xs text-[#CBAD90] uppercase tracking-widest">
                LOL
              </p>
              <p style={{ fontFamily: "Montserrat" }} className="text-xs text-[#CBAD90] uppercase tracking-widest">
                ESPORTS
              </p>
            </div>
            <div className="text-left">
              <p style={{ fontFamily: "Montserrat" }} className="text-xs text-[#CBAD90] uppercase tracking-widest">
                WATCH PARTY &
              </p>
              <p style={{ fontFamily: "Montserrat" }} className="text-xs text-[#CBAD90] uppercase tracking-widest">
                MINI FAN FEST
              </p>
            </div>
            <div className="text-left">
              <p style={{ fontFamily: "Montserrat" }} className="text-xs text-[#CBAD90] uppercase tracking-widest">
                MEET AND
              </p>
              <p style={{ fontFamily: "Montserrat" }} className="text-xs text-[#CBAD90] uppercase tracking-widest">
                GREETS
              </p>
            </div>
            <div className="text-left">
              <p style={{ fontFamily: "Montserrat" }} className="text-xs text-[#CBAD90] uppercase tracking-widest">
                EXCLUSIVE
              </p>
              <p style={{ fontFamily: "Montserrat" }} className="text-xs text-[#CBAD90] uppercase tracking-widest">
                MERCH
              </p>
            </div>
            <div className="text-left">
              <p style={{ fontFamily: "Montserrat" }} className="text-xs text-[#CBAD90] uppercase tracking-widest">
                NOVEMBER
              </p>
              <p style={{ fontFamily: "Montserrat" }} className="text-xs text-[#CBAD90] uppercase tracking-widest">
                9TH
              </p>
            </div>
            <div className="text-left">
              <p style={{ fontFamily: "Montserrat" }} className="text-xs text-[#CBAD90] uppercase tracking-widest">
                EARN YOUR
              </p>
              <p style={{ fontFamily: "Montserrat" }} className="text-xs text-[#CBAD90] uppercase tracking-widest">
                LEGACY
              </p>
            </div>
          </div>
        </div>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-lg text-muted-foreground">
            Your seat is on hold for 15 minutes. Please complete your payment and upload proof before time runs out.
          </p>
          <div className="mt-4 text-2xl ">⏱️ {formatTime(timeRemaining)}</div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="md:col-span-2">
            <Card className="border border-border bg-card p-6 shadow-md">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4 mb-6">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    Your Payment Reference Code
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <code className="flex-1 bg-input p-3 rounded font-mono text-lg  border border-border">
                      {paymentCode}
                    </code>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(paymentCode)
                      }}
                      className="border-border text-primary hover:bg-primary/10"
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    💡 Copy your Payment Reference Code (PRC) and include it in your GCash or bank transfer notes.
                  </p>
                </div>

               <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4 mb-6">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Payment Methods</p>
                  <div className="space-y-4">
                    <div className="border border-border rounded p-4 bg-muted/30">
                      <p className="font-semibold text-foreground mb-2">GCash</p>
                      <div className=" opacity-100 m-10">
                          <img src="/gcash.png" alt="" className="w-full h-full object-cover " />
                        </div>
                      <p className="text-lg mb-2 text-center">Number: 095* ****026 </p>
                      
                      <p className="text-xs text-destructive font-semibold">
                        ⚠️ Important: Type your Payment Reference Code in the GCash note before sending.
                      </p>
                    </div>
                    <div className="border border-border rounded p-4 bg-muted/30">
                      <p className="font-semibold text-foreground mb-2"></p>
                      <p className="text-sm text-muted-foreground mb-2">Bank: UnionBank</p>
                      <div className=" opacity-100 m-10">
                          <img src="/ub.png" alt="" className="w-full h-full object-cover " />
                        </div>
                      <p className="text-lg mb-2 text-center mb-2">Account Number: **** **** 9999</p>
                      <p className="text-xs text-destructive font-semibold">
                        ⚠️ Please include your Payment Reference Code in the transaction note.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Buyer Information */}
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">Full Name</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">
                    Mobile Number
                  </label>
                  <Input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    placeholder="+63 9XX XXX XXXX"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                  {errors.contact && <p className="text-xs text-destructive mt-1">{errors.contact}</p>}
                </div>

                {/* Payment Proof Upload */}
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">
                    📸 Upload Payment Screenshot
                  </label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Drag & drop or click to upload (JPG, PNG - max 10 MB)
                  </p>

                  <div
                    ref={dragRef}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer transition-all duration-300 hover:border-primary/60 hover:bg-primary/5"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                      id="file-input"
                    />
                    <label htmlFor="file-input" className="cursor-pointer block">
                      {uploadedFileName ? (
                        <div>
                          <p className="text-2xl mb-2">✅</p>
                          <p className="text-sm font-semibold text-primary">{uploadedFileName}</p>
                          <p className="text-xs text-muted-foreground mt-2">Click to change file</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-3xl mb-2">📤</p>
                          <p className="text-sm font-semibold text-foreground">Drag your screenshot here</p>
                          <p className="text-xs text-muted-foreground mt-2">or click to browse</p>
                        </div>
                      )}
                    </label>
                  </div>
                  {errors.screenshotFile && <p className="text-xs text-destructive mt-2">{errors.screenshotFile}</p>}

                  <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4 mt-4">
                    <p className="text-xs text-muted-foreground mb-2">
                      <span className="font-semibold ">How it works:</span>
                    </p>
                    <ol className="text-xs text-muted-foreground space-y-1 ml-4 list-decimal">
                      <li>Take a screenshot of your payment confirmation</li>
                      <li>Drag & drop it here or click to upload</li>
                      <li>We'll automatically store it in our system</li>
                      <li>The image will be saved in Google Sheets</li>
                    </ol>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onCheckedChange={(checked) => {
                      setFormData((prev) => ({
                        ...prev,
                        termsAccepted: checked as boolean,
                      }))
                      if (errors.termsAccepted) {
                        setErrors((prev) => ({
                          ...prev,
                          termsAccepted: "",
                        }))
                      }
                    }}
                    className="mt-2 border-white border-1 "
                  />
                  <label htmlFor="terms" className="text-sm  cursor-pointer">
                    I understand that all ticket sales are final and non-refundable, and I agree to the event
                    guidelines.
                  </label>
                </div>
                {errors.termsAccepted && <p className="text-xs text-destructive">{errors.termsAccepted}</p>}

                {errors.submit && <p className="text-sm text-destructive font-semibold">{errors.submit}</p>}

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    disabled={isSubmitting}
                    className="flex-1 border-border text-primary hover:bg-primary/10 bg-transparent"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || timeRemaining === 0}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold uppercase tracking-wider shadow-md"
                  >
                    {isSubmitting ? "Processing..." : "✅ Confirm & Submit"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="border border-border bg-card p-6 sticky top-4 shadow-md">
              <h3 className="text-2xl text-white mb-4">
                ORDER SUMMARY
              </h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {ticket.type} × {ticket.quantity}
                  </span>
                  <span className="text-foreground font-semibold ">
                    ₱{(ticket.price * ticket.quantity).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">TOTAL</span>
                  <span className="text-3xl ">₱{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-secondary/10 border border-secondary/30 rounded p-3 text-xs text-muted-foreground space-y-2">
                <p>
                  <span className="">✓</span> Secure payment
                </p>
                <p>
                  <span className="">✓</span> Instant confirmation
                </p>
                <p>
                  <span className="">✓</span> Email verification
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
