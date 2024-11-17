'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Copy, ChevronDown, ChevronUp, TrendingUp, TrendingDown } from 'lucide-react'
import { TokenInfo } from '@/types'
import { useResponsivePrice } from '@/hooks/useResponsivePrice'
import { cn } from '@/lib/utils'

const getPnLColor = (value: number) => {
    if (value >= 0) return 'text-green-500'
    return 'text-red-500'
}

export default function Component({ token }: { token: TokenInfo }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const formattedPrice = useResponsivePrice(token.price || 0)

    const copyMintAddress = () => {
        if (token.mint) {
            navigator.clipboard.writeText(token.mint)
            toast.success('Token ID copied to clipboard', { duration: 2000 })
        }
    }

    const profitLoss = (token.usdValue || 0) - (token.investedAmount || 0)
    const isProfitable = profitLoss >= 0

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
            <div className="p-4 sm:p-6">
                <div className="flex flex-row justify-between items-center mb-4 gap-2 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="flex-shrink-0">
                            {token.logoURI ? (
                                <img src={token.logoURI} alt={`${token.name} logo`} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full" />
                            ) : (
                                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    <span className="text-xl sm:text-2xl font-semibold text-gray-600 dark:text-gray-300">{token.symbol?.slice(0, 2) || 'TK'}</span>
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                {token.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {token.symbol}
                            </p>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                            ${formattedPrice.type === 'small' ? (
                                <>0.0<sup className="text-sm">{formattedPrice.zeros}</sup>{formattedPrice.significantDigits}</>
                            ) : (
                                formattedPrice.value
                            )}
                        </p>
                        <div className={cn("flex items-center justify-end gap-1", getPnLColor(token.profitLossPercentage || 0))}>
                            {isProfitable ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            <span className="text-sm font-medium">
                                {(token.profitLossPercentage || 0) > 0 ? '+' : ''}
                                {(token.profitLossPercentage || 0).toFixed(2)}%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">You own</p>
                        <p className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                            {token.uiAmount?.toLocaleString() || '0'} {token.symbol}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total value</p>
                        <p className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                            ${(token.usdValue || 0).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </p>
                    </div>
                </div>

                <motion.div
                    initial={false}
                    animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                >
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">You invested</p>
                            <p className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                                ${(token.investedAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Your profit/loss</p>
                            <p className={cn("text-lg sm:text-xl font-semibold", getPnLColor(profitLoss))}>
                                {profitLoss > 0 ? '+' : ''}${profitLoss.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 relative overflow-hidden">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                            Performance
                        </p>
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <div className="flex-1 h-8 sm:h-12 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden">
                                <div
                                    className={cn("h-full", isProfitable ? "bg-green-500" : "bg-red-500")}
                                    style={{
                                        width: `${Math.min(Math.abs((token.profitLossPercentage || 0)), 100)}%`
                                    }}
                                />
                            </div>
                            <div className="flex flex-col items-end">
                                <p className={cn("text-lg sm:text-xl font-bold", getPnLColor(token.profitLossPercentage || 0))}>
                                    {(token.profitLossPercentage || 0) > 0 ? '+' : ''}
                                    {(token.profitLossPercentage || 0).toFixed(2)}%
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Token ID</p>
                        <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-600 dark:text-gray-300 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                {token.mint ? `${token.mint.slice(0, 6)}...${token.mint.slice(-6)}` : 'N/A'}
                            </span>
                            <button
                                onClick={copyMintAddress}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                                aria-label="Copy token ID"
                            >
                                <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-4 w-full flex items-center justify-center space-x-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    aria-expanded={isExpanded}
                    aria-controls="token-details"
                >
                    <span>{isExpanded ? 'Hide' : 'Show'} details</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
            </div>
        </motion.div>
    )
}