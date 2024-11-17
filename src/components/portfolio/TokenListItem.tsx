'use client'

import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Copy, TrendingUp, TrendingDown } from 'lucide-react'
import { TokenInfo } from '@/types'
import { useResponsivePrice } from '@/hooks/useResponsivePrice'
import { cn } from '@/lib/utils'

const getPnLColor = (value: number) => {
    if (value > 10) return 'text-emerald-400'
    if (value > 0) return 'text-emerald-500'
    if (value < -10) return 'text-rose-400'
    return 'text-rose-500'
}

export default function Component({ token }: { token: TokenInfo }) {
    const formattedPrice = useResponsivePrice(token.price || 0)
    const isProfitable = (token.profitLossPercentage || 0) > 0

    const copyMintAddress = () => {
        if (token.mint) {
            navigator.clipboard.writeText(token.mint)
            toast.success('Mint address copied to clipboard', { duration: 2000 })
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            layout
            layoutId={token.mint}
            className="w-full max-w-2xl mx-auto bg-white/90 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg overflow-hidden"
        >
            <div className="p-4 sm:p-6">
                <div className="flex flex-row justify-between items-start mb-4 gap-2 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 w-fit max-w-[66.666%] overflow-hidden">
                        <div className="flex-shrink-0">
                            {token.logoURI ? (
                                <img src={token.logoURI} alt={`${token.name} logo`} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full" />
                            ) : (
                                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                    <span className="text-xl sm:text-2xl font-semibold text-gray-600 dark:text-gray-300">
                                        {token.symbol?.slice(0, 2) || 'TK'}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-0.5 truncate">
                                {token.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {token.symbol}
                            </p>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                            ${(token.usdValue || 0).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
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
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-0.5">Holding</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white truncate">
                            {token.uiAmount?.toLocaleString() || '0'} {token.symbol}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-0.5">Market Price</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                            ${formattedPrice.type === 'small' ? (
                                <>0.0<sup className="text-sm">{formattedPrice.zeros}</sup>{formattedPrice.significantDigits}</>
                            ) : (
                                formattedPrice.value
                            )}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-0.5">Total Invested</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                            ${(token.investedAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-0.5">Profit/Loss</p>
                        <div className="flex items-center space-x-2">
                            <div className={cn("w-1 h-6 rounded-full", isProfitable ? "bg-emerald-500" : "bg-rose-500")} />
                            <p className={cn("text-base font-semibold", getPnLColor(token.profitLossPercentage || 0))}>
                                {isProfitable ? '+' : '-'}$
                                {Math.abs((token.usdValue || 0) - (token.investedAmount || 0)).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-4">
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

                <div className="bg-gray-50 dark:bg-gradient-to-br dark:from-gray-800/80 dark:to-gray-900/90 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Profit/Loss Details
                    </p>
                    <div className="flex items-center space-x-4">
                        <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                            <div
                                className={cn("h-full", isProfitable ? "bg-emerald-500" : "bg-rose-500")}
                                style={{
                                    width: `${Math.min(Math.abs((token.profitLossPercentage || 0)), 100)}%`
                                }}
                            />
                        </div>
                        <div className="flex flex-col items-end">
                            <p className={cn("text-base font-bold", getPnLColor(token.profitLossPercentage || 0))}>
                                {(token.profitLossPercentage || 0) > 0 ? '+' : ''}
                                {(token.profitLossPercentage || 0).toFixed(2)}%
                            </p>
                            <p className={cn("text-sm font-semibold", getPnLColor(token.profitLossPercentage || 0))}>
                                {isProfitable ? '+' : '-'}$
                                {Math.abs((token.usdValue || 0) - (token.investedAmount || 0)).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}