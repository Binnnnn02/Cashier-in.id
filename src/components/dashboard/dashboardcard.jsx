export default function DashboardCard({
  title,
  value,
  icon: Icon,
  color,
}) {
  return (
    <div
      className="
        bg-white
        rounded-2xl
        shadow-sm
        p-4
        sm:p-5
        lg:p-6
        hover:shadow-lg
        transition
      "
    >
      <div className="flex justify-between items-center gap-3">

        <div className="min-w-0">

          <p className="text-gray-500 text-xs sm:text-sm truncate">
            {title}
          </p>

          <h2
            className="
              text-xl
              sm:text-2xl
              lg:text-3xl
              font-bold
              mt-1
              sm:mt-2
              text-gray-800
              truncate
            "
          >
            {value}
          </h2>

        </div>

        <div
          className={`
            ${color}
            shrink-0
            p-3
            sm:p-4
            rounded-xl
            text-white
          `}
        >
          <Icon
            size={24}
            className="sm:w-7 sm:h-7"
          />
        </div>

      </div>

    </div>
  );
}