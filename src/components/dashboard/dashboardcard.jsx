export default function DashboardCard({
  title,
  value,
  icon: Icon,
  color,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2 text-gray-800">
            {value}
          </h2>

        </div>

        <div className={`${color} p-4 rounded-xl text-white`}>
          <Icon size={28} />
        </div>

      </div>

    </div>
  );
}