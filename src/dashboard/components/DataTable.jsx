export default function DataTable({ data }) {
  return (
    <div className="overflow-x-auto">
      <table className="">
        <thead className="">
          <tr>
            <th className="">#</th>
            <th className="">الصورة</th>
            <th className="">العنوان</th>
            <th className="">الإجراءات</th>
          </tr>
        </thead>

        <tbody className="">
          {Boolean(data?.length) && (
            <>
              {data?.map((item, index) => (
                <tr key={index} className="">
                  <td className="">{index + 1}</td>
                  <td className="">
                    <img
                      src={item?.imageUrl}
                      alt={item?.title}
                      className="w-16 h-16 object-cover rounded-full"
                    />
                  </td>
                  <td className="">{item?.title}</td>
                  <td className="">
                    <button className="">تعديل</button>
                    <button className="">حذف</button>
                  </td>
                </tr>
              ))}
            </>
          )}

          {Boolean(!data?.length) && (
            <tr>
              <td colSpan="4" className="">
                لا توجد بيانات للعرض
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
