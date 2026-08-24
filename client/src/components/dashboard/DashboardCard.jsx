export default function DashboardCard({
  title,
  value,
  icon: Icon,
  color = "bg-emerald-600",
}) {
  // Mapping color to light background, accent color, and border
  const colorMap = {
    "bg-emerald-600": {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-l-emerald-500",
      gradient: "from-emerald-500/10 to-transparent",
    },
    "bg-blue-600": {
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-l-blue-500",
      gradient: "from-blue-500/10 to-transparent",
    },
    "bg-yellow-500": {
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "border-l-amber-500",
      gradient: "from-amber-500/10 to-transparent",
    },
    "bg-purple-600": {
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "border-l-purple-500",
      gradient: "from-purple-500/10 to-transparent",
    },
  };

  const scheme = colorMap[color] || {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-l-emerald-500",
    gradient: "from-emerald-500/10 to-transparent",
  };

  return (
    <div
      className={`
        relative
        overflow-hidden
        bg-white
        rounded-3xl
        p-5
        sm:p-6
        border
        border-gray-100
        border-l-4
        ${scheme.border}
        shadow-sm
        hover:shadow-xl
        hover:-translate-y-1
        transition-all
        duration-300
        group
      `}
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
    >
      {/* Subtle top-right background gradient */}
      <div
        className={`
          absolute
          -top-12
          -right-12
          w-28
          h-28
          rounded-full
          bg-gradient-to-br
          ${scheme.gradient}
          pointer-events-none
          group-hover:scale-150
          transition-transform
          duration-500
        `}
      />

      <div className="relative flex justify-between items-center gap-3">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-400">
            {title}
          </p>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1 sm:mt-1.5 tracking-tight truncate">
            {value}
          </h2>
        </div>

        <div
          className={`
            ${scheme.bg}
            ${scheme.text}
            shrink-0
            p-3.5
            sm:p-4
            rounded-2xl
            group-hover:scale-110
            transition-transform
            duration-300
            shadow-inner
          `}
        >
          <Icon
            size={24}
            className="sm:w-7 sm:h-7 stroke-[2.2]"
          />
        </div>
      </div>
    </div>
  );
}
