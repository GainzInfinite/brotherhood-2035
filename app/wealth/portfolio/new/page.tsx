"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Info } from "lucide-react"
import toast from 'react-hot-toast'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function NewHoldingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    assetName: '',
    ticker: '',
    quantity: '',
    priceUsd: '',
    category: 'crypto',
    notes: '',
    yieldRate: '',
    isApiLinked: false,
    currency: 'USD'
  })

  // Reset certain fields when category changes
  useEffect(() => {
    if (formData.category === 'savings') {
      setFormData(prev => ({ ...prev, ticker: '', priceUsd: '1.00', isApiLinked: false }))
    }
  }, [formData.category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          // Ensure numbers are sent as numbers or strings that can be parsed
          quantity: parseFloat(formData.quantity),
          priceUsd: parseFloat(formData.priceUsd),
          yieldRate: formData.yieldRate ? parseFloat(formData.yieldRate) : null,
        })
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Holding added successfully!')
        router.push('/wealth/portfolio')
      } else {
        toast.error(result.error || 'Failed to add holding')
      }
    } catch (error) {
      console.error('Error adding holding:', error)
      toast.error('Failed to add holding')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isApiLinked: checked
    }))
  }

  const isSavings = formData.category === 'savings'
  const isCrypto = formData.category === 'crypto'

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <Link href="/wealth/portfolio">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </button>
        </Link>
        <h1 className="text-4xl font-bold text-gold mb-2">Add New Asset</h1>
        <p className="text-gray-400">Track a new asset in your portfolio</p>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Asset Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gold"
              required
            >
              <option value="crypto">Cryptocurrency</option>
              <option value="stock">Stock</option>
              <option value="etf">ETF</option>
              <option value="savings">Savings / Cash</option>
              <option value="real_estate">Real Estate</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {isSavings ? 'Account Name *' : 'Asset Name *'}
              </label>
              <input
                type="text"
                name="assetName"
                value={formData.assetName}
                onChange={handleChange}
                placeholder={isSavings ? "e.g. High Yield Savings" : "e.g. Bitcoin, Tesla"}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                required
              />
            </div>

            {!isSavings && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Ticker Symbol {formData.category !== 'other' && '*'}
                </label>
                <input
                  type="text"
                  name="ticker"
                  value={formData.ticker}
                  onChange={handleChange}
                  placeholder="e.g. BTC, TSLA"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold font-mono"
                  required={formData.category !== 'other'}
                />
              </div>
            )}
            
            {isSavings && (
               <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Currency *
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gold"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="AUD">AUD ($)</option>
                </select>
              </div>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {isSavings ? 'Balance *' : 'Quantity *'}
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0.00"
                step="0.000001"
                min="0"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {isSavings ? 'Exchange Rate to USD *' : 'Price per Unit (USD) *'}
              </label>
              <input
                type="number"
                name="priceUsd"
                value={formData.priceUsd}
                onChange={handleChange}
                placeholder="1.00"
                step="0.000001"
                min="0"
                disabled={formData.isApiLinked}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold font-mono disabled:opacity-50"
                required
              />
              {isSavings && formData.currency === 'USD' && (
                <p className="text-xs text-gray-500 mt-1">Keep as 1.00 for USD accounts</p>
              )}
            </div>
          </div>

          {/* Advanced Options: Yield & API */}
          <div className="p-4 bg-gray-900/30 rounded-lg border border-gray-800 space-y-4">
            <h3 className="text-sm font-medium text-gold uppercase tracking-wider">Advanced Options</h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Annual Yield (APY %)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="yieldRate"
                    value={formData.yieldRate}
                    onChange={handleChange}
                    placeholder="e.g. 5.0"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold font-mono pr-8"
                  />
                  <span className="absolute right-3 top-2 text-gray-500">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Used to calculate projected monthly income</p>
              </div>

              {isCrypto && (
                <div className="flex items-center justify-between bg-gray-900 p-3 rounded-lg border border-gray-700">
                  <div className="space-y-0.5">
                    <Label htmlFor="api-mode" className="text-base text-foreground">Live Price Tracking</Label>
                    <p className="text-xs text-muted-foreground">Fetch price automatically</p>
                  </div>
                  <Switch
                    id="api-mode"
                    checked={formData.isApiLinked}
                    onCheckedChange={handleSwitchChange}
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional notes about this holding..."
              rows={3}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold resize-none"
            />
          </div>

          {/* Preview */}
          {formData.assetName && formData.quantity && formData.priceUsd && (
            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
              <h3 className="text-sm font-medium text-foreground mb-2">Preview</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Asset:</span>
                  <span className="text-foreground">{formData.assetName} {formData.ticker ? `(${formData.ticker})` : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Value:</span>
                  <span className="text-gold font-bold font-mono">
                    ${(parseFloat(formData.quantity) * parseFloat(formData.priceUsd)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                {formData.yieldRate && (
                  <div className="flex justify-between border-t border-gray-700 pt-1 mt-2">
                    <span className="text-muted-foreground">Est. Monthly Income:</span>
                    <span className="text-green-400 font-mono">
                      +${((parseFloat(formData.quantity) * parseFloat(formData.priceUsd) * (parseFloat(formData.yieldRate) / 100)) / 12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-gold text-black px-6 py-3 rounded-lg font-medium hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              {loading ? 'Adding...' : 'Add Asset'}
            </button>
            <Link href="/wealth/portfolio">
              <button
                type="button"
                className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
