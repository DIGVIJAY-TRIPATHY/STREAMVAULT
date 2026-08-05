import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const COLOR_MAP = {
    indigo: {
        bg: 'bg-indigo-50 dark:bg-indigo-950/50',
        text: 'text-indigo-600 dark:text-indigo-400',
    },
    teal: {
        bg: 'bg-teal-50 dark:bg-teal-950/50',
        text: 'text-teal-600 dark:text-teal-400',
    },
    amber: {
        bg: 'bg-amber-50 dark:bg-amber-950/50',
        text: 'text-amber-600 dark:text-amber-400',
    },
    rose: {
        bg: 'bg-rose-50 dark:bg-rose-950/50',
        text: 'text-rose-600 dark:text-rose-400',
    },
};

export default function StatsCard({ title, value, icon: Icon, change, color = 'indigo' }) {
    const isPositive = change && !change.startsWith('-');
    const colorStyle = COLOR_MAP[color] || COLOR_MAP.indigo;

    return (
        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-slate-900">
            <div className="flex items-start justify-between">
                <div>
                    {/* Large Value */}
                    <p className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {value}
                    </p>
                    {/* Subtitle / Title */}
                    <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                        {title}
                    </p>
                </div>

                {/* Top-Right Icon in Circle */}
                {Icon && (
                    <div className={`rounded-full p-3 ${colorStyle.bg} ${colorStyle.text}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                )}
            </div>

            {/* Optional Change Indicator */}
            {change && (
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold">
                    {isPositive ? (
                        <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400">
                            <ArrowUpRight className="h-3.5 w-3.5" />
                            {change}
                        </span>
                    ) : (
                        <span className="inline-flex items-center text-rose-600 dark:text-rose-400">
                            <ArrowDownRight className="h-3.5 w-3.5" />
                            {change}
                        </span>
                    )}
                    <span className="text-slate-400 dark:text-slate-500">vs last period</span>
                </div>
            )}
        </div>
    );
}
